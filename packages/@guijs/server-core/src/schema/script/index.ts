import { addCommand } from '../command'
import { CommandType } from '@/generated/schema'
import { addKeybinding } from '../keybinding'

addCommand({
  id: 'show-scripts',
  type: CommandType.Action,
  label: 'Show scripts',
  description: 'guijs.script.show-scripts',
})

addKeybinding({
  id: 'show-scripts',
  scope: 'root',
  sequences: ['s'],
})
