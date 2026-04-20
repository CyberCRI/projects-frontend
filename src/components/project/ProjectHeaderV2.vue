<template>
  <div class="project-header-ctn">
    <ProjectStatus class="project-status" :project="project" />

    <div class="img-block">
      <ProjectHeaderImage class="img-ctn" :project="project" />
    </div>
    <div class="text-content">
      <ProjectHeaderTitle class="title-block" :project="project" />

      <ProjectHeaderTagList class="tag-list-bloc tag-list-desktop" :project="project" />

      <ProjectHeaderPurpose class="purpose-block" :project="project" />

      <ProjectHeaderVisibility class="visibility-ctn" :project="project" />

      <ProjectHeaderSdgList :project="project" class="sdg-ctn" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectStatus from '@/components/project/ProjectStatus.vue'
import { TranslatedProject } from '@/models/project.model'

defineProps<{
  project: TranslatedProject
}>()
</script>

<style lang="scss" scoped>
.project-header-ctn {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  gap: 1.25rem;

  @media screen and (min-width: $min-tablet) {
    border: $border-width-s solid $primary;
    border-radius: $border-radius-l;
    z-index: 1;
    padding: 2.5rem;
  }

  @media screen and (min-width: $max-tablet) {
    flex-flow: row nowrap;
    align-items: center;
    gap: 2.5rem;
  }
}

.img-block {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-basis: 260px;
  max-height: 260px;
  max-width: 260px;
  height: 100vh; /* hacky way to give some height - 100% doesnt - clamped by */
  width: 100%;
  align-self: center;
  position: relative;
}

.text-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 1;
  position: relative;
  gap: 1.25rem;

  @media screen and (max-width: $min-tablet) {
    .title-block {
      order: 1;
    }

    .purpose-block {
      order: 2;
    }

    .tag-list-bloc {
      order: 3;
    }

    .sdg-ctn {
      order: 4;
    }

    .visibility-ctn {
      order: 5;
    }
  }
}

.project-status {
  position: absolute;
  right: 0;
  top: 0;
  margin: 0.5rem;

  @media screen and (max-width: $min-tablet) {
    position: relative;
    margin: -0.5rem 0;
    width: fit-content;
    align-self: flex-end;
  }
}
</style>
