<template>
  <button
    :class="[{ secondary, 'no-border': noBorder }, actionIcon]"
    type="button"
    class="context-action-button"
    :disabled="disabled"
  >
    <span class="icon-wrapper">
      <IconImage :name="actionIcon" class="action-icon" />
    </span>

    <span v-if="actionLabel" class="action-label">{{ actionLabel }}</span>
  </button>
</template>

<script setup lang="ts">
import { IconImageChoice } from '@/functs/IconImage'
import IconImage from '@/components/base/media/IconImage.vue'

withDefaults(
  defineProps<{
    actionIcon: IconImageChoice
    secondary?: boolean
    noBorder?: boolean
    actionLabel?: string
    disabled?: boolean
  }>(),
  {
    secondary: false,
    noBorder: false,
    actionLabel: '',
    disabled: false,
  }
)
</script>

<style lang="scss" scoped>
.context-action-button {
  --context-action-button-size: 2rem;

  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: $font-size-m;
  transition: 0.15s all ease-in-out;
  cursor: pointer;
  will-change: transform;
  padding: 0;
  border: none;
  box-sizing: border-box;
  width: max-content;
  background: transparent;
  gap: 0.5rem;
  appearance: none;
  border-radius: 50%;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;

    .action-icon {
      animation: none !important;
    }
  }

  .action-label {
    color: $primary-dark;
  }

  .icon-wrapper {
    width: var(--context-action-button-size);
    height: var(--context-action-button-size);
    background: $primary-dark;
    color: $white;
    border-radius: 50%;
    position: relative;
  }

  &.extra-small {
    --context-action-button-size: 1rem;
  }

  &.small {
    --context-action-button-size: 1.5rem;
  }

  &.secondary .icon-wrapper {
    background: $white;
    color: $primary-dark;
    fill: $primary-dark;
    border: $border-width-s solid $primary-dark;
  }

  &.no-border .icon-wrapper {
    border: none !important;
  }

  &.Pen:hover {
    .action-icon {
      animation: rotate-pen 0.5s ease-in-out infinite;
      transform-origin: bottom left;
    }
  }

  &.Close:hover {
    .action-icon {
      animation: rotate-close 1.2s ease-in-out infinite;
      transform-origin: center center;
    }
  }

  &.DotsHorizontal:hover {
    .action-icon {
      animation: horizontal-squeeze 0.8s ease-in-out infinite;
      transform-origin: center center;
    }
  }

  &.Eye:hover {
    .action-icon {
      animation: open-eye 1s ease-in-out infinite;
      transform-origin: center center;
    }
  }

  &.Plus:hover {
    .action-icon {
      animation: scale-plus 1s ease-in-out infinite;
      transform-origin: bottom center;
    }
  }

  &.TrashCanOutline:hover {
    .action-icon {
      animation: trash-anim 1.2s ease-in-out infinite;
      transform-origin: bottom center;
    }
  }
}

.action-label {
  padding-right: 0.5rem;
}

.context-action-button :deep(svg) {
  transition: 0.15s fill ease-in-out;
  fill: $white;
  position: absolute;
  inset: 12%;
}

.context-action-button.secondary :deep(svg) {
  fill: $primary-dark;
}

@keyframes open-eye {
  0% {
    transform: translateZ(0) scaleY(1);
  }

  20% {
    transform: translateZ(0) scaleY(0.5);
  }

  65% {
    transform: translateZ(0) scaleY(1.3);
  }

  100% {
    transform: translateZ(0) scaleY(1);
  }
}

@keyframes scale-plus {
  0% {
    transform: translateZ(0) scale(1, 1);
  }

  30% {
    transform: translateZ(0) scale(1.3, 1);
  }

  60% {
    transform: translateZ(0) scale(1, 1.3);
  }

  90% {
    transform: translateZ(0) scale(1, 1);
  }
}

@keyframes rotate-pen {
  0% {
    transform: translateZ(0) rotate(0deg);
  }

  25% {
    transform: translateZ(0) rotate(10deg);
  }

  75% {
    transform: translateZ(0) rotate(-10deg);
  }

  100% {
    transform: translateZ(0) rotate(0deg);
  }
}

@keyframes rotate-close {
  0% {
    transform: translateZ(0) rotate(0deg);
  }

  25% {
    transform: translateZ(0) rotate(90deg);
  }

  75% {
    transform: translateZ(0) rotate(-90deg);
  }

  100% {
    transform: translateZ(0) rotate(0deg);
  }
}

@keyframes horizontal-squeeze {
  0% {
    transform: translateZ(0) scaleX(1);
  }

  50% {
    transform: translateZ(0) scaleX(1.4);
  }

  100% {
    transform: translateZ(0) scaleX(1);
  }
}

@keyframes trash-anim {
  0% {
    transform: translateZ(0) scaleY(1);
  }

  20% {
    transform: translateZ(0) scaleY(0.3);
  }

  40% {
    transform: translateZ(0) scaleY(1.3);
  }

  60% {
    transform: translateZ(0) scaleY(0.8);
  }

  80% {
    transform: translateZ(0) scaleY(1.15);
  }

  100% {
    transform: translateZ(0) scaleY(1);
  }
}
</style>
