<script>
import { computed, ref, getCurrentInstance, watch } from '@vue/composition-api'
import { useKeyboardNavigation } from '../util/navigation'
import { bindScope } from '../util/keybinding'

export default {
  model: {
    prop: 'value',
    event: 'update',
  },

  props: {
    // eslint-disable-next-line
    value: {},

    options: {
      type: Array,
      required: true,
    },

    placeholder: {
      type: String,
      default: null,
    },

    buttonClass: {
      type: [Object, Array, String],
      default: null,
    },

    optionClass: {
      type: [Object, Array, String],
      default: null,
    },
  },

  setup (props, { emit, refs }) {
    const vm = getCurrentInstance()
    const scopeId = `select_${vm._uid}`
    const isOpen = ref(false)

    const currentOption = computed(() => props.options.find(option => option.value === props.value))

    function selectOption (option) {
      emit('update', option.value)
      isOpen.value = false
    }

    // Popper

    const popper = ref(null)
    const minWidth = ref()

    watch(isOpen, value => {
      if (value) {
        minWidth.value = `${popper.value.$el.offsetWidth}px`
      }
    })

    // Search

    const filteredOptions = computed(() => props.options)

    // Keyboard

    bindScope(scopeId, isOpen)

    const { onSelect, selectedIndex } = useKeyboardNavigation(filteredOptions, scopeId)
    onSelect(selectOption)

    watch(selectedIndex, value => {
      if (refs.popperContent) {
        const el = refs.popperContent.querySelector(`[data-index="${value}"]`)
        if (el) {
          el.scrollIntoViewIfNeeded()
        }
      }
    })

    return {
      isOpen,
      currentOption,
      popper,
      minWidth,
      filteredOptions,
      selectedIndex,
      selectOption,
    }
  },
}
</script>

<template>
  <VPopper
    ref="popper"
    :open.sync="isOpen"
  >
    <slot
      name="trigger"
      :option="currentOption"
    >
      <div class="overflow-hidden">
        <VButton
          icon-right="keyboard_arrow_down"
          class="w-full"
          :class="buttonClass"
          align="left"
          extend
          square
        >
          <slot
            name="label"
            :option="currentOption"
          >
            <slot
              v-if="currentOption"
              :option="currentOption"
            />
            <span v-else-if="placeholder">
              {{ placeholder }}
            </span>
          </slot>
        </VButton>
      </div>
    </slot>

    <template #popper>
      <div
        ref="popperContent"
        class="flex flex-col items-stretch max-h-128 overflow-y-auto"
        :style="{
          minWidth,
        }"
      >
        <slot name="popper-start" />

        <VButton
          v-for="(option, index) of filteredOptions"
          :key="option.value"
          :class="[
            optionClass,
            {
              'bg-primary-100 dark:bg-primary-900': index === selectedIndex,
              'bg-primary-200 dark:bg-primary-800': option === currentOption,
            }
          ]"
          :data-index="index"
          align="left"
          extend
          square
          @mouseover.native="selectedIndex = index"
          @click="selectOption(option)"
        >
          <slot :option="option" />
        </VButton>

        <slot name="popper-end" />
      </div>
    </template>
  </VPopper>
</template>
