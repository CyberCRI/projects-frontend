<template>
  <component
    :is="to ? 'NuxtLink' : 'button'"
    :to="to"
    class="header-link"
    :class="{ underlined }"
    :data-test="dataTest"
    @click="$emit('click')"
  >
    <span class="link-label">
      <slot>
        <IconImage v-if="icon" :name="icon" class="icon" :class="{ rounded: roundedIcon }" />
        {{ label }}
      </slot>
    </span>
  </component>
</template>

<script setup lang="ts">
import { IconImageChoice } from '@/functs/IconImage'
import IconImage from '@/components/base/media/IconImage.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    icon?: IconImageChoice
    routes?: any[]
    roundedIcon?: boolean
    dataTest?: string
    to?: string | object
  }>(),
  {
    label: null,
    icon: null,
    routes: null,
    roundedIcon: false,
    dataTest: null,
    to: null,
  }
)

defineEmits<{ click: [] }>()

const route = useRoute()

const underlined = computed(() => {
  if (props.routes) {
    return props.routes.includes(route.name)
  }
  return false
})
</script>

<style lang="scss" scoped>
.header-link,
button.header-link,
a.header-link:visited {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: $space-m $space-l;
  font-weight: 700;
  font-size: $font-size-m;
  cursor: pointer;
  will-change: transform;
  overflow: hidden;
  background-color: transparent;
  color: $primary-dark;
  border: 0 none;
  text-transform: uppercase;

  .link-label {
    display: flex;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: pxToRem(6px);
      background-color: $primary-dark;
      bottom: pxToRem(-8px);
      transform: translateZ(0) scale(0);
      transition: transform 0.15s ease-in-out;
    }
  }

  .icon {
    margin-right: $space-s;
    height: pxToRem(18px);
    fill: $primary-dark;

    &.rounded {
      fill: $white;
      background-color: $primary-dark;
      border-radius: pxToRem(9px);
    }
  }

  &.underlined,
  &:hover {
    opacity: 1;
    position: relative;

    & .link-label::after {
      transform: translateZ(0) scale(1);
    }
  }
}
</style>
