<template>
  <VueModal
    :title="$t(step.name)"
    class="medium"
    @close="previous()"
  >
    <div class="default-body">
      <ProjectCreateStepPrompts
        :step="step"
        v-bind="$attrs"
        v-on="$listeners"
      />
    </div>

    <template #footer>
      <div class="actions">
        <VueButton
          v-if="hasPrevious"
          icon-left="arrow_back"
          :label="$t('org.vue.views.project-create.tabs.presets.buttons.previous')"
          class="big previous"
          @click="previous()"
        />

        <VueButton
          v-else
          icon-left="close"
          :label="$t('org.vue.views.project-create.tabs.details.buttons.cancel')"
          class="big close"
          @click="cancel()"
        />

        <VueButton
          v-if="step.canSkip"
          :label="$t('org.vue.common.skip')"
          class="big next"
          @click="next()"
        />

        <VueButton
          v-if="hasNext"
          :label="$t('org.vue.views.project-create.tabs.details.buttons.next')"
          :disabled="!isValid"
          icon-right="arrow_forward"
          class="big primary next"
          @click="next()"
        />

        <VueButton
          v-else
          :label="$t('org.vue.views.project-create.tabs.presets.buttons.create')"
          :disabled="!isValid"
          icon-left="done"
          class="big primary next"
          @click="next()"
        />
      </div>
    </template>
  </VueModal>
</template>

<script>
import Step from './Step'
import ProjectCreateStepPrompts from './ProjectCreateStepPrompts.vue'

export default {
  components: {
    ProjectCreateStepPrompts,
  },

  mixins: [
    Step(),
  ],
}
</script>
