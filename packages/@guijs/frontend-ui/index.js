import VTooltip from 'v-tooltip'
import 'v-tooltip/dist/v-tooltip.css'
import VueResize from 'vue-resize'

export const DEFAULT_OPTIONS = {
  componentsPrefix: 'V',
}

export default {
  install (Vue, options = {}) {
    // Default options
    for (const key in DEFAULT_OPTIONS) {
      if (options[key] == null) {
        options[key] = DEFAULT_OPTIONS[key]
      }
    }

    Vue.use(VTooltip, {
      boundariesElement: 'viewport',
      themes: {
        tooltip: {
          // Delay (ms)
          delay: {
            show: 700,
            hide: 0,
          },
          offset: 8,
          instantMove: true,
        },
        dropdown: {
          offset: 8,
        },
      },
    })

    Vue.use(VueResize)

    // Require all the components that start with 'BaseXXX.vue'
    const requireComponents = require.context('./components', true, /[a-z0-9]+\.(jsx?|vue)$/i)
    requireComponents.keys().forEach(fileName => {
      const component = requireComponents(fileName)
      const name = fileName.match(/([a-z0-9]+)\./i)[1]
      Vue.component(`${options.componentsPrefix}${name}`, component.default || component)
    })
  },
}
