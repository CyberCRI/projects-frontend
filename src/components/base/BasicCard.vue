<template>
  <div class="basic-card" :class="{ 'scale-hover': !isInactive, [mode]: true }" tabindex="1">
    <div class="action-left-wrapper">
      <slot name="actions-left" />
    </div>
    <div class="action-right-wrapper">
      <slot name="actions-right" />
    </div>

    <component
      :is="is"
      class="card-inner"
      :class="{ inactive: isInactive }"
      :to="toLink"
      @click="!isInactive && $emit('click')"
    >
      <!-- Content -->
      <div class="content">
        <slot />
      </div>
      <!-- Footer -->
      <slot name="footer" />
    </component>
  </div>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(
  defineProps<{
    toLink?: RouteLocationRaw
    mode?: 'card' | 'list'
    lineClamp?: number
    isInactive?: boolean
  }>(),
  {
    toLink: null,
    mode: 'card',
    lineClamp: 6,
    isInactive: false,
  }
)

defineEmits<{ click: [] }>()

const is = computed(() => {
  if (props.toLink && !props.isInactive) return resolveComponent('NuxtLink')
  return 'div'
})
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.basic-card {
  display: flex;
  position: relative;
  background: variables.$white;
  overflow: hidden;

  .card-inner {
    display: flex;
    flex-grow: 1;
  }

  &.card {
    flex-direction: column;
    justify-content: space-between;
    height: variables.$card_height;
    width: variables.$card_width;
    border: variables.$border-width-s solid var(--primary);
    border-radius: variables.$border-radius-m;
    text-align: center;

    .card-inner {
      flex-flow: column;
    }

    .inactive {
      pointer-events: none;
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  &.list {
    flex-direction: row;
    border-bottom: variables.$border-width-s solid var(--primary);

    .card-inner {
      flex-flow: row;
    }
  }
}

:deep(.picture) {
  $picture-width: 90px;

  display: flex;
  width: variables.pxToRem($picture-width);
  height: variables.pxToRem($picture-width);
  border-radius: variables.$border-radius-xs;
  box-shadow: 0 0 2px rgb(0 0 0 / 15%);
  flex-shrink: 0;
}

.card {
  :deep(.picture-user) {
    $picture-width: 110px;

    width: variables.pxToRem($picture-width);
    height: variables.pxToRem($picture-width);
  }

  :deep(.picture-project) {
    $picture-width: 86px;

    width: variables.pxToRem($picture-width);
    height: variables.pxToRem($picture-width);
  }

  :deep(.picture-group) {
    border-radius: 50%;
    width: variables.pxToRem(90px);
    height: variables.pxToRem(90px);
  }
}

.list {
  :deep(.picture-user),
  :deep(.picture-project),
  :deep(.picture-group) {
    $picture-width: 80px;

    width: variables.pxToRem($picture-width);
    height: variables.pxToRem($picture-width);
  }

  :deep(.picture-group) {
    border-radius: 50%;
  }
}

:deep(.card-title) {
  margin-top: variables.$space-s;
  font-weight: 700;
  font-size: variables.$font-size-m;
  line-height: variables.$line-height-compact;
  width: 100%;

  &::first-letter {
    text-transform: uppercase;
  }
}

:deep(.card-type) {
  font-weight: 700;
  font-size: variables.$font-size-xs;
  text-transform: uppercase;
  color: variables.$primary;
  margin-top: variables.$space-s;
}

:deep(.content) {
  display: flex;
  cursor: pointer;
}

.card :deep(.content) {
  flex-direction: column;
  align-items: center;
  padding: variables.$space-m variables.$space-m 0 variables.$space-m;
  height: 100%;
}

.list :deep(.content) {
  flex-direction: row;
  align-items: center;
  padding: 0.75rem;
  gap: 1rem;
  flex-basis: 100%;
  flex-grow: 1;
}

:deep(.content--open) {
  align-items: start;
  text-align: start;
  display: block;
  word-break: normal;
  overflow-wrap: break-word;
  overflow: hidden auto;
}

.card :deep(.text-limit) {
  display: -webkit-box;
  -webkit-line-clamp: v-bind('lineClamp');
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: normal;
  overflow-wrap: break-word;
}

.list :deep(.text-limit) {
  display: block;
  text-align: left;
}

:deep(.description) {
  margin-top: variables.$space-m;
  font-size: variables.$font-size-s;
  width: 100%;
}

:deep(.card-description) {
  margin-top: variables.$space-xs;
  font-size: variables.$font-size-s;
}

:deep(.action-right-wrapper),
:deep(.action-left-wrapper) {
  position: absolute;
  top: 12px;
  display: flex;
  flex-flow: column nowrap;
  gap: variables.$space-m;

  // don't block click on card despite we are not a child of it and absolutely positioned above
  // (however this doesnt prevent click on icons, see .icon.passive below for that)
  pointer-events: none;
}

:deep(.action-right-wrapper) {
  right: 12px;
}

.card :deep(.action-left-wrapper) {
  left: 12px;
}

.list :deep(.action-left-wrapper) {
  right: 44px;
}

.project-card.list :deep(.action-left-wrapper) {
  right: 12px;
}

.project-card.list :deep(.action-right-wrapper) {
  right: 44px;
}

:deep(.icon) {
  width: 24px;
  height: 24px;
  fill: variables.$primary-dark;
  cursor: pointer;
  pointer-events: auto; // overide passive wrapper

  &.passive,
  &.passive * {
    // otherwise svg and its subnodes will also block event
    pointer-events: none;
  }
}

:deep(.icon--fixed-dot) {
  bottom: 0;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -25%);
}

:deep(.link-button) {
  font-size: variables.$font-size-s;
}
</style>
