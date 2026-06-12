<script setup lang="ts">
import IconImage from '~/components/base/media/IconImage.vue'
import type { IconImageChoice } from '~/functs/IconImage'
import { onClient } from '~/composables/onClient'
import { debounce } from 'es-toolkit'

export type GroupOption = {
  iconName?: IconImageChoice
  value: number | string | boolean
  label?: string
  title?: string
}

const props = withDefaults(
  defineProps<{
    options: GroupOption[]
    hasIcon?: boolean
    size?: 'default' | 's-small' | 's-extra-small'
    isDanger?: boolean
    isVertical?: boolean
    customColor?: string
  }>(),
  {
    hasIcon: false,
    size: 'default',
    isDanger: false,
    isVertical: false,
    customColor: null,
  }
)
const model = defineModel<GroupOption['value']>({ default: '' })

const uniqueId = useUniqueId()

const sliderStyle = ref(null)
const mountedIcons = ref([])

const groupButtonStyle = computed(() => {
  if (!props.customColor) return {}
  return { 'border-color': props.customColor }
})

const selectButton = (groupOption: GroupOption) => (model.value = groupOption.value)

const onIconMounted = (icon) => {
  mountedIcons.value.push(icon)
  if (mountedIcons.value.length === props.options.filter((el) => el.iconName).length)
    setSliderStyle()
}

const setSliderStyle = onClient(() => {
  if (!props.options.some((button) => button.value === model.value)) return

  const container = document.getElementById(`group-button-${uniqueId}`)
  if (!container) return

  const groupButton = container.getElementsByClassName('button-container')
  let selectedReached = false
  let firstButtonSelected = false

  const selected = container.getElementsByClassName('selected')[0] as HTMLElement
  if (!selected) return

  if (!props.isVertical) {
    // Calculate slider's left offset
    let leftOffset = 0
    Array.prototype.forEach.call(groupButton, (button, i) => {
      if (button.className.split(' ').includes('selected')) {
        selectedReached = true
        if (i === 0) firstButtonSelected = true
      }
      if (!selectedReached) leftOffset += button.offsetWidth
    })

    // If not in vertical mode, set slider's width
    const selectedWidth = selected.offsetWidth

    sliderStyle.value = `left: ${
      leftOffset + (firstButtonSelected ? 0 : 1)
    }px; width: ${selectedWidth + (firstButtonSelected ? 1 : 0)}px; ${props.customColor}`
  } else {
    // Else set slider's height
    // Calculate slider's left offset
    let topOffset = 0
    Array.prototype.forEach.call(groupButton, (button, i) => {
      if (button.className.split(' ').includes('selected')) {
        selectedReached = true
        if (i === 0) firstButtonSelected = true
      }
      if (!selectedReached) topOffset += button.offsetHeight
    })

    const selectedHeight = selected.offsetHeight

    sliderStyle.value = `top: ${topOffset + (firstButtonSelected ? 0 : 1)}px; height: ${
      selectedHeight + (firstButtonSelected ? 1 : 0)
    }px; ${props.customColor}`
  }
})

onResize(debounce(setSliderStyle, 100), { immediate: true })
watch(model, () => setSliderStyle(), { immediate: true })
</script>

<template>
  <div
    :id="`group-button-${uniqueId}`"
    class="group-button"
    :class="{
      'is-danger': isDanger,
      'is-vertical': isVertical,
      'is-custom-color': customColor,
    }"
    role="group"
    aria-label="Radio button group"
    :style="groupButtonStyle"
  >
    <div
      v-for="(button, index) in options"
      :key="index"
      class="button-container skeletons-background"
      :class="[{ selected: button.value === modelValue }, size]"
      :title="button.title || button.label"
      :tabIndex="index + 1"
      @click="selectButton(button)"
      @transitionend="setSliderStyle"
    >
      <transition appear @after-enter="onIconMounted(button)" @after-leave="onIconMounted(button)">
        <IconImage
          v-if="hasIcon && button.iconName"
          :id="button.iconName"
          class="icon"
          :name="button.iconName"
          :class="{ 'icon-selected': button.value === modelValue }"
        />
      </transition>
      <label
        v-if="button.label"
        class="label"
        :class="[{ 'label-selected': button.value === modelValue }, modelValue]"
      >
        {{ button.label }}
      </label>
    </div>

    <div class="slider" :style="sliderStyle" />
  </div>
</template>

<style lang="scss" scoped>
/* This will be moved to the reset file */
*,
*::before,
*::after {
  box-sizing: border-box;
}

.label {
  cursor: pointer;
  margin: 0;
  font-size: inherit;
  font-weight: bold;
  transition: 0.15s color ease-in-out;
  line-height: $line-height-squashed;
}

.label-selected {
  color: $white;
}

.icon {
  width: 20px;
  height: 18px;
  fill: $primary-dark;
  transition: 0.15s fill ease-in-out;
}

.icon-selected {
  fill: $white;
}

.group-button {
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  overflow: hidden;
  box-shadow: 0 0 0 $border-width-s var(--primary-dark) inset;
  border-radius: $border-radius-l;
  z-index: 1;

  &.is-danger {
    box-shadow: 0 0 0 $border-width-s var(--salmon) inset;

    .button-container.selected {
      background: var(--salmon);
    }

    .button-container:not(.selected) {
      .label {
        color: var(--salmon);
      }

      .icon {
        fill: var(--salmon);
      }
    }

    .slider {
      background: var(--salmon);
    }
  }

  &.is-vertical {
    flex-direction: column;

    .slider {
      width: 100%;
    }
  }

  &:not(.is-vertical) {
    .slider {
      height: 100%;
    }
  }
}

.button-container {
  display: flex;
  align-items: center;
  padding: $space-s $space-l;
  font-size: $font-size-m;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:not(.selected) {
    color: var(--primary-dark);
  }

  &:not(.selected):hover {
    opacity: 0.7;
  }

  *:not(:last-child) {
    margin-right: $space-s;
  }
}

.slider {
  display: flex;
  position: absolute;
  top: 0;
  transition: all 0.15s ease-in-out;
  background: var(--primary-dark);
  z-index: -1;
  border-radius: $border-radius-l;
  border: $border-width-s solid var(--primary-dark);
}

// TODO: remove "s-" in the following classes when we don't import Buefy style anymore
.s-small {
  font-size: $font-size-xs;
  padding: $space-s 14px;
  height: 24px;
}

.s-extra-small {
  font-size: $font-size-2xs;
  padding: $space-2xs $space-m;
  height: 13px;
}
</style>
