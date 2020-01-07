const {
  hasYarn,
  hasProjectYarn,
  hasPnpm3OrLater,
  hasProjectPnpm,
} = require('@vue/cli-shared-utils')
const {
  getRcPath,
  loadGlobalOptions,
} = require('@nodepack/utils')

exports.getCommand = function (cwd = undefined) {
  if (!cwd) {
    return loadGlobalOptions(getRcPath('.vuerc', { xdgFolder: 'vue' }), false).packageManager || (hasYarn() ? 'yarn' : hasPnpm3OrLater() ? 'pnpm' : 'npm')
  }
  return hasProjectYarn(cwd) ? 'yarn' : hasProjectPnpm(cwd) ? 'pnpm' : 'npm'
}
