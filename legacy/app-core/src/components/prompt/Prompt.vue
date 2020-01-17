<script>
import ListItemInfo from '@/components/content/ListItemInfo.vue'

export default {
  components: {
    ListItemInfo,
  },

  props: {
    prompt: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      modifiedValue: undefined,
    }
  },

  methods: {
    value (value) {
      if (this.$options.buffer && typeof this.modifiedValue !== 'undefined') return this.modifiedValue
      return JSON.parse(value)
    },

    answer (value) {
      this.modifiedValue = value
      this.$emit('answer', value)
    },
  },
}
</script>

<style lang="stylus">
.prompt
  list-item()
  .prompt-content
    display flex
    align-items center
    padding $padding-item

    > .list-item-info
      grid-area info
      flex 100% 1 1

    > .prompt-input
      flex auto 1 0
      min-width 300px
      grid-area input
      v-box()
      align-items stretch
      justify-content center

    &.vertical
      grid-template-columns auto
      grid-template-areas "info" "input"
      grid-gap $padding-item

  .list-item-info
    margin-right ($padding-item * 2)
</style>
