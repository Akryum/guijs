const TAB_TYPES = [
  'general',
  'prompts',
  'select',
]

export function isTabStep (step) {
  return TAB_TYPES.includes(step.type)
}
