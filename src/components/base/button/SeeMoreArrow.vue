<template>
  <component
    :is="is"
    class="see-more-arrow"
    :to="to"
    :href="to ? undefined : '#'"
    @click="emit('click')"
  >
    <span class="label-ctn">{{ label ? label : $t('common.see-more') }}</span>
    <span class="arrow-ctn"><IconImage name="ArrowRight" class="arrow" /></span>
  </component>
</template>
<script setup lang="ts">
import IconImage from '@/components/base/media/IconImage.vue'
const props = withDefaults(
  defineProps<{
    to?: string | object
    label?: string
    is?: string
  }>(),
  {
    to: null,
    label: null,
    is: null,
  }
)

const emit = defineEmits(['click'])

const is = computed(() => {
  if (props.is) {
    return props.is
  }
  if (props.to) return resolveComponent('NuxtLink')
  return 'a'
})
</script>
<style lang="scss" scoped>
$icon-size: pxToRem(18px);

.see-more-arrow {
  color: $primary-dark;
  padding: 0 $space-l;
  display: inline-block;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;

  .label-ctn {
    text-transform: lowercase;
    display: inline-block;
    height: $icon-size;

    &::first-letter {
      text-transform: capitalize;
    }
  }

  .arrow-ctn {
    margin-left: $space-s;
    display: inline-block;
    vertical-align: middle;

    .arrow {
      height: $icon-size;
      width: $icon-size;
      fill: $primary-dark;
      transform: translateZ(0);
    }
  }

  &:hover {
    .arrow {
      animation-name: arrowbounce;
      animation-duration: 0.6s;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
      transform-origin: left center;
    }
  }
}

@keyframes arrowbounce {
  0% {
    transform: translateZ(0) scale(1, 1) translateX(0%);
  }

  80% {
    transform: translateZ(0) scale(0.7, 1) translateX(100%);
  }

  100% {
    transform: translateZ(0) scale(1, 1) translateX(0%);
  }
}
</style>
