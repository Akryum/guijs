const path = require('path')
const fs = require('fs')
const shortId = require('shortid')
const execa = require('execa')
// @TODO extract into separate plugin package
const { getPromptModules } = require('@vue/cli-global-utils/lib/util/createTools')
const { getFeatures } = require('@vue/cli-global-utils/lib/util/features')
const { defaults } = require('@vue/cli-global-utils/lib/options')
const { getPresets } = require('@vue/cli-global-utils/lib/util/getPresets')
const { resolvePreset } = require('@vue/cli-global-utils/lib/util/resolvePreset')
const { getPresetFromAnswers } = require('@vue/cli-global-utils/lib/util/getPresetFromAnswers')
const PromptModuleAPI = require('@vue/cli-global-utils/lib/PromptModuleAPI')
const { toShortPluginId } = require('@vue/cli-shared-utils')
// -- end
const parseGitConfig = require('parse-git-config')
// Connectors
const progress = require('./progress')
const cwd = require('./cwd')
const prompts = require('./prompts')
const folders = require('./folders')
const plugins = require('./plugins')
const locales = require('./locales')
const logs = require('./logs')
// Context
const getContext = require('../context')
// Utils
const { log } = require('../util/logger')
const { notify } = require('../util/notification')
const { getHttpsGitURL } = require('../util/strings')

const PROGRESS_ID = 'project-create'

let lastProject = null
let currentProject = null
let presets = []
let features = []
let promptCompleteCbs = []

// @TODO
// let onInstallProgress = null
// const onInstallLog = null

function list (context) {
  let projects = context.db.get('projects').value()
  projects = autoClean(projects, context)
  return projects
}

function findOne (id, context) {
  return context.db.get('projects').find({ id }).value()
}

function findByPath (file, context) {
  return context.db.get('projects').find({ path: file }).value()
}

function autoClean (projects, context) {
  const result = []
  for (const project of projects) {
    if (fs.existsSync(project.path)) {
      result.push(project)
    }
  }
  if (result.length !== projects.length) {
    console.log(`Auto cleaned ${projects.length - result.length} projects (folder not found).`)
    context.db.set('projects', result).write()
  }
  return result
}

function getCurrent (context) {
  if (currentProject && !fs.existsSync(currentProject.path)) {
    log('Project folder not found', currentProject.id, currentProject.path)
    return null
  }
  return currentProject
}

function getLast (context) {
  return lastProject
}

function generatePresetDescription (preset) {
  let description = preset.features.join(', ')
  if (preset.raw.useConfigFiles) {
    description += ` (Use config files)`
  }
  return description
}

async function initCreator (context) {
  const promptModules = getPromptModules()
  const promptAPI = new PromptModuleAPI()
  promptModules.forEach(m => m(promptAPI))
  promptCompleteCbs = promptAPI.promptCompleteCbs

  /* Event listeners */

  // @TODO
  // // Progress bar
  // onInstallProgress = value => {
  //   if (progress.get(PROGRESS_ID)) {
  //     progress.set({ id: PROGRESS_ID, progress: value }, context)
  //   }
  // }
  // installProgress.on('progress', onInstallProgress)
  // // Package manager steps
  // onInstallLog = message => {
  //   if (progress.get(PROGRESS_ID)) {
  //     progress.set({ id: PROGRESS_ID, info: message }, context)
  //   }
  // }
  // installProgress.on('log', onInstallLog)

  // Presets
  const manualPreset = {
    id: '__manual__',
    name: 'org.vue.views.project-create.tabs.presets.manual.name',
    description: 'org.vue.views.project-create.tabs.presets.manual.description',
    link: null,
    features: [],
  }
  const presetsData = getPresets()
  presets = [
    ...Object.keys(presetsData).map(
      key => {
        const preset = presetsData[key]
        const features = getFeatures(preset).map(
          f => toShortPluginId(f)
        )
        const info = {
          id: key,
          name: key === 'default' ? 'org.vue.views.project-create.tabs.presets.default-preset' : key,
          features,
          link: null,
          raw: preset,
        }
        info.description = generatePresetDescription(info)
        return info
      }
    ),
    manualPreset,
  ]

  // Features
  features = [
    ...promptAPI.features.map(
      data => ({
        id: data.value,
        name: data.name,
        description: data.description || null,
        link: data.link || null,
        plugins: data.plugins || null,
        enabled: !!data.checked,
      })
    ),
    {
      id: 'use-config-files',
      name: 'org.vue.views.project-create.tabs.features.userConfigFiles.name',
      description: 'org.vue.views.project-create.tabs.features.userConfigFiles.description',
      link: null,
      plugins: null,
      enabled: false,
    },
  ]

  manualPreset.features = features.filter(
    f => f.enabled
  ).map(
    f => f.id
  )

  // Prompts
  await prompts.reset()
  promptAPI.injectedPrompts.forEach(prompts.add)
  await updatePromptsFeatures()
  await prompts.start()
}

