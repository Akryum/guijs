const TAB_TYPES = [
  'general',
  'prompts',
  'select',
]

const MODAL_TYPES = [
  'modal',
]

export function isTabStep (step) {
  return TAB_TYPES.includes(step.type)
}

export function isModalStep (step) {
  return MODAL_TYPES.includes(step.type)
}
