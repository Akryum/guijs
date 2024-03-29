import { onAnyCommand, addCommand, runCommand, onCommand } from '../command'
import { CommandType } from '@/generated/schema'
import { MetaCommand } from '../command/meta-types'
import { MetaProject } from './meta-types'
import Context from '@/generated/context'

export type ProjectOpenHandler = (project: MetaProject, ctx: Context) => void

const openProjectHandlers: ProjectOpenHandler[] = []

addCommand({
  id: 'open-project',
  type: CommandType.Action,
  label: 'Open project',
  hidden: true,
})

// Redirect from Project commands to 'open-project'
onAnyCommand(async (cmd: MetaCommand<MetaProject>, payload, ctx) => {
  if (cmd.type === CommandType.Project) {
    await runCommand('open-project', {
      projectId: cmd.related._id,
    }, ctx)
  }
})

addCommand({
  id: 'open-project-apply',
  type: CommandType.Action,
  label: 'Open project (After)',
  hidden: true,
})

// Main project open logic belongs here
onCommand('open-project-apply', async (command, { projectId }, ctx) => {
  if (!projectId) return

  // Update last open dates
  await ctx.db.projects.update<MetaProject>({
    _id: projectId,
  }, {
    $set: {
      lastOpen: new Date(),
    },
  })

  ctx.setProjectId(projectId)
  const project = await ctx.getProject()

  for (const handler of openProjectHandlers) {
    await handler(project, ctx)
  }
})

export function onProjectOpen (handler: ProjectOpenHandler) {
  openProjectHandlers.push(handler)
}
