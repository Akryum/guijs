import execa from 'execa'
import { implement } from '../util/os-implementation'

export interface NotifyOptions {
  text: string
  icon?: string
}

const implementation = implement({
  linux: async (options: NotifyOptions) => {
    const args = [
      '--notification',
      `--text=${options.text}`,
    ]
    if (options.icon) args.push(`--window-icon=${options.icon}`)
    console.log(args)
    await execa('zenity', args)
  },
})

export async function notify (options: NotifyOptions) {
  await implementation(options)
}
