<template>
  <div class="accordion">
    <div class="header" :class="{ 'header-active': show }" @click="toggle">
      <slot name="header" />
      <IconImage name="MenuDown" class="icon" :class="{ rotate: show }" />
    </div>
    <transition
      name="accordion"
      @before-enter="beforeEnter"
      @enter="enter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <div v-show="show" class="body">
        <div class="body-inner">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import IconImage from '@/components/base/media/IconImage.vue'

const emit = defineEmits<{ 'is-active': [boolean] }>()
const show = ref(false)

const toggle = () => {
  show.value = !show.value
  emit('is-active', show.value)
}
const beforeEnter = (el) => (el.style.height = '0')
const enter = (el) => (el.style.height = '100%')

const beforeLeave = (el) => (el.style.height = '100%')
const leave = (el) => (el.style.height = '0')
</script>

<style scoped lang="scss">
.header {
  display: inline-flex;
  align-items: center;
  width: 100%;
  padding: 8px;
  border-radius: $border-radius-xs;

  &-active {
    background: $primary;
    color: $primary-dark;
  }
}

.accordion .icon {
  width: pxToRem(24px);
  fill: $white;
  transform: rotate(0deg);
  transition-duration: 0.3s;
}

.accordion .body {
  display: block;
  overflow: scroll;
  border-top: 0;
  border-bottom-left-radius: $border-radius-s;
  border-bottom-right-radius: $border-radius-s;
  transition: 150ms ease-out;
}

.accordion .body-inner {
  padding: $space-s;
  overflow-wrap: break-word;
  overflow: auto;

  /*   white-space: pre-wrap; */
}

.accordion .icon.rotate {
  transform: rotate(180deg);
  transition-duration: 0.3s;
  fill: $primary-dark;
}
</style>
