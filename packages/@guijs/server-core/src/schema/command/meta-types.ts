import { Command } from '@/generated/schema'
import { OnCommandHandler } from '.'

export interface MetaCommand<T = any> extends Command {
  handler?: OnCommandHandler
  lastUsed?: Date
  hidden?: boolean
  related?: T
  projectId?: string
}
