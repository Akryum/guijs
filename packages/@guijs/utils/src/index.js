export function defaultValue (provided, value) {
  return provided == null ? value : provided
}

export function nullable (value) {
  return value == null ? {} : value
}

export function autoCall (fn, ...context) {
  if (typeof fn === 'function') {
    return fn(...context)
  }
  return fn
}
