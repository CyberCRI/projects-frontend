<template>
  <div class="module shadowed-box2">
    <div class="module-header">
      <div class="title-container">
        <IconImage v-if="icon" :name="icon" class="icon skeletons-background" />
        <h2 class="title skeletons-text">
          {{ title }}
          <span v-if="!isNil(total)">({{ total }})</span>
        </h2>
      </div>
      <slot v-if="!loading" name="header">
        <BaseModuleButton
          v-if="seeMore && seeMorePosition === 'top'"
          class="bicolor see-more-button skeletons-text"
          :to="seeMore"
          :label="moreLabel"
          :btn-icon="moreIcon"
        />
      </slot>
    </div>
    <slot name="top-row" />
    <div class="module-container">
      <slot v-if="loading" name="skeleton" />
      <slot v-else name="content" />
    </div>
    <slot v-if="!loading" name="footer">
      <BaseModuleButton
        v-if="seeMore && seeMorePosition === 'bottom'"
        class="bicolor see-more-button skeletons-background"
        :to="seeMore"
        :label="moreLabel"
        :btn-icon="moreIcon"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
import IconImage from '~/components/base/media/IconImage.vue'

import type { IconImageChoice } from '~/functs/IconImage'
import type { RouteLocationRaw } from 'vue-router'
import { isNil } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    title: string
    total?: number
    seeMore?: RouteLocationRaw
    loading?: boolean
    icon?: IconImageChoice
    seeMorePosition?: 'bottom' | 'top'
    seeMoreLabel?: string | null
    seeMoreIcon?: IconImageChoice | null
  }>(),
  {
    loading: false,
    icon: null,
    total: null,
    seeMore: null,
    seeMorePosition: 'top',
    seeMoreLabel: undefined,
    seeMoreIcon: undefined,
  }
)

const { t } = useNuxtI18n()
const moreLabel = computed(() => props.seeMoreLabel || t('common.see-more'))
const moreIcon = computed(() => props.seeMoreIcon || 'ArrowRight')
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.module {
  display: grid;
  grid-template-rows: auto 1fr auto;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-transform: uppercase;
  flex-wrap: wrap;
}

.module-container {
  margin-top: 1rem;
}

.title-container {
  color: variables.$primary-dark;
  fill: variables.$primary-dark;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  .icon {
    display: inline-block;
    width: 1.6rem;
    height: 1.6rem;
    fill: variables.$primary;
  }

  .title {
    display: inline-block;
  }
}
</style>
