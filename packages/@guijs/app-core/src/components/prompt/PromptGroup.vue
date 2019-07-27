<template>
  <div
    class="group"
  >
    <div
      v-if="visiblePrompts.length"
      class="content"
    >
      <div
        v-if="group.id"
        class="group-name"
      >
        {{ $t(group.id) }}
      </div>

      <component
        :is="getModule(prompt)"
        v-for="prompt of visiblePrompts"
        :key="prompt.id"
        :prompt="prompt"
        @answer="value => $emit('answer', { prompt, value })"
      />
    </div>
  </div>
</template>

<script>
const types = {
  rawlist: 'list',
  password: 'input',
}

export default {
  props: {
    group: {
      type: Object,
      required: true,
    },
  },

  computed: {
    visiblePrompts () {
      return this.group.prompts.filter(p => p.visible)
    },
  },

  methods: {
    getModule (prompt) {
      let type = prompt.skin || prompt.type
      if (types[type]) {
        type = types[type]
      }
      type = type.charAt(0).toUpperCase() + type.substr(1)
      return require(`./Prompt${type}.vue`).default
    },
  },
}
</script>

<style lang="stylus" scoped>
.group
  &:not(:last-child)
    margin-bottom ($padding-item * 2)

.group-name
  padding $padding-item $padding-item ($padding-item / 2)
  font-size 1.3em
  font-weight 300
  color $vue-ui-color-accent
  .vue-ui-dark-mode &
    color lighten($vue-ui-color-accent, 60%)
</style>
