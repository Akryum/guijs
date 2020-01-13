import execa from 'execa'

export async function runVBS (file: string, args: string[]): Promise<string> {
  const { stdout } = await execa('cscript', [
    '//Nologo',
    file,
    ...args,
  ])
  return stdout
}
