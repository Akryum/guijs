export function escapeArg (arg: string): string {
  return arg.replace(/"/g, '\\"')
}
