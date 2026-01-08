<template>
  <div v-click-outside="close" class="lpi-dropdown" :class="{ 'is-open': open }">
    <button type="button" class="dropdown toggle-btn" @click.prevent="toggle">
      <span class="dropdown-btn">{{ showLabel }}</span>
      <IconImage class="caret" :name="open ? 'ChevronUp' : 'ChevronDown'" />
    </button>
    <transition name="slide">
      <div v-if="open" class="lpi-dropdown-choose">
        <div class="dropdown-menu custom-scrollbar">
          <ul>
            <LpiDropdDownElement
              v-for="option in props.options"
              :key="option.id"
              :option="option"
              :selected="option.id === selectedOption?.id"
            >
              <template #default="{ option: _option, selected: _selected }">
                <slot
                  name="default"
                  :selected="_selected"
                  :option="_option"
                  @click.prevent="close"
                />
              </template>
            </LpiDropdDownElement>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { capitalize } from '@/functs/string'

import IconImage from '@/components/base/media/IconImage.vue'
import LpiDropdDownElement from '@/components/base/form/LpiDropDownElement.vue'

defineOptions({
  name: 'LpiDropDown',
})

defineEmits(['close'])

const props = defineProps({
  defaultLabel: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [Number, null, Object],
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
})

const open = ref(false)

const close = () => (open.value = false)
const toggle = () => (open.value = !open.value)

// when value change, close select
watch(() => props.modelValue, close)

// find the correct element form modelValue (modelValue is object from options or the id )
const selectedOption = computed(() => {
  const choice = props.modelValue?.id ?? props.modelValue
  const flatChild = (el) => {
    let arr = []
    el.forEach((e) => {
      if (e.children) {
        arr = [...arr, flatChild(e.children)]
      } else {
        arr.push(e)
      }
    })
    return arr
  }
  const flat = flatChild(props.options)
  return flat.find(({ id }) => id === choice)
})

const showLabel = computed(() => {
  const vl =
    selectedOption.value?.label ??
    selectedOption.value?.name ??
    selectedOption.value?.value ??
    props.defaultLabel
  return capitalize(vl.toString())
})
</script>

<style lang="scss" scoped>
.lpi-dropdown {
  position: relative;

  &.is-open,
  &.is-open .lpi-dropdown-choose {
    box-shadow: 0 12px 12px rgb(0 0 0 / 30%);
  }
}

.dropdown {
  border: 1px solid $lighter-gray;
  border-radius: $border-radius-s;
  height: pxToRem(50px);
  display: flex;
  justify-content: space-between;
  padding-inline: $space-m;
  align-items: center;
  width: 100%;
  background-color: transparent;

  @media (min-width: $min-tablet) {
    margin-top: $space-l;
  }

  .dropdown-btn {
    color: $primary-dark;
    font-size: $font-size-m;
    font-weight: 700;
  }

  .caret {
    margin-left: $space-l;
    fill: $primary-dark;
    width: pxToRem(20px);
  }
}

.is-open .dropdown {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: 0;
}

.lpi-dropdown-choose {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s;
  transform-origin: top center;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateZ(0) scaleY(1);

  :deep(a) {
    opacity: 0;
  }
}

.slide-enter-from,
.slide-leave-to {
  transform: translateZ(0) scaleY(0) translateY(-2rem);

  :deep(a) {
    opacity: 0;
  }
}

.dropdown-menu {
  background-color: $white;
  border-width: 0 1px 1px;
  border-style: solid;
  border-color: $lighter-gray;
  border-bottom-left-radius: $border-radius-xs;
  border-bottom-right-radius: $border-radius-xs;
  max-height: pxToRem(450px);
  padding: $space-s $space-xs;
  transition: 0.15s all ease-in-out;
  cursor: pointer;
  will-change: transform;
  overflow-y: scroll;
}
</style>
