<template>
  <div class="skill" :class="{ 'is-open': isOpen, 'no-description': !description?.length }">
    <div class="summary-content" @click="isOpen = !isOpen">
      <IconImage class="chevron" :name="isOpen ? 'Minus' : 'Plus'" />
      <span class="skill-title">{{ capitalize(label) }}</span>
      <SkillSteps :active-step="level" :steps="steps" class="steps" />
    </div>

    <transition name="open">
      <div v-show="isOpen" class="description">
        <p>{{ description }}</p>
      </div>
    </transition>
  </div>
</template>
<script setup>
import { capitalize } from '@/functs/string'

import SkillSteps from '@/components/people/skill/SkillSteps.vue'
import IconImage from '@/components/base/media/IconImage.vue'

defineOptions({ name: 'SkillItem' })
defineProps({
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  steps: {
    type: Number,
    default: 4,
  },
})
const isOpen = ref(false)
</script>
<style lang="scss" scoped>
.skill {
  width: 100%;

  &.no-description {
    pointer-events: none;
  }
}

.summary-content {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  cursor: pointer;
}

.chevron {
  flex-shrink: 0;
  width: 1rem;
  transform: scale(1.2) translate(-0.2rem, 0.1rem) rotate(-90deg);
  transition: transform 400ms ease-in-out;
  transform-origin: center;
}

.is-open .chevron {
  transform: scale(1.1) translate(-0.4rem, 0.2rem) rotate(0deg);
}

.skill-title {
  &::first-letter {
    text-transform: capitalize;
  }

  font-size: $font-size-m;
  font-weight: 400;
  color: $black;
}

.summary-content:hover {
  .chevron {
    fill: $primary-dark;
  }

  .skill-title {
    color: $primary-dark;
  }
}

.no-description .chevron {
  fill: $light-gray;
}

.steps {
  margin: unset;
  margin-left: auto;
  flex-grow: unset;
  padding: 0.35rem 1rem;
  align-self: center;
}

.description {
  font-size: $font-size-s;
  padding-left: 1rem;
  border-left: 1px solid $light-gray;
  align-self: flex-start;
}

.open-enter-active {
  transition: all 200ms ease-in-out;
  transform-origin: top;

  p {
    transition: all 200ms ease-in-out;
    transition-delay: 200ms;
  }
}

.open-leave-active {
  transition: all 200ms ease-in-out;
  transition-delay: 200ms;
  transform-origin: top;

  p {
    transition: all 200ms ease-in-out;
  }
}

.open-enter-from,
.open-leave-to {
  transform: translateZ(0) scaleY(0);

  p {
    opacity: 0;
  }
}

.open-enter-to,
.open-leave-from {
  transform: translateZ(0) scaleY(1);

  p {
    opacity: 1;
  }
}
</style>
