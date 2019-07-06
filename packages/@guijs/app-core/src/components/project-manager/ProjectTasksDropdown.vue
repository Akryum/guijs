<template>
  <VueDropdown
    class="project-tasks-dropdown"
    placement="right"
    handle-resize
    @click.native.prevent.stop
    @show="enabled = true"
  >
    <div
      slot="trigger"
      class="menu-trigger"
      :class="bulletClass"
      v-tooltip="countPerStatus.running ? $t('org.vue.components.project-tasks-dropdown.tooltips.running-tasks', { count: countPerStatus.running }) : $t('org.vue.components.project-tasks-dropdown.tooltips.tasks')"
    >
      <div class="bullet"/>
    </div>

    <div class="content">
      <div class="pane-toolbar">
        <VueIcon icon="assignment"/>
        <div class="title">{{ $t('org.vue.components.project-tasks-dropdown.tooltips.tasks') }}</div>
        <VueButton
          class="icon-button flat"
          icon-left="close"
          v-tooltip="$t('org.vue.components.logger-view.buttons.close')"
          v-close-popover
        />
      </div>

      <div class="tasks">
        <TaskItem
          v-for="task of tasks"
          :key="task.id"
          :task="task"
          @click.native="openTask(task)"
        >
          <VueButton
            v-if="task.status !== 'running'"
            icon-left="play_arrow"
            class="icon-button"
            v-tooltip="$t('org.vue.views.project-task-details.actions.play')"
            @click.stop="openTask(task, true)"
          />
          <VueButton
            v-else
            icon-left="stop"
            class="icon-button"
            v-tooltip="$t('org.vue.views.project-task-details.actions.stop')"
            @click.stop="stopTask(task)"
          />
        </TaskItem>

        <VueLoadingIndicator
          v-if="loading || $apollo.loading"
          class="overlay"
        />
      </div>
    </div>
  </VueDropdown>
</template>

<script>
import TASK_CHANGED from '@/graphql/task/taskChanged.gql'
import TASK_RUN from '@/graphql/task/taskRun.gql'
import TASK_STOP from '@/graphql/task/taskStop.gql'
import TASK_FRAGMENT from '@/graphql/task/taskFragment.gql'
import PROJECT_CURRENT from '@/graphql/project/projectCurrent.gql'
import PROJECT_OPEN from '@/graphql/project/projectOpen.gql'
import gql from 'graphql-tag'

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },

    tooltip: {
      type: String,
      default: null,
    },
  },

  data () {
    return {
      loading: false,
      tasks: [],
      enabled: this.project.hasRunningTasks,
    }
  },

  apollo: {
    projectCurrent: PROJECT_CURRENT,

    $subscribe: {
      taskChanged: {
        query: TASK_CHANGED,
      },
    },

    tasks: {
      query: gql`
        query projectTasks ($id: ID!) {
          project (id: $id) {
            id
            tasks {
              ...task
            }
          }
        }
        ${TASK_FRAGMENT}
      `,
      variables () {
        return {
          id: this.project.id,
        }
      },
      update: data => data.project.tasks,
      skip () {
        return !this.enabled
      },
    },
  },

  computed: {
    countPerStatus () {
      const map = {}
      for (const task of this.tasks) {
        if (!map[task.status]) {
          map[task.status] = 1
        } else {
          map[task.status]++
        }
      }
      return map
    },

    bulletClass () {
      if (this.project.hasRunningTasks) {
        return 'running'
      }
      return 'idle'
    },
  },

  methods: {
    async openTask (task, run = false) {
      this.loading = true

      if (!this.projectCurrent || task.project.id !== this.projectCurrent.id) {
        await this.$apollo.mutate({
          mutation: PROJECT_OPEN,
          variables: {
            id: task.project.id,
          },
        })
      }

      this.$router.push({
        name: 'project-tasks',
        query: { id: task.id },
      })

      if (run) {
        await this.$apollo.mutate({
          mutation: TASK_RUN,
          variables: {
            id: task.id,
          },
        })
      }
    },

    stopTask (task) {
      this.$apollo.mutate({
        mutation: TASK_STOP,
        variables: {
          id: task.id,
        },
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
bullet-color($color)
  .bullet
    background-color $color
  &:hover
    .bullet
      background-color lighten($color, 20%)

.bullet
  width 8px
  height @width
  border-radius 50%

.menu-trigger
  width 20px !important
  height @width
  h-box()
  box-center()

  &.running
    bullet-color($vue-ui-color-info)
  &.idle
    bullet-color(darken($vue-ui-color-light, 10%))
    .vue-ui-dark-mode &
      bullet-color(lighten($vue-ui-color-dark, 5%))

.tasks
  width 400px
  min-height 42px
  max-height 400px
  overflow-y auto
</style>
