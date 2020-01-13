import nodeNotifier from 'node-notifier'
import os from 'os'
import { DialogOptions } from './dialog-common'
import { getLinuxIcon } from '../util/icon'

export interface NotifyOptions extends DialogOptions {
  text: string
  icon?: string
}

export async function notify (options: NotifyOptions) {
  return new Promise(async (resolve) => {
    let icon = options.icon
    let cleanIcon: Function
    if (icon && os.platform() === 'linux') {
      const { iconName, clean } = await getLinuxIcon(icon)
      icon = iconName
      cleanIcon = clean
    }

    nodeNotifier.notify({
      title: options.title,
      message: options.text,
      icon,
    }, async () => {
      if (cleanIcon) {
        await cleanIcon()
      }
      resolve()
    })
  })
}
