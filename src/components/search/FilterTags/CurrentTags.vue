<template>
  <div v-if="currentTags.length" class="current-tags-ctn">
    <template v-for="(tag, index) in currentTags">
      <span v-if="showSeparator && index > 0" :key="tag.id" class="skeletons-text">
        {{ $t('search.or') }}
      </span>
      <FilterValue
        v-if="tagTexts.title(tag)"
        :key="tag.id"
        :label="tagTexts.title(tag)"
        class="actionable"
        icon="Close"
        @click="removeTag(tag)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import FilterValue from '~/components/search/Filters/FilterValue.vue'

import type { TagModel } from 'shared-projects-frontend/models'
import useTagTexts from '~/composables/useTagTexts'

withDefaults(
  defineProps<{
    currentTags?: TagModel[]
    showSeparator?: boolean
  }>(),
  {
    currentTags: () => [],
    showSeparator: false,
  }
)

const emit = defineEmits<{
  'remove-tag': [TagModel]
}>()
const tagTexts = useTagTexts()
const removeTag = (tag) => emit('remove-tag', tag)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.current-tags-ctn {
  display: flex;
  flex-wrap: wrap;
  gap: variables.$space-s;
  align-items: center;
}

.clear-selection {
  text-transform: uppercase;
  color: variables.$primary-dark;
  margin-bottom: variables.pxtorem(24px);
  text-align: center;
  font-weight: 700;
  font-size: variables.$font-size-2xs;
  cursor: pointer;

  svg {
    height: variables.$layout-size-xs;
    fill: variables.$primary-dark;
    margin-right: variables.$space-s;
  }
}
</style>
