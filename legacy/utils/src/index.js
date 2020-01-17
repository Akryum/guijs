exports.defaultValue = function (provided, value) {
  return provided == null ? value : provided
}

exports.nullable = function (value) {
  return value == null ? {} : value
}

exports.autoCall = function (fn, ...context) {
  if (typeof fn === 'function') {
    return fn(...context)
  }
  return fn
}
