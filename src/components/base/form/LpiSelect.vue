<template>
  <div v-click-outside="clickOutside" class="lpi-select" :class="{ active: stateModal }">
    <div
      class="menu-header"
      :class="{ placeholder: !selected, 'placeholder--open': stateModal }"
      @click="toggleModal"
    >
      <span class="selected-label skeletons-text" :style="styles">
        <slot v-if="selected" name="content" v-bind="selected">
          {{ selected.label }}
        </slot>
        <template v-else>
          {{ placeholder }}
        </template>
      </span>
      <IconImage :name="icon" class="svg skeletons-background" />
    </div>
    <div class="options-wrapper">
      <Transition name="menu-fade">
        <ul
          v-show="stateModal"
          class="option-list skeletons-background"
          :class="{
            'height-limit': maxHeight,
          }"
        >
          <template v-for="option in options">
            <li v-if="!selected || option.value !== selected.value" :key="option.value">
              <button class="menu-dropdown" :data-test="option.dataTest" @click="select(option)">
                <slot name="content" v-bind="option">
                  {{ option.label }}
                </slot>
              </button>
            </li>
          </template>
        </ul>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts" generic="ModelType extends string | number">
import IconImage from '~/components/base/media/IconImage.vue'
import type { IconImageChoice } from '~/functs/IconImage'
import type { Properties } from 'csstype'
import type { StyleValue } from 'vue'

type Option = {
  label?: string
  value: ModelType
  dataTest?: string
}

const props = withDefaults(
  defineProps<{
    options: Option[]
    placeholder?: string
    maxHeight?: Properties['maxHeight']
  }>(),
  {
    placeholder: null,
    maxHeight: null,
  }
)
const emit = defineEmits<{
  blur: []
}>()

const { t } = useNuxtI18n()
const model = defineModel<ModelType>({ default: null })
const { stateModal, toggleModal, closeModal } = useModal(false)
const icon = computed<IconImageChoice>(() => (stateModal.value ? 'ChevronUp' : 'ChevronDown'))

const selected = computed(() => props.options.find((option) => option.value === model.value))

const translatedPlaceholder = computed(() => props.placeholder || t('common.select-placeholder'))

const styles = computed<StyleValue>(() => {
  let maxCharLength = translatedPlaceholder.value ? translatedPlaceholder.value.length : 0
  for (let i = 0; i < props.options.length; i++) {
    maxCharLength = Math.max(
      maxCharLength,
      props.options[i].label ? props.options[i].label.length : 0
    )
  }

  return {
    width: `${maxCharLength * 8}px`, // use em to get current font width
  }
})

const select = (option: Option) => {
  model.value = option.value
  closeModal()
}
const clickOutside = () => {
  closeModal()
  emit('blur')
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.lpi-select {
  display: inline-block;
  position: relative;
  background: variables.$white;
  border-radius: variables.$border-radius-s;
  border: variables.$border-width-s solid var(--light-gray);

  &.active {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-width: 0;

    .option-list {
      border-top-width: 0;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }

  .option-list {
    background-color: variables.$white;
    border: variables.$border-width-s solid var(--light-gray);
    border-radius: variables.$border-radius-s;

    &.height-limit {
      max-height: v-bind('maxHeight');
      overflow-y: scroll;
    }
  }

  .menu-header {
    z-index: 14;
    padding: variables.pxToRem(12px) variables.$space-l;
    appearance: none;
    font-size: variables.$font-size-m;
    font-weight: 700;
    max-width: 100%;
    transition: 0.15s all ease-in-out;
    padding-right: variables.$space-xl;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--black);

    &.placeholder {
      color: var(--mid-gray);
      font-weight: 400;

      &--open {
        padding-top: variables.pxToRem(13px);
      }
    }

    &:focus {
      outline: 0;
    }
  }

  .menu-dropdown {
    padding: variables.pxToRem(10px) variables.$space-l;
    appearance: none;
    font-size: variables.$font-size-m;
    font-weight: 400;
    width: 100%;
    max-width: 100%;
    padding-right: variables.$space-xl;
    background: transparent;
    border: none;
    cursor: pointer;
    text-align: left;
    color: var(--black);

    &:hover {
      background: var(--almost-white);
    }
  }

  .selected-label {
    display: inline-block;
    font-size: variables.$font-size-m;
  }
}

.options-wrapper {
  position: absolute;
  top: 100%;
  min-width: 100%;
  left: -(variables.$border-width-s);
  right: -(variables.$border-width-s);
  z-index: 100;
  overflow: hidden;

  button {
    font-weight: 400;
  }
}

.svg {
  height: 21px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 8px;
  fill: var(--black);
}

.menu-fade-leave-active,
.menu-fade-enter-active {
  transform: translateY(0);
  transition: 0.15s transform ease-in-out;
}

.menu-fade-enter,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.lpi-select.small {
  .menu-header {
    padding: variables.pxToRem(8px) variables.$space-m;
    font-size: variables.$font-size-m;

    &.placeholder--open {
      padding-top: variables.pxToRem(9px);
    }
  }

  .menu-dropdown {
    padding: variables.pxToRem(6px) variables.$space-m;
    padding-right: variables.$space-l;
  }

  .selected-label {
    font-size: variables.$font-size-m;
  }
}

// old style, add 'primary' class to use it
// TODO check if still needed
.lpi-select.primary {
  background: var(--primary-dark);
  border-radius: variables.$border-radius-l;
  border: 0 none;

  &.active {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    .option-list {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }

  .menu-header {
    color: var(--white);
  }

  .option-list {
    background-color: var(--primary-dark);
    border-radius: variables.$border-radius-l;
  }

  .menu-dropdown {
    color: var(--white);
  }

  .svg {
    fill: var(--white);
  }
}
</style>
