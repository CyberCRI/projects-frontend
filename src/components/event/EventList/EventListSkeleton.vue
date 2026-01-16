<template>
  <div class="event-list">
    <div class="monthly-section">
      <h3 class="month-title">
        <SkeletonComponent class="month-skeleton" width="30%" height="1rem" />
      </h3>
      <div class="events-wrapper">
        <EventItemSkeleton />
        <EventItemSkeleton />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import EventItemSkeleton from './EventItemSkeleton.vue'
import SkeletonComponent from '@/components/base/loader/SkeletonComponent.vue'
</script>
<style lang="scss" scoped>
.event-list {
  margin-bottom: 2rem;
}

.month-title {
  margin-bottom: $space-l;
  margin-top: $space-xl;
  text-transform: uppercase;
  color: $almost-black;
  text-align: center;
}

.events-wrapper {
  display: flex;
  flex-flow: column nowrap;
  gap: $space-l;
  padding: $space-m;
  border: $border-width-s solid $lighter-gray;
  border-radius: $border-radius-m;
}

.month-skeleton {
  margin-left: auto;
  margin-right: auto;
}
</style>