function removeCreator (context) {
  // @TODO
  // installProgress.removeListener('progress', onInstallProgress)
  // installProgress.removeListener('log', onInstallLog)
  return true
}

async function getCreation (context) {
  return {
    presets,
    features,
    prompts: prompts.list(),
  }
}

async function updatePromptsFeatures () {
  await prompts.changeAnswers(answers => {
    answers.features = features.filter(
      f => f.enabled
    ).map(
      f => f.id
    )
  })
}

async function setFeatureEnabled ({ id, enabled, updatePrompts = true }, context) {
  const feature = features.find(f => f.id === id)
  if (feature) {
    feature.enabled = enabled
  } else {
    console.warn(`Feature '${id}' not found`)
  }
  if (updatePrompts) await updatePromptsFeatures()
  return feature
}

async function applyPreset (id, context) {
  const preset = presets.find(p => p.id === id)
  if (preset) {
    for (const feature of features) {
      feature.enabled = !!(
        preset.features.includes(feature.id) ||
        (feature.plugins && preset.features.some(f => feature.plugins.includes(f)))
      )
    }
    if (preset.raw) {
      if (preset.raw.router) {
        await setFeatureEnabled({ id: 'router', enabled: true, updatePrompts: false }, context)
      }
      if (preset.raw.vuex) {
        await setFeatureEnabled({ id: 'vuex', enabled: true, updatePrompts: false }, context)
      }
      if (preset.raw.cssPreprocessor) {
        await setFeatureEnabled({ id: 'css-preprocessor', enabled: true, updatePrompts: false }, context)
      }
      if (preset.raw.useConfigFiles) {
        await setFeatureEnabled({ id: 'use-config-files', enabled: true, updatePrompts: false }, context)
      }
    }
    await updatePromptsFeatures()
  } else {
    console.warn(`Preset '${id}' not found`)
  }

  return getCreation(context)
}

async function create (input, context) {
  return progress.wrap(PROGRESS_ID, context, async setProgress => {
    setProgress({
      status: 'creating',
    })

    const targetDir = path.join(cwd.get(), input.folder)

    cwd.set(targetDir, context)

    const inCurrent = input.folder === '.'
    const name = (inCurrent ? path.relative('../', process.cwd()) : input.folder).toLowerCase()

    // Answers
    const answers = prompts.getAnswers()
    await prompts.reset()

    // Config files
    let index
    if ((index = answers.features.indexOf('use-config-files')) !== -1) {
      answers.features.splice(index, 1)
      answers.useConfigFiles = 'files'
    }

    // Preset
    answers.preset = input.preset
    if (input.save) {
      answers.save = true
      answers.saveName = input.save
    }

    setProgress({
      info: 'Resolving preset...',
    })
    let preset
    if (input.preset === '__remote__' && input.remote) {
      // vue create foo --preset bar
      preset = await resolvePreset(input.remote, input.clone)
    } else if (input.preset === 'default') {
      // vue create foo --default
      preset = defaults.presets.default
    } else {
      preset = await getPresetFromAnswers(answers, promptCompleteCbs)
    }
    setProgress({
      info: null,
    })

    // Create
    const args = [
      '--skipGetStarted',
    ]
    if (input.packageManager) args.push('--packageManager', input.packageManager)
    if (input.bar) args.push('--bare')
    if (input.force) args.push('--force')
    // Git
    if (input.enableGit && input.gitCommitMessage) {
      args.push('--git', input.gitCommitMessage)
    } else if (!input.enableGit) {
      args.push('--no-git')
    }
    // Preset
    args.push('--inlinePreset', JSON.stringify(preset))

    log('create', name, args)

    const child = execa('vue', [
      'create',
      name,
      ...args,
    ], {
      cwd: cwd.get(),
      stdio: ['inherit', 'pipe', 'inherit'],
    })

    const onData = buffer => {
      const text = buffer.toString().trim()
      if (text) {
        setProgress({
          info: text,
        })
        logs.add({
          type: 'info',
          message: text,
        }, context)
      }
    }

    child.stdout.on('data', onData)

    await child

    removeCreator()

    notify({
      title: `Project created`,
      message: `Project ${cwd.get()} created`,
      icon: 'done',
    })

    return importProject({
      path: targetDir,
    }, context)
  })
}

