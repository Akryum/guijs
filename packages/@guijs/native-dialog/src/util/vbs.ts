import execa from 'execa'
import { escapeArg } from './excape'

export async function runVBS (file: string, args: string[]): Promise<string> {
  try {
    const { stdout, stderr } = await execa('cscript', [
      '//Nologo',
      `"${escapeArg(file)}"`,
      ...args,
    ], {
      shell: true,
    })
    if (stderr) {
      console.error(stderr)
    }
    return stdout
  } catch (e) {
    console.error(e)
  }
  return ''
}
