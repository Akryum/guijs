/** @type {import('../util/project-type').ProjectType} ProjectType */

console.log()

/** @type {ProjectType[]} */
let types = []

export function setTypes (value, context) {
  types = value
}

export function getType (id, context) {
  console.log(id, types)
  return types.find(t => t.id === id)
}
