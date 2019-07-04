import VueProgress from 'vue-progress-path'
import WebpackDashboard from './components/WebpackDashboard.vue'
import WebpackAnalyzer from './components/WebpackAnalyzer.vue'
import TestView from './components/TestView.vue'
// Widgets
import Welcome from './components/Welcome.vue'
import KillPort from './components/KillPort.vue'
import PluginUpdates from './components/PluginUpdates.vue'
import DependencyUpdates from './components/DependencyUpdates.vue'
import Vulnerability from './components/Vulnerability.vue'
import VulnerabilityDetails from './components/VulnerabilityDetails.vue'
import RunTask from './components/RunTask.vue'
import News from './components/News.vue'

Vue.use(VueProgress, {
  defaultShape: 'circle',
})

ClientAddonApi.component('org.vue.webpack.components.dashboard', WebpackDashboard)
ClientAddonApi.component('org.vue.webpack.components.analyzer', WebpackAnalyzer)

ClientAddonApi.addRoutes('org.vue.webpack', [
  { path: '', name: 'org.vue.webpack.routes.test', component: TestView },
])

// Locales
const locales = require.context('./locales', true, /[a-z0-9]+\.json$/i)
locales.keys().forEach(key => {
  const locale = key.match(/([a-z0-9]+)\./i)[1]
  ClientAddonApi.addLocalization(locale, locales(key))
})

// Widgets
ClientAddonApi.component('org.vue.widgets.components.welcome', Welcome)
ClientAddonApi.component('org.vue.widgets.components.kill-port', KillPort)
ClientAddonApi.component('org.vue.widgets.components.plugin-updates', PluginUpdates)
ClientAddonApi.component('org.vue.widgets.components.dependency-updates', DependencyUpdates)
ClientAddonApi.component('org.vue.widgets.components.vulnerability', Vulnerability)
ClientAddonApi.component('org.vue.widgets.components.vulnerability-details', VulnerabilityDetails)
ClientAddonApi.component('org.vue.widgets.components.run-task', RunTask)
ClientAddonApi.component('org.vue.widgets.components.news', News)
