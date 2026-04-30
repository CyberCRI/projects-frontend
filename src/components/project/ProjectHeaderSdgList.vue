<template>
  <div v-show="project.sdgs.length" class="sdg-ctn">
    <TransitionGroup name="sdg" class="sdg-list" tag="div">
      <SdgList
        key="sdg"
        :sdgs="project.sdgs || []"
        :to="{
          name: 'ProjectSearch',
          query: {
            section: 'projects',
          },
        }"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { TranslatedProject } from '@/models/project.model'

defineProps<{
  project: TranslatedProject
}>()
</script>

<style scoped lang="scss">
$sdg-size: pxToRem(38px);

.sdg-link {
  width: $sdg-size;
  height: $sdg-size;
  display: inline-block;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateZ(0) scale(1.2);
  }
}

.sdg {
  width: 100%;
  height: 100%;
}

.sdg-list {
  display: flex;
  flex-wrap: wrap;
  gap: $space-xs;
  row-gap: $space-m;
}

.sdg-enter-active,
.sdg-leave-active {
  transition: transform 0.4s ease;
  transform-origin: center center;
  transform: translateZ(0) scale(1) translateY(0);
}

.sdg-enter-from,
.sdg-leave-to {
  transform: translateZ(0) scale(0) translateY(200%);
}
</style>
