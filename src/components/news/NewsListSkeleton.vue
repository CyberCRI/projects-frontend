<template>
  <div v-for="(item, index) in limit" :key="index" class="fake-news">
    <div v-if="projectNewsIndex.indexOf(index) >= 0" class="project-skeleton">
      <SkeletonComponent class="text-placeholder mobile" />
      <SkeletonComponent class="subtext-placeholder subtext mobile" />
      <SkeletonComponent class="image-placeholder" />
      <div class="news-content-placeholder flex-grow">
        <SkeletonComponent class="text-placeholder desktop" />
        <SkeletonComponent class="subtext-placeholder subtext desktop" />
        <SkeletonComponent class="text-placeholder" />
        <SkeletonComponent class="text-placeholder" />
        <SkeletonComponent class="subtext-placeholder subtext" />
        <SkeletonComponent class="read-placeholder" />
      </div>
    </div>
    <div v-else class="announcement-skeleton">
      <SkeletonComponent class="announcement-image-placeholder" />
      <div class="news-content-placeholder flex-grow">
        <SkeletonComponent class="text-placeholder announcement" />
        <SkeletonComponent class="subtext-placeholder subtext desktop" />
        <SkeletonComponent class="text-placeholder announcement" />
        <SkeletonComponent class="read-placeholder" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkeletonComponent from '@/components/base/loader/SkeletonComponent.vue'

defineOptions({ name: 'NewsListSkeleton' })

// number of skeletons to show
withDefaults(defineProps<{ limit?: number }>(), { limit: 15 })

// indices of skeleton that are projects (other are announcements)
const projectNewsIndex = [1, 2, 5, 6, 8, 9, 10, 13, 14]
</script>

<style lang="scss" scoped>
.fake-news {
  display: flex;
  flex-direction: column;
  border: $border-width-s solid $almost-white;
  border-radius: $border-radius-m;
  overflow: hidden;
  margin-bottom: $space-xl;
  padding: $space-l;

  @media screen and (min-width: $min-tablet) {
    flex-direction: row;
  }
}

.project-skeleton {
  display: flex;
  flex-direction: column;
  width: 100%;

  @media screen and (min-width: $min-tablet) {
    flex-direction: row;
  }
}

.announcement-skeleton {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.image-placeholder {
  width: 100%;
  height: pxToRem(200px);
  margin-bottom: $space-m;

  @media screen and (min-width: $min-tablet) {
    margin-right: $space-xl;
    margin-bottom: 0;
    width: 280px;
  }
}

.announcement-image-placeholder {
  width: pxToRem(120px);
  height: pxToRem(120px);
  border-radius: $border-radius-xs;
  margin-bottom: $space-m;
  margin-right: $space-m;

  @media screen and (min-width: $min-tablet) {
    margin-right: $space-xl;
  }
}

.text-placeholder {
  height: pxToRem(16px);
  margin-bottom: pxToRem(16px);

  &.mobile {
    @media screen and (min-width: $min-tablet) {
      display: none;
    }
  }

  &.desktop {
    display: none;

    @media screen and (min-width: $min-tablet) {
      display: block;
    }
  }
}

.subtext-placeholder {
  width: pxToRem(200px);
  height: pxToRem(16px);
  margin-bottom: pxToRem(16px);

  @media screen and (min-width: $min-tablet) {
    width: pxToRem(300px);
  }

  &.subtext {
    @media screen and (min-width: $min-tablet) {
      margin-bottom: $space-l;
    }
  }

  &.mobile {
    @media screen and (min-width: $min-tablet) {
      display: none;
    }
  }

  &.desktop {
    display: none;

    @media screen and (min-width: $min-tablet) {
      display: block;
    }
  }
}

.read-placeholder {
  width: pxToRem(50px);
  height: pxToRem(16px);
  margin-bottom: pxToRem(16px);
}

.flex-grow {
  flex-grow: 1;
}
</style>
