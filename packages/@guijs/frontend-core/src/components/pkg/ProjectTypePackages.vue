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

    return {
      list,
    }
  },
}
</script>

<template>
  <div class="m-6">
    <PackageItem
      v-for="pkg of list"
      :key="pkg.id"
      :pkg="pkg"
    />
  </div>
</template>
