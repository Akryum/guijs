import path from 'path'
import fs from 'fs'
import shortId from 'shortid'
import parseGitConfig from 'parse-git-config'
import clone from 'clone'
// Connectors
import progress from './progress'
import cwd from './cwd'
import prompts from './prompts'
import folders from './folders'
import * as plugins from './plugins'
import locales from './locales'
import logs from './logs'
import * as projectTypes from './project-types'
import views from './views'
// Context
import getContext from '../context'
// Utils
import { log } from '../util/logger'
import { notify } from '../util/notification'
import { getHttpsGitURL } from '../util/strings'
import ProjectCreationWizard from '../api/ProjectCreationWizard'

const PROGRESS_ID = 'project-create'

let lastProject = null
let currentProject = null

/** @type {import('./project-types').ProjectType} */
let createProjectType = null
/** @type {ProjectCreationWizard} */
let creationWizard = null

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

async function initCreator ({ type }, context) {
  createProjectType = projectTypes.getType(type, context)
  if (!createProjectType) {
    throw new Error(`Project type ${type} not found`)
  }

  creationWizard = new ProjectCreationWizard({
    cwd: cwd.get(),
    type: createProjectType,
  })
  if (!createProjectType.createCbs.length) {
    throw new Error(`No create handlers registered on project type ${type}`)
  }
  for (const cb of createProjectType.createCbs) {
    await cb({ wizard: creationWizard })
  }

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

  // Prompts
  await prompts.reset()
  for (const step of creationWizard.steps) {
    if (step.options.prompts) {
      step.options.prompts.forEach(prompts.add)
    }
  }
  await prompts.start()

  log('Created project create wizard')

  return creationWizard
}

export function isCreationStepEnabled (id, context) {
  const step = creationWizard.getStep(id)
  if (!step) {
    throw new Error(`Step ${id} not found`)
  }
  if (!step.when) {
    return true
  }
  return !!step.when(creationWizard.answers)
}

async function removeCreator (context) {
  log('Removing project create wizard')
  // @TODO
  // installProgress.removeListener('progress', onInstallProgress)
  // installProgress.removeListener('log', onInstallLog)
  await prompts.reset()
  return true
}

export async function getCreationWizard (context) {
  return creationWizard
}

async function create (input, context) {
  return progress.wrap(PROGRESS_ID, context, async setProgress => {
    setProgress({
      status: 'creating',
    })

    const projectPath = path.join(cwd.get(), input.folder)
    const inCurrent = input.folder === '.'
    const projectName = (inCurrent ? path.relative('../', process.cwd()) : input.folder).toLowerCase()

    // Answers
    const answers = clone(prompts.getAnswers())
    answers.projectName = projectName
    answers.remotePreset = input.remotePreset

    log('Create project | answers:', answers)

    for (const cb of creationWizard.submitCbs) {
      await cb({
        cwd: cwd.get(),
        answers,
        setProgress,
        addLog: (log) => logs.add(log, context),
        notify,
      })
    }

    await removeCreator()

    notify({
      title: `Project created`,
      message: `Project ${cwd.get()} created`,
      icon: 'done',
    })

    return importProject({
      path: projectPath,
      type: creationWizard.type.id,
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
    type: input.type || await projectTypes.detectType({ file: input.path }, context),
  }

  const packageData = folders.readPackage(project.path, context)
  project.name = packageData.name

  if (!packageData.name) {
    throw new Error(`No 'name' field in package.json`)
  }

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

  // Load plugins if not loaded
  // Delayed (cyclic dependency)
  await Promise.resolve().then(() => plugins.list(project.path, context, { force: true }))

  const projectType = projectTypes.getType(project.type, context)
  // Toggle plugin view
  const pluginViewId = 'vue-project-plugins'
  if (projectType.pluginConfig) {
    views.show(pluginViewId, context)
  } else {
    views.hide(pluginViewId, context)
  }

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
  return projectTypes.getType(project.type, context)
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
      if (process.env.GUIJS_DEBUG) {
        console.error(e)
      }
    }
  }
}

autoOpenLastProject()

export {
  list,
  findOne,
  findByPath,
  getCurrent,
  getLast,
  create,
  importProject,
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
