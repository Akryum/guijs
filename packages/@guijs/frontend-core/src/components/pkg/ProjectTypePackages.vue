<script>
import { computed, watchEffect, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router/composables'
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

    const projectTypeId = computed(() => route.params.projectTypeId)

    const list = computed(() => {
      if (projectTypeId.value && projectTypeId.value !== '__all') {
        return props.packages.filter(p => {
          if (projectTypeId.value !== '__unknown') {
            return p.metadata.projectTypes.some(pt => pt.id === projectTypeId.value)
          }
          return !p.metadata.projectTypes.length
        })
      }
      return props.packages
    })

    const sortedList = computed(() => list.value.slice().sort((a, b) => a.id.localeCompare(b.id))
      .sort((a, b) => {
        if (a.metadata.official && !b.metadata.official) return -1
        if (!a.metadata.official && b.metadata.official) return 1
        return 0
      }))

    // Scroll into package

    const highlightedId = ref(null)

    watchEffect(() => {
      if (el.value && list.value.length && route.query.packageId) {
        const item = el.value.querySelector(`[data-id="${route.query.packageId}"]`)
        if (item) {
          highlightedId.value = route.query.packageId
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

    <VEmpty
      v-if="!sortedList.length"
      icon="extension"
    >
      {{ $t('guijs.package.no-packages') }}
    </VEmpty>
  </div>
</template>
