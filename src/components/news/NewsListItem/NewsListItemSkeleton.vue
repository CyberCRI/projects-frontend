<template>
  <div class="news-list-item">
    <div class="news-img-ctn">
      <SkeletonComponent width="100%" height="100%" />
    </div>
    <div class="news-texts">
      <div class="news-title-ctn">
        <SkeletonComponent tag="h3" height="24px" width="100%" />
      </div>
      <div class="news-excerpt">
        <SkeletonComponent class="text-skeleton" tag="p" height="16px" width="100%" />
        <SkeletonComponent class="text-skeleton" tag="p" height="16px" width="100%" />
        <SkeletonComponent class="text-skeleton" tag="p" height="16px" width="100%" />
      </div>
      <div class="read-more-ctn">
        <SkeletonComponent class="text-skeleton" tag="p" height="16px" width="60px" />
      </div>
    </div>
  </div>
</template>
<script setup>
import SkeletonComponent from '@/components/base/loader/SkeletonComponent.vue'

defineOptions({ name: 'NewsListItemSkeleton' })
</script>
<style scoped lang="scss">
.news-list-item {
  --news-dimension: 13rem;
  --picture-ratio: calc(4 / 3);

  display: flex;
  gap: 1rem;
  height: calc(var(--news-dimension) + 3rem);
  overflow: hidden;
  padding: 1rem;
  border: $border-width-s solid $lighter-gray;
  border-radius: 1rem;
}

.news-img-ctn {
  flex-basis: calc(var(--news-dimension) * var(--picture-ratio, 1));
  height: var(--news-dimension);
  flex-shrink: 0;
}

.news-texts {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1rem;
}

.news-title-ctn {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.news-excerpt {
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-flow: column;
}

.read-more-ctn {
  flex-shrink: 0;
  padding: 1rem 0;
}

.text-skeleton {
  margin-bottom: 1rem;
}
</style>
