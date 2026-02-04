<template>
  <SkeletonComponent v-if="loading" class="skeleton-block" height="24px" />
  <div v-else class="purpose-block">
    <LineClamped
      v-if="project && project.purpose && !showFullPurpose"
      id="project-purpose"
      class="purpose"
      tag="h4"
      line-number="3"
      @overflow-state="showFullPurposeIcon = $event"
    >
      {{ capitalizedPurpose }}
    </LineClamped>
    <IconImage
      v-if="showFullPurposeIcon"
      class="icon purpose-chevron"
      name="ChevronDown"
      @click="showFullPurpose = !showFullPurpose"
    />
    <div v-if="project && project.purpose && showFullPurpose" class="full-purpose-block">
      <h4 v-if="project && project.purpose" class="full-purpose">
        {{ capitalizedPurpose }}
      </h4>

      <IconImage
        class="icon icon--open purpose-chevron"
        name="ChevronUp"
        @click="showFullPurpose = !showFullPurpose"
      />
    </div>
  </div>
</template>
<script setup>
import { capitalize } from '@/functs/string'

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

const capitalizedPurpose = computed(() => {
  const purpose = props.project?.$t?.purpose
  return capitalize(purpose)
})

const showFullPurpose = ref(false)
const showFullPurposeIcon = ref(false)
</script>
<style scoped lang="scss">
.purpose-block {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  position: relative;
}

.full-purpose-block {
  position: absolute;
  top: 0;
  left: 0;
  background-color: $white;
  box-shadow: 0 0 6px rgb(0 0 0 / 15%);
  border-radius: 16px;
  padding: $space-m;
  min-height: 90%;
  display: flex;
  align-items: center;
  min-width: 100%;
  z-index: 1;
}

.purpose {
  font-weight: 400;
  font-size: $font-size-m;
  width: 100%;
  line-height: 1.1;
}

.full-purpose {
  font-weight: 400;
  font-size: $font-size-m;
}

.purpose-block {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  position: relative;
}

// --------
.icon {
  width: 24px;
  fill: $white;
  cursor: pointer;
  border: 1px solid $primary-dark;
  border-radius: 50%;
  background-color: $primary-dark;

  &--open {
    position: absolute;
    bottom: 8px;
    right: 8px;
  }

  &.title-chevron {
    margin-bottom: 10px;
  }

  &.purpose-chevron {
    margin-bottom: 3px;
  }

  .skeleton-block {
    margin-top: 12px;
  }
}
</style>
