<template>
  <div class="status-bar">
    <LoggerView
      v-if="showLogs"
      @close="showLogs = false"
    />

    <div class="content">
      <div
        v-tooltip="$t('org.vue.components.status-bar.project.tooltip')"
        class="section action current-project"
        @click="onProjectClick()"
      >
        <VueIcon icon="home" />
        <span
          v-if="!projectCurrent"
          class="label"
        >{{ $t('org.vue.components.status-bar.project.empty') }}</span>
      </div>

      <ApolloQuery
        v-tooltip="$t('org.vue.components.status-bar.path.tooltip')"
        :query="require('@/graphql/cwd/cwd.gql')"
        class="section current-path"
        @click.native="onCwdClick()"
      >
        <ApolloSubscribeToMore
          :document="require('@/graphql/cwd/cwdChanged.gql')"
          :update-query="(previousResult, { subscriptionData }) => ({
            cwd: subscriptionData.data.cwd
          })"
        />

        <template slot-scope="{ result: { data } }">
          <VueIcon icon="folder" />
          <span v-if="data">{{ data.cwd }}</span>
        </template>
      </ApolloQuery>

      <div
        v-tooltip="$t('org.vue.components.status-bar.log.tooltip')"
        class="section action console-log"
        @click="onConsoleClick()"
      >
        <VueIcon icon="dvr" />
        <transition-group
          name="slide-up"
          duration="600"
          tag="div"
          class="last-message-container"
        >
          <LoggerMessage
            v-if="consoleLogLast"
            :key="consoleLogLast.id"
            class="last-message"
            :message="consoleLogLast"
          />
          <div
            v-else
            key="__empty"
            class="last-message no-log"
          >
            {{ $t('org.vue.components.status-bar.log.empty') }}
          </div>
        </transition-group>
      </div>

      <div
        v-if="enableDarkModeButton"
        v-tooltip="$t('org.vue.components.status-bar.dark-mode')"
        class="section action dark-mode"
        @click="toggleDarkMode()"
      >
        <VueIcon icon="invert_colors" />
      </div>

      <div
        v-tooltip="$t('org.vue.components.status-bar.report-bug')"
        class="section action bug-report"
        @click="onBugReportClick()"
      >
        <VueIcon icon="bug_report" />
      </div>
      <div
        v-tooltip="$t('org.vue.components.status-bar.translate')"
        class="section action translate"
        @click="onTranslateClick()"
      >
        <VueIcon icon="g_translate" />
      </div>
      <div
        v-tooltip="$t('org.vue.components.status-bar.reset-plugin-api')"
        class="section action reset-plugin-api"
        @click="resetPluginApi()"
      >
        <VueIcon icon="cached" />
      </div>
    </div>
  </div>
</template>

<script>
import PROJECT_CURRENT from '@/graphql/project/projectCurrent.gql'
import CONSOLE_LOG_LAST from '@/graphql/console-log/consoleLogLast.gql'
import CONSOLE_LOG_ADDED from '@/graphql/console-log/consoleLogAdded.gql'
import DARK_MODE_SET from '@/graphql/dark-mode/darkModeSet.gql'
import PLUGIN_RESET_API from '@/graphql/plugin/pluginResetApi.gql'
import { resetApollo } from '@/vue-apollo'
import { getForcedTheme } from '@/util/theme'

let lastRoute

export default {
  clientState: true,

  data () {
    return {
      showLogs: false,
      consoleLogLast: null,
      enableDarkModeButton: getForcedTheme() == null,
    }
  },

  apollo: {
    projectCurrent: PROJECT_CURRENT,
    consoleLogLast: CONSOLE_LOG_LAST,

    $subscribe: {
      consoleLogAdded: {
        query: CONSOLE_LOG_ADDED,
        result ({ data }) {
          this.consoleLogLast = data.consoleLogAdded
        },
      },
    },
  },

  methods: {
    onProjectClick () {
      this.$emit('project')
      if (this.$route.name === 'project-select') {
        this.$router.push(lastRoute || { name: 'project-home' })
      } else {
        if (this.$route.name === 'project-create') {
          lastRoute = null
        } else {
          const { name, params, query } = this.$route
          lastRoute = { name, params, query }
        }
        this.$router.push({ name: 'project-select' })
      }
    },

    onCwdClick () {
      this.$emit('cwd')
    },

    onConsoleClick () {
      this.$emit('console')
      this.showLogs = !this.showLogs
    },

    onBugReportClick () {
      const win = window.open(
        'https://new-issue.vuejs.org/?repo=vuejs/vue-cli',
        '_blank'
      )
      win.focus()
    },

    onTranslateClick () {
      const win = window.open(
        'https://cli.vuejs.org/dev-guide/ui-localization.html',
        '_blank'
      )
      win.focus()
    },

    async applyDarkMode (enabled) {
      localStorage.setItem('vue-ui-dark-mode', enabled.toString())
      await this.$apollo.mutate({
        mutation: DARK_MODE_SET,
        variables: {
          enabled,
        },
      })
    },

    toggleDarkMode () {
      this.applyDarkMode(!this.darkMode)
    },

    async resetPluginApi () {
      await this.$apollo.mutate({
        mutation: PLUGIN_RESET_API,
      })

      await resetApollo()
    },
  },
}
</script>

<style lang="stylus" scoped>
.status-bar
  position relative
  z-index 3
  box-shadow 0 -2px 10px rgba(black, .1)
  .vue-ui-dark-mode &
    box-shadow 0 -2px 10px rgba(black, .2)

  .content
    h-box()
    align-items center
    font-size 12px
    height 28px
    background $vue-ui-color-darker
    color $vue-ui-color-light
    >>> .vue-ui-icon svg
      fill @color

  .section
    h-box()
    align-items center
    padding 0 8px
    height 100%
    cursor default

    &:hover
      background lighten($vue-ui-color-darker, 10%)

    > .vue-ui-icon + *
      margin-left 4px

    .label
      color lighten($vue-ui-color-dark, 20%)

    &.action
      user-select none
      cursor pointer

  .console-log
    &,
    .last-message-container
      flex 100% 1 1
      width 0

    .last-message-container
      overflow hidden
      height 100%
      position relative

    .last-message
      position absolute
      left 0
      top 4px
      width 100%

    .logger-message
      font-size .9em
      padding-right 0

    .last-message >>> .message
      > span
        color $vue-ui-color-light

    .no-log
      padding 2px
      opacity .5
</style>
