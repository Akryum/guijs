<script>
import { useMutation } from '@vue/apollo-composable'
import { gql } from '@apollo/client/core'

export default {
  model: {
    prop: 'value',
    event: 'update',
  },

  props: {
    value: {
      type: String,
      default: null,
    },

    directory: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      default () {
        return this.$t(`guijs.file-input.select-a-${this.directory ? 'folder' : 'file'}`)
      },
    },

    placeholder: {
      type: String,
      default () {
        return this.$t(`guijs.file-input.no-${this.directory ? 'folder' : 'file'}-selected`)
      },
    },
  },

  setup (props, { emit }) {
    const { mutate, loading, onDone } = useMutation(gql`
      mutation selectFile ($input: SelectFileInput!) {
        selectFile (input: $input)
      }
    `, {
      fetchPolicy: 'no-cache',
    })

    function browse () {
      if (loading.value) return
      return mutate({
        input: {
          cwd: props.value,
          directory: props.directory,
        },
      })
    }

    onDone(result => {
      const file = result.data.selectFile
      if (file) emit('update', file)
    })

    return {
      browse,
      loading,
    }
  },
}
</script>

<template>
  <div
    class="flex items-center form-input cursor-pointer group"
    :class="{
      'pointer-events-none': loading,
    }"
    @click="browse"
  >
    <div class="flex-1">
      <VLabel class="mb-1">
        {{ label }}
      </VLabel>
      <div class="text-sm font-mono">
        <div
          v-if="value"
          class="text-gray-900 dark:text-gray-100"
        >
          {{ value }}
        </div>
        <div
          v-else
          class="text-gray-500"
        >
          {{ placeholder }}
        </div>
      </div>
    </div>

    <VButton
      class="w-10 h-10 group-hover:bg-secondary-500 group-hover:text-white"
    >
      <i class="material-icons">more_horiz</i>
    </VButton>
  </div>
</template>
