<template>
  <SkeletonComponent v-if="loading" class="skeleton-block" height="42px" tag="h1" />
  <div v-else class="title-block">
    <LineClamped
      v-if="project && project.title"
      id="project-title"
      class="title"
      tag="h1"
      line-number="2"
      @overflow-state="showFullTitleIcon = $event"
    >
      {{ capitalizedTitle }}
    </LineClamped>
    <IconImage
      v-if="showFullTitleIcon"
      class="icon title-chevron"
      name="ChevronDown"
      @click="showFullTitle = !showFullTitle"
    />

    <div v-if="project && project.title && showFullTitle" class="full-title-block">
      <h1 v-if="project && project.title" class="full-title">
        {{ capitalizedTitle }}
      </h1>

      <IconImage
        class="icon icon-open title-chevron"
        name="ChevronUp"
        @click="showFullTitle = !showFullTitle"
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

const capitalizedTitle = computed(() => {
  const title = props.project?.$t?.title
  return capitalize(title)
})

const showFullTitle = ref(false)
const showFullTitleIcon = ref(false)
</script>
<style scoped lang="scss">
.title {
  font-weight: 700;
  font-size: $font-size-3xl;
  width: 100%;
  line-height: 1;
  border: 0 none;
  position: relative;
}

.full-title-block {
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

  .full-title {
    font-weight: 700;
    font-size: $font-size-xl;
    line-height: $line-height-tight;
  }
}

.title-block,
.purpose-block {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  position: relative;
}

.title-block {
  margin-top: pxToRem(16px);
}

@media screen and (min-width: $min-tablet) {
  .title-block {
    margin-top: 10px;
  }
}

@media screen and (max-width: $min-tablet) {
  .title-block,
  .purpose-block {
    margin-top: 0;
  }
}

// -----

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
}

.skeleton-block {
  margin-top: 12px;
}
</style>
