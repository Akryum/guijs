<script>
import { computed } from '@vue/composition-api'
import { useRoute } from '@/util/router'
import PackageItem from './PackageItem.vue'

export default {
  components: {
    PackageItem,
  },

  props: {
    packages: {
      type: Array,
      required: true,
    },
  },

  setup (props) {
    const route = useRoute()

    const projectTypeId = computed(() => route.value.params.projectTypeId)

    const list = computed(() => {
      if (projectTypeId.value && projectTypeId.value !== '__all') {
        return props.packages.filter(p => {
          if (projectTypeId.value !== '__unknown') {
            return p.projectTypes.some(pt => pt.id === projectTypeId.value)
          }
          return !p.projectTypes.length
        })
      }
      return props.packages
    })

    const sortedList = computed(() => list.value.sort((a, b) => a.id.localeCompare(b.id))
      .sort((a, b) => {
        if (a.official && !b.official) return -1
        if (!a.official && b.official) return 1
        return 0
      }))

    return {
      sortedList,
    }
  },
}
</script>

<template>
  <div class="m-6">
    <PackageItem
      v-for="pkg of sortedList"
      :key="pkg.id"
      :pkg="pkg"
    />
  </div>
</template>
