import { Command } from '@/generated/schema'

export interface MetaCommand extends Command {
  handler?: Function
  lastUsed?: Date
}
