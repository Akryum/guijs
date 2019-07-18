<template>
  <div class="prompts-list">
    <div class="content">
      <PromptGroup
        v-for="group of groups"
        :key="group.id"
        :group="group"
        @answer="payload => $emit('answer', payload)"
      />

      <div v-if="!prompts.length" class="vue-ui-empty">
        <VueIcon icon="check_circle" class="empty-icon"/>
        <span>{{ $t('org.vue.components.prompts-list.empty') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import PromptGroup from './PromptGroup.vue'

export default {
  components: {
    PromptGroup,
  },

  props: {
    prompts: {
      type: Array,
      required: true,
    },
  },

  computed: {
    groups () {
      const groupMap = {}
      const groups = []
      this.prompts.forEach(prompt => {
        let group = groupMap[prompt.group]
        if (!group) {
          group = groupMap[prompt.group] = {
            id: prompt.group,
            prompts: [],
          }
          groups.push(group)
        }
        group.prompts.push(prompt)
      })
      return groups
    },
  },
}
</script>
