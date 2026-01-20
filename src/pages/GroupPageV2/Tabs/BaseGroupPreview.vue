<template>
  <div class="group shadowed-box">
    <div class="group-header">
      <div class="title-container">
        <IconImage v-if="icon" :name="icon" class="icon" />
        <h2 class="title">
          {{ title }}
          <span v-if="!isNil(total)">( {{ total }} )</span>
        </h2>
      </div>
      <SeeMoreArrow v-if="!loading && seeMore" class="see-more-button" :to="seeMore" />
    </div>

    <div class="group-container">
      <slot v-if="loading" name="skeleton" />
      <slot v-else name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import IconImage from '@/components/base/media/IconImage.vue'
import { IconImageChoice } from '@/functs/IconImage'
import { isNil } from 'es-toolkit'

withDefaults(
  defineProps<{
    title: string
    total?: number
    seeMore?: any
    loading?: boolean
    icon?: IconImageChoice
  }>(),
  { loading: false, icon: null, total: null, seeMore: null }
)
</script>

<style lang="scss" scoped>
.group {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: uppercase;
}

.group-container {
  margin-top: 2rem;
}

.title-container {
  color: $primary-dark;
  fill: $primary-dark;
  display: flex;
  align-items: center;

  .icon {
    display: inline-block;
    width: 1.5rem;
    margin: 0 0.3rem;
  }

  .title {
    display: inline-block;
  }
}
</style>
