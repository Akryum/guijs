<template>
  <div class="run-task">
    <template v-if="task">
      <TaskItem
        :task="task"
        class="info"
      />

      <div class="actions">
        <VueButton
          v-if="task.status !== 'running'"
          icon-left="play_arrow"
          class="primary"
          :label="$t('org.vue.views.project-task-details.actions.play')"
          @click="runTask()"
        />

        <VueButton
          v-else
          icon-left="stop"
          class="primary"
          :label="$t('org.vue.views.project-task-details.actions.stop')"
          @click="stopTask()"
        />

        <VueButton
          icon-left="assignment"
          :label="$t('org.vue.widgets.run-task.page')"
          :to="{ name: 'project-task-details', params: { id: taskId } }"
        />
      </div>
    </template>
  </div>
</template>

<script>
import TASK from '@guijs/app-core/src/graphql/task/task.gql'
import TASK_RUN from '@guijs/app-core/src/graphql/task/taskRun.gql'
import TASK_STOP from '@guijs/app-core/src/graphql/task/taskStop.gql'
import TASK_CHANGED from '@guijs/app-core/src/graphql/task/taskChanged.gql'

export default {
  inject: [
    'widget',
  ],

  apollo: {
    task: {
      query: TASK,
      variables () {
        return {
          id: this.taskId,
        }
      },
    },

    $subscribe: {
      taskChanged: {
        query: TASK_CHANGED,
      },
    },
  },

  computed: {
    taskId () {
      return this.widget.data.config.task
    },
  },

  methods: {
    runTask () {
      this.$apollo.mutate({
        mutation: TASK_RUN,
        variables: {
          id: this.taskId,
        },
      })
    },

    stopTask () {
      this.$apollo.mutate({
        mutation: TASK_STOP,
        variables: {
          id: this.taskId,
        },
      })
    },
  },
}
</script>

<style lang="stylus" scoped>
.info
  margin 5px 0 6px
  padding $padding-item

  >>> .name
    font-size 18px

.actions
  h-box()
  box-center()
  /deep/ > *
    &:not(:last-child)
      margin-right ($padding-item / 2)
</style>
