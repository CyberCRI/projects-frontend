<template>
  <div class="basic-card shadow-box" tabindex="1" :class="mode">
    <div class="action-left-wrapper">
      <slot name="actions-left" />
    </div>
    <div class="action-right-wrapper">
      <slot name="actions-right" />
    </div>

    <component
      :is="toLink ? 'NuxtLink' : 'div'"
      class="card-inner"
      :to="toLink"
      @click="$emit('click')"
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

<script>
import { NuxtLink } from '#components'
export default {
  name: 'BasicCard',

  components: {
    NuxtLink,
  },
  props: {
    toLink: {
      type: [String, Object],
      default: null,
    },
    mode: {
      type: String,
      default: 'card', // 'card' or 'list'
    },
  },

  emits: ['click'],
}
</script>

<style lang="scss" scoped>
.basic-card {
  display: flex;
  position: relative;
  background: $white;
  overflow: hidden;

  .card-inner {
    display: flex;
    flex-grow: 1;
  }

  &.card {
    flex-direction: column;
    justify-content: space-between;
    height: $card_height;
    width: $card_width;
    border: $border-width-s solid $primary;
    border-radius: $border-radius-m;
    text-align: center;

    .card-inner {
      flex-flow: column;
    }
  }

  &.list {
    flex-direction: row;
    border-bottom: $border-width-s solid #00dba7;

    .card-inner {
      flex-flow: row;
    }
  }
}

:deep(.picture) {
  $picture-width: 72px;

  display: flex;
  width: pxToRem($picture-width);
  height: pxToRem($picture-width);
  border-radius: $border-radius-xs;
  box-shadow: 0 0 2px rgb(0 0 0 / 15%);
  flex-shrink: 0;
}

.card {
  :deep(.picture-user) {
    $picture-width: 110px;

    width: pxToRem($picture-width);
    height: pxToRem($picture-width);
  }

  :deep(.picture-project) {
    $picture-width: 86px;

    width: pxToRem($picture-width);
    height: pxToRem($picture-width);
  }

  :deep(.picture-group) {
    border-radius: 50%;
    width: pxToRem(90px);
    height: pxToRem(90px);
  }
}

.list {
  :deep(.picture-user),
  :deep(.picture-project),
  :deep(.picture-group) {
    $picture-width: 80px;

    width: pxToRem($picture-width);
    height: pxToRem($picture-width);
  }

  :deep(.picture-group) {
    border-radius: 50%;
  }
}

:deep(.card-title) {
  margin-top: $space-s;
  font-weight: 700;
  font-size: $font-size-m;
  line-height: $line-height-compact;
  width: 100%;

  &::first-letter {
    text-transform: uppercase;
  }
}

:deep(.card-type) {
  font-weight: 700;
  font-size: $font-size-xs;
  text-transform: uppercase;
  color: $primary;
  margin-top: $space-s;
}

:deep(.content) {
  display: flex;
  cursor: pointer;
}

.card :deep(.content) {
  flex-direction: column;
  align-items: center;
  padding: $space-m $space-m 0 $space-m;
  height: 100%;
}

.list :deep(.content) {
  flex-direction: row;
  align-items: flex-start;
  padding: 0.75rem;
  gap: 1rem;
  flex-basis: 100%;
  flex-grow: 1;
}

:deep(.content--open) {
  align-items: start;
  text-align: start;
  display: block;
  word-break: break-word;
  overflow: hidden auto;
}

.card :deep(.text-limit) {
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

.list :deep(.text-limit) {
  display: block;
  text-align: left;
}

:deep(.description) {
  margin-top: $space-m;
  font-size: $font-size-s;
  width: 100%;
}

:deep(.card-description) {
  margin-top: $space-xs;
  font-size: $font-size-s;
}

:deep(.action-right-wrapper),
:deep(.action-left-wrapper) {
  position: absolute;
  top: 12px;
  display: flex;
  flex-flow: column nowrap;
  gap: $space-m;

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

:deep(.icon) {
  width: 24px;
  height: 24px;
  fill: $primary-dark;
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
  font-size: $font-size-s;
}
</style>
