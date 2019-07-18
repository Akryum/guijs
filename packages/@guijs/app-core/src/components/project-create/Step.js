export default function () {
  // @vue/component
  return {
    props: {
      step: {
        type: Object,
        required: true,
      },

      validSteps: {
        type: Object,
        required: true,
      },

      hasNext: {
        type: Boolean,
        required: true,
      },

      hasPrevious: {
        type: Boolean,
        required: true,
      },
    },

    computed: {
      isValid () {
        return this.validSteps[this.step.id]
      },
    },

    methods: {
      previous () {
        return this.$emit('previous')
      },

      next () {
        return this.$emit('next')
      },

      cancel () {
        return this.$emit('cancel')
      },
    },
  }
}
