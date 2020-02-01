<script>
import { computed, watch, ref } from '@vue/composition-api'
import { useRoute, useRouter } from '@/util/router'
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
    const el = ref(null)

    const route = useRoute()
    const router = useRouter()

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

    // Scroll into package

    const highlightedId = ref(null)

    watch(() => {
      if (el.value && list.value.length && route.value.query.packageId) {
        const item = el.value.querySelector(`[data-id="${route.value.query.packageId}"]`)
        if (item) {
          highlightedId.value = route.value.query.packageId
          router.push({
            query: {
              packageId: undefined,
            },
          })
          requestAnimationFrame(() => {
            item.scrollIntoView()
          })
        }
      }
    })

    return {
      el,
      sortedList,
      highlightedId,
    }
  },
}
</script>

<template>
  <div
    ref="el"
    class="m-6"
  >
    <PackageItem
      v-for="pkg of sortedList"
      :key="pkg.id"
      :pkg="pkg"
      :data-id="pkg.id"
      :class="{
        'border-primary-400 dark:border-primary-700': highlightedId === pkg.id,
      }"
    />
  </div>
</template>