async function importProject (input, context) {
  if (!input.force && !fs.existsSync(path.join(input.path, 'node_modules'))) {
    throw new Error('NO_MODULES')
  }

  const project = {
    id: shortId.generate(),
    path: input.path,
    favorite: 0,
    type: folders.isVueProject(input.path) ? 'vue' : 'unknown',
  }
  const packageData = folders.readPackage(project.path, context)
  project.name = packageData.name
  context.db.get('projects').push(project).write()
  return open(project.id, context)
}

async function open (id, context) {
  const project = findOne(id, context)

  if (!project) {
    log('Project not found', id)
    return null
  }

  if (!fs.existsSync(project.path)) {
    log('Project folder not found', id, project.path)
    return null
  }

  const openProjects = context.memdb.get('openProjects')
  if (!openProjects.find({ id }).value()) {
    openProjects.push({
      id,
    }).write()
  }

  lastProject = currentProject
  currentProject = project
  cwd.set(project.path, context)
  // Reset locales
  locales.reset(context)
  // Load plugins
  await plugins.list(project.path, context)

  // Date
  context.db.get('projects').find({ id }).assign({
    openDate: Date.now(),
  }).write()

  // Save for next time
  context.db.set('config.lastOpenProject', id).write()

  log('Project open', id, project.path)

  return project
}

async function remove (id, context) {
  if (currentProject && currentProject.id === id) {
    currentProject = null
  }
  context.db.get('projects').remove({ id }).write()
  context.memdb.get('openProjects').remove({ id }).write()
  if (context.db.get('config.lastOpenProject').value() === id) {
    context.db.set('config.lastOpenProject', undefined).write()
  }
  return true
}

function resetCwd (context) {
  if (currentProject) {
    cwd.set(currentProject.path, context)
  }
}

function setFavorite ({ id, favorite }, context) {
  context.db.get('projects').find({ id }).assign({ favorite }).write()
  return findOne(id, context)
}

function rename ({ id, name }, context) {
  context.db.get('projects').find({ id }).assign({ name }).write()
  return findOne(id, context)
}

function getType (project, context) {
  if (typeof project === 'string') {
    project = findByPath(project, context)
  }
  if (!project) return 'unknown'
  return !project.type ? 'vue' : project.type
}

function getHomepage (project, context) {
  const gitConfigPath = path.join(project.path, '.git', 'config')
  if (fs.existsSync(gitConfigPath)) {
    const gitConfig = parseGitConfig.sync({ path: gitConfigPath })
    const gitRemoteUrl = gitConfig['remote "origin"']
    if (gitRemoteUrl) {
      return getHttpsGitURL(gitRemoteUrl.url)
    }
  }

  const pkg = folders.readPackage(project.path, context)
  return pkg.homepage
}

function isOpen ({ id }, context) {
  return !!context.memdb.get('openProjects').find({ id }).value()
}

// Open last project
async function autoOpenLastProject () {
  const context = getContext()
  const id = context.db.get('config.lastOpenProject').value()
  if (id) {
    try {
      await open(id, context)
    } catch (e) {
      log(`Project can't be auto-opened`, id)
    }
  }
}

autoOpenLastProject()

module.exports = {
  list,
  findOne,
  findByPath,
  getCurrent,
  getLast,
  getCreation,
  applyPreset,
  setFeatureEnabled,
  create,
  import: importProject,
  open,
  remove,
  resetCwd,
  setFavorite,
  rename,
  initCreator,
  removeCreator,
  getType,
  getHomepage,
  isOpen,
}
