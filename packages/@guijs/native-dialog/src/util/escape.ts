export function escapeArg (text: string) {
  return text.replace(/"/g, '\\"')
}
