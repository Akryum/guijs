import { Command } from '@/generated/schema'
import { OnCommandHandler } from '.'
import Context from '@/generated/context'

export interface MetaCommand<T = any> extends Command {
  handler?: OnCommandHandler
  lastUsed?: Date
  hidden?: boolean
  related?: T
  projectId?: string
  filter?: (command: MetaCommand, ctx: Context) => boolean | Promise<boolean>
}
