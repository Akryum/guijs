import { addSetting } from '.'
import { addCommand } from '../command'
import { CommandType } from '@/generated/schema'
import { addCommandShortcut } from '../command/shortcut'

addSetting({
  id: 'dark-mode',
  label: 'guijs.settings.dark-mode',
  description: 'guijs.settings-dark-mode-description',
  categoryId: 'display',
  defaultValue: false,
})

addCommand({
  id: 'toggle-dark-mode',
  type: CommandType.Action,
  label: 'Toggle dark mode',
  icon: 'invert_colors',
  description: 'guijs.settings.toggle-dark-mode',
})

addCommandShortcut('toggle-dark-mode')
