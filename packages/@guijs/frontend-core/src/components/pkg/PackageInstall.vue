<script>
import gql from 'graphql-tag'
import { useQuery, useResult, useMutation } from '@vue/apollo-composable'
import { packageMetadataFragment } from './fragments'
import { computed, ref, watch } from '@vue/composition-api'
import { compare } from 'semver'
import { useTask } from '../task/useTask'
import { taskFragment } from '../task/fragments'
import { useRoute } from '@/util/router'
import PackageLogo from './PackageLogo.vue'

export default {
  components: {
    PackageLogo,
  },

  props: {
    packageName: {
      type: String,
      required: true,
    },
  },

  setup (props, { emit }) {
    const route = useRoute()

    function close () {
      emit('close')
    }

    // Metadata

    const { result, loading } = useQuery(gql`
      query packageMetadata ($id: ID!) {
        packageMetadata (id: $id) {
          ...packageMetadata
          versionTags {
            tag
            version
          }
          versions
        }
      }
      ${packageMetadataFragment}
    `, () => ({
      id: props.packageName,
    }))

    const metadata = useResult(result)

    // Dep type

    const devDep = ref(false)

    // Version

    const selectedVersion = ref()

    const versions = computed(() => metadata.value ? metadata.value.versionTags.map(tag => ({
      value: `#${tag.tag}`,
      searchText: `${tag.tag} ${tag.version}`,
      type: 'tag',
      ...tag,
    })).concat(metadata.value.versions.sort((a, b) => -compare(a, b)).map(version => ({
      value: version,
      searchText: version,
      type: 'version',
    }))) : [])

    const isVersionTag = computed(() => selectedVersion.value && selectedVersion.value.startsWith('#'))
    const actualVersion = computed(() => {
      if (isVersionTag.value) {
        const tag = selectedVersion.value.substr(1)
        const item = metadata.value.versionTags.find(t => t.tag === tag)
        if (item) return item.version
      }
      return selectedVersion.value
    })

    watch(metadata, value => {
      if (value && !selectedVersion.value) {
        if (value.versionTags) {
          const latest = value.versionTags.find(t => t.tag === 'latest')
          if (latest) {
            selectedVersion.value = '#latest'
            return
          }
        }

        selectedVersion.value = value.versions[0]
      }
    })

    const useTagAsSelector = ref(false)

    // Selector type

    const selectorType = ref('caret')

    const selectorTypes = [
      {
        value: 'greater-equal',
        label: 'Greater or equal',
        operator: '>=',
      },
      {
        value: 'caret',
        label: 'Minor updates only',
        operator: '^',
      },
      {
        value: 'tilde',
        label: 'Patch updates only',
        operator: '~',
      },
      {
        value: 'exact',
        label: 'Pinned exact version',
        operator: '',
      },
    ]

    // Install

    const taskId = ref()

    const { mutate, loading: mutating } = useMutation(gql`
      mutation installPackage ($input: InstallPackageInput!) {
        task: installPackage (input: $input) {
          ...task
        }
      }
      ${taskFragment}
    `)

    async function install () {
      let versionSelector

      if (selectedVersion.value) {
        if (isVersionTag.value && useTagAsSelector.value) {
          versionSelector = selectedVersion.value.substr(1)
        } else {
          const { operator } = selectorTypes.find(t => t.value === selectorType.value)
          versionSelector = `${operator}${actualVersion.value}`
        }
      }

      const { data } = await mutate({
        input: {
          packageName: props.packageName,
          workspaceId: route.value.params.workspaceId,
          dev: devDep.value,
          versionSelector,
        },
      })
      taskId.value = data.task.id
    }

    // Task

    const { running, onSuccess } = useTask(taskId)

    onSuccess(() => {
      close()
    })

    return {
      close,
      metadata,
      loading,
      devDep,
      selectedVersion,
      versions,
      isVersionTag,
      actualVersion,
      useTagAsSelector,
      selectorType,
      selectorTypes,
      install,
      mutating,
      running,
    }
  },
}
</script>

<template>
  <div
    v-if="metadata"
    class="p-6"
  >
    <div class="border border-gray-200 dark:border-gray-950 rounded p-6 flex">
      <PackageLogo
        :pkg="metadata"
        class="w-12 h-12 mr-6"
      />

      <!-- Info -->
      <div class="flex-1 overflow-hidden">
        <div class="truncate">
          {{ metadata.id }}
        </div>
        <div class="flex items-baseline truncate">
          <div
            v-if="metadata.description"
            class="text-gray-500 truncate pr-4"
          >
            {{ metadata.description }}
          </div>

          <div
            v-if="metadata.official"
            class="flex-none text-sm text-orange-600 bg-orange-100 dark:text-yellow-300 dark:bg-orange-800 rounded-full px-2 mr-4"
          >
            {{ $t('guijs.package.official') }}
          </div>
        </div>
      </div>
    </div>

    <!--  Dep type -->

    <VSwitch
      v-model="devDep"
      label="guijs.install-package.install-as-dev-dependency"
      class="form-input my-6"
    />

    <!-- Version -->
    <VSelect
      v-model="selectedVersion"
      :options="versions"
      searchable
      label="guijs.install-package.input-version-label"
      placeholder="guijs.install-package.input-version-placeholder"
      buttonClass="form-input"
      optionClass="p-2"
      class="mt-6"
    >
      <template #default="{ option }">
        <span v-if="option.type === 'version'">
          <span class="text-gray-500">
            {{ $t('guijs.install-package.version') }}
          </span>
          <span class="font-mono text-sm">{{ option.value }}</span>
        </span>

        <span v-if="option.type === 'tag'">
          <span class="text-primary-500">
            <i class="material-icons text-lg">local_offer</i>
            {{ option.tag }}
          </span>
          <span class="text-gray-700 dark:text-gray-300 font-mono text-sm">
            {{ option.version }}
          </span>
        </span>
      </template>
    </VSelect>

    <VSwitch
      v-if="isVersionTag"
      v-model="useTagAsSelector"
      label="guijs.install-package.use-tag-as-selector"
      class="form-input my-6"
    />

    <!-- Selector type -->
    <VSelect
      v-if="!isVersionTag || !useTagAsSelector"
      v-model="selectorType"
      :options="selectorTypes"
      label="guijs.install-package.input-selector-type-label"
      placeholder="guijs.install-package.input-selector-type-placeholder"
      buttonClass="form-input"
      optionClass="p-2"
      class="mt-6"
    >
      <template #default="{ option }">
        <span>
          {{ option.label }}
          <span class="ml-2 text-gray-700 dark:text-gray-300 font-mono text-sm">
            {{ option.operator }}{{ actualVersion }}
          </span>
        </span>
      </template>
    </VSelect>

    <!-- Actions -->
    <div class="flex mt-6">
      <VButton
        :disabled="mutating || running"
        iconLeft="close"
        class="flex-1 btn-lg btn-dim mr-6"
        @click="close()"
      >
        {{ $t('guijs.common.cancel') }}
      </VButton>

      <VButton
        :loading="mutating || running"
        iconLeft="get_app"
        class="flex-1 btn-lg btn-primary"
        @click="install()"
      >
        {{ $t('guijs.install-package.install-with-name', { name: packageName }) }}
      </VButton>
    </div>
  </div>
</template>
