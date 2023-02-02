export const TYPE_WORDS = {
  '?': 'help',
  '>': 'action',
  '<': 'project',
  '&': 'package',
  '~': 'config',
  $: 'script',
}

const typeWordReg = new RegExp(`^(${Object.keys(TYPE_WORDS).map(w => `\\${w}`).join('|')})`)

export function getSearchType (text) {
  const result = typeWordReg.exec(text)
  if (result) {
    return TYPE_WORDS[result[1]]
  }
  return null
}
