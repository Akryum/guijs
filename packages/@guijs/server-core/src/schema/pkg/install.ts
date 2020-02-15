import { addCommand } from '../command'
import { CommandType } from '@/generated/schema'

addCommand({
  id: 'install-package-popup',
  type: CommandType.Action,
  label: 'Open install package popup',
  hidden: true,
})

addCommand({
  id: 'install-package',
  type: CommandType.Action,
  label: 'Install package',
  hidden: true,
})
