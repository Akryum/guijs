import VTooltip from 'v-tooltip'
import 'v-tooltip/dist/v-tooltip.css'
import VueResize from 'vue-resize'
import './util/scroll'
import 'focus-visible'

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
          contentHtml: true,
        },
        dropdown: {
          offset: 8,
          disposeTimeout: 10,
        },
      },
    })

    Vue.use(VueResize)

    // Import all the components
    const components = import.meta.globEager('./components/*.vue')
    for (const path in components) {
      const component = components[path]
      const name = path.match(/([a-z0-9]+)\./i)[1]
      Vue.component(`${options.componentsPrefix}${name}`, component.default || component)
    }
  },
}
