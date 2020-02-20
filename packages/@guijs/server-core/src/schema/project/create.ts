import { addCommand, runCommand } from '../command'
import { CommandType, Resolvers } from '@/generated/schema'
import gql from 'graphql-tag'
import shortid from 'shortid'
import Context from '@/generated/context'
import consola from 'consola'
import path from 'path'
import { ProjectGeneratorAPI, ProjectGeneratorAPIOptions } from '@/api/ProjectGenerator'
import { vanillaJsGenerator } from '@/util/generator-js'
import { executeTask } from '../task'
import { isPluginInstalled, installPlugin, pluginFolder } from '../global-plugin'
import { getProjectGenerators } from '../project-type/generator'
import { loadModule } from '@nodepack/module'
import { addProjectWorkspace } from './workspace'

export const typeDefs = gql`
extend type Mutation {
  createProject (input: CreateProjectInput!): Task
}

input CreateProjectInput {
  monorepo: Boolean!
  name: String!
  baseFolder: String!
  simpleProject: CreateSimpleProjectInput
}

input CreateSimpleProjectInput {
  projectGeneratorId: ID!
}
`

const JS_GENERATOR_ID = '257880250518602259'

interface AddProjectOptions {
  name: string
  path: string
}

async function addNewProject (options: AddProjectOptions, ctx: Context) {
  const project = await ctx.db.projects.insert({
    _id: shortid(),
    name: options.name,
    path: options.path,
    bookmarked: false,
  })
  runCommand('open-project', {
    projectId: project._id,
  }, ctx)
  return project
}

type ProjectGeneratorSetup = (api: ProjectGeneratorAPI) => Promise<void> | void

async function setupProjectGenerator (generator: ProjectGeneratorSetup, options: ProjectGeneratorAPIOptions, ctx: Context) {
  const api = new ProjectGeneratorAPI(options, ctx)
  await generator(api)
  return api
}

async function runGenerator (api: ProjectGeneratorAPI, ctx: Context) {
  // Requirements
  for (const requirement of api.requirementCheckHandlers) {
    consola.log(`Checking requirement ${requirement.name}...`)
    const result = await requirement.checkHandler()
    if (!result) {
      consola.log(`Requirement ${requirement.name} missing...`)
      await requirement.installHandler()
    }
  }

  // Generate
  for (const handler of api.generateHandlers) {
    await handler()
  }
}

export const resolvers: Resolvers = {
  Mutation: {
    createProject: async (root, { input }, ctx) => executeTask({
      type: 'create-project',
      payload: input,
    }, async () => {
      const projectPath = path.join(input.baseFolder, input.name)
      if (input.monorepo || (input.simpleProject && input.simpleProject.projectGeneratorId === JS_GENERATOR_ID)) {
        const api = await setupProjectGenerator(vanillaJsGenerator, {
          projectName: input.name,
          baseFolder: input.baseFolder,
          projectPath,
        }, ctx)
        if (input.monorepo) {
          api.customOptions.worspaces = [
            'packages/*',
          ]
        }
        await runGenerator(api, ctx)
        await addNewProject({
          name: input.name,
          path: projectPath,
        }, ctx)
      } else if (input.simpleProject) {
        // Resolve generator
        const projectGenerator = getProjectGenerators().find(g => g.id === input.simpleProject.projectGeneratorId)
        if (!isPluginInstalled(projectGenerator.packageName)) {
          await installPlugin(projectGenerator.packageName)
        }
        let generatorModule = loadModule(`${projectGenerator.packageName}${projectGenerator.module ? `/${projectGenerator.module}` : ''}`, pluginFolder, true)
        if (generatorModule.default) {
          generatorModule = generatorModule.default
        }

        // Execute generator
        const api = await setupProjectGenerator(generatorModule, {
          projectName: input.name,
          baseFolder: input.baseFolder,
          projectPath,
        }, ctx)
        await runGenerator(api, ctx)

        // Create project item
        const project = await addNewProject({
          name: input.name,
          path: projectPath,
        }, ctx)
        await addProjectWorkspace(project, {
          id: '__root',
          name: input.name,
          absolutePath: projectPath,
          relativePath: '',
          typeId: projectGenerator.projectType.id,
        }, ctx)
      }
    }, ctx),
  },
}

addCommand({
  id: 'create-project',
  type: CommandType.Action,
  label: 'Create a project',
  description: 'guijs.create-project.create-a-project',
  icon: 'add',
})
