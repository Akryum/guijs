<script>
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

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
    const { mutate, onDone } = useMutation(gql`
      mutation selectFile ($input: SelectFileInput!) {
        selectFile (input: $input)
      }
    `, {
      fetchPolicy: 'no-cache',
    })

    function browse () {
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
    }
  },
}
</script>

<template>
  <div
    class="flex items-center border border-gray-200 rounded px-6 py-4 hover:bg-gray-100 cursor-pointer group"
    @click="browse"
  >
    <div class="flex-1">
      <div class="text-gray-600">
        {{ label }}
      </div>
      <div class="text-sm font-mono">
        <div
          v-if="value"
          class="text-gray-900"
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
