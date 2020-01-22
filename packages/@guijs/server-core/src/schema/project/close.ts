import { onAnyCommand, addCommand, runCommand, onCommand } from '../command'
import { CommandType } from '@/generated/schema'
import { MetaCommand } from '../command/meta-types'
import { MetaProject } from './meta-types'
import Context from '@/generated/context'

export type ProjectCloseHandler = (project: MetaProject, ctx: Context) => void

const closeProjectHandlers: ProjectCloseHandler[] = []

addCommand({
  id: 'close-project',
  type: CommandType.Action,
  label: 'Close project',
  icon: 'close',
  filter: (cmd, ctx) => !!ctx.getProjectId(),
})

// Redirect from Project commands to 'open-project'
onAnyCommand(async (cmd: MetaCommand<MetaProject>, payload, ctx) => {
  if (cmd.type === CommandType.Project) {
    await runCommand('close-project', {
      projectId: cmd.related._id,
    }, ctx)
  }
})

addCommand({
  id: 'close-project-apply',
  type: CommandType.Action,
  label: 'Close project (After)',
  hidden: true,
})

// Main project open logic belongs here
onCommand('close-project-apply', async (command, { projectId }, ctx) => {
  if (!projectId) return

  ctx.setProjectId(projectId)
  const project = await ctx.getProject()

  for (const handler of closeProjectHandlers) {
    await handler(project, ctx)
  }
})

export function onProjectClose (handler: ProjectCloseHandler) {
  closeProjectHandlers.push(handler)
}
