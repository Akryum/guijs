<template>
  <div class="project-create-step-select">
    <ProjectCreateStepPrompts
      ref="prompts"
      :step="step"
      @valid="value => $emit('valid', value)"
    />

    <div
      v-if="currentValue === '__remote__'"
      ref="remotePreset"
      class="remote-preset"
    >
      <div class="url">
        {{ remotePreset.url }}
      </div>
      <VueButton
        icon-left="edit"
        class="icon-button"
        @click="showRemotePreset = true"
      />
      <VueButton
        icon-left="delete"
        class="icon-button"
        @click="clearValue()"
      />
    </div>

    <VueModal
      v-if="showRemotePreset"
      :title="$t('org.vue.views.project-create.tabs.presets.modal.title')"
      class="small remove-preset-modal"
      @close="closeRemotePresetModal()"
    >
      <div class="default-body vue-ui-grid big-gap col-1">
        <VueFormField
          :title="$t('org.vue.views.project-create.tabs.presets.remote.url.title')"
          :subtitle="$t('org.vue.views.project-create.tabs.presets.remote.url.subtitle')"
        >
          <VueInput
            v-model="remotePreset.url"
            icon-left="language"
            v-focus
          />
        </VueFormField>

        <VueFormField
          :title="$t('org.vue.views.project-create.tabs.presets.remote.options')"
        >
          <VueSwitch
            v-model="remotePreset.clone"
            class="extend-left"
            :disabled="remoteNotGithub"
          >
            {{ $t('org.vue.views.project-create.tabs.presets.remote.clone') }}
          </VueSwitch>
        </VueFormField>
      </div>

      <div slot="footer" class="actions">
        <VueButton
          :label="$t('org.vue.views.project-create.tabs.presets.remote.done')"
          :disabled="!remotePreset.url || !remotePresetValid"
          :loading-secondary="remotePresetValid === null"
          icon-left="done"
          class="primary big"
          @click="closeRemotePresetModal()"
        />
      </div>
    </VueModal>
  </div>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
  props: {
    step: {
      type: Object,
      required: true,
    },
  },

  data () {
    return {
      showRemotePreset: false,
      remotePreset: {
        url: '',
        clone: false,
      },
      remotePresetValid: false,
    }
  },

  computed: {
    prompt () {
      return this.step.prompts[0]
    },

    currentValue () {
      return JSON.parse(this.prompt.value)
    },

    remoteNotGithub () {
      const { url } = this.remotePreset
      return url && /^(gitlab|bitbucket):/.test(url)
    },
  },

  watch: {
    currentValue: {
      handler (value) {
        if (value === '__remote__') {
          this.showRemotePreset = true
        }
      },
      immediate: true,
    },

    'remotePreset.url' () {
      this.debouncedCheckRemotePreset()
    },

    'remotePreset.clone' () {
      this.debouncedCheckRemotePreset()
    },
  },

  created () {
    this.debouncedCheckRemotePreset = debounce(this.checkRemotePreset, 1000)
  },

  methods: {
    clearValue () {
      this.$refs.prompts.answerPrompt({
        prompt: this.prompt,
        value: null,
      })
      this.remotePreset = {
        url: '',
        clone: false,
      }
    },

    closeRemotePresetModal () {
      this.showRemotePreset = false
      if (this.remotePreset.url) {
        this.$refs.remotePreset.scrollIntoView()
      } else {
        this.clearValue()
      }
      this.$emit('remote-preset', this.remotePreset)
    },

    async checkRemotePreset () {
      if (!this.remotePreset.url) {
        this.remotePresetValid = false
        return
      }

      if (this.remotePreset.clone) {
        this.remotePresetValid = true
      } else {
        this.remotePresetValid = null

        const url = `https://raw.githubusercontent.com/${this.remotePreset.url}/master/preset.json`

        const response = await fetch(url)
        this.remotePresetValid = response.ok
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
>>> .prompts-list .group
  margin-bottom 0

.remote-preset
  display flex
  align-items baseline
  padding 0 $padding-item $padding-item 64px
  background rgba($vue-ui-color-primary, .08)

  .url
    flex 1
    overflow hidden
    white-space nowrap
    text-overflow ellipsis

  .vue-ui-button
    margin-left $padding-item
</style>
