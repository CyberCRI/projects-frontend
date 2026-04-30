<template>
  <div>
    <div v-if="loading" class="loader-ctn">
      <LoaderSimple />
    </div>
    <div v-else-if="displayableTags.length" class="suggested-tags-ctn">
      <div v-for="tag in displayableTags" :key="tag.id">
        <FilterValue
          v-if="tagTexts.title(tag)"
          :label="tagTexts.title(tag)"
          class="actionable suggested"
          @click="addTag(tag)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FilterValue from '~/components/search/Filters/FilterValue.vue'
import LoaderSimple from '~/components/base/loader/LoaderSimple.vue'

import useTagTexts from '~/composables/useTagTexts'
import type { TagModel } from '~/models/tag.model'

const props = withDefaults(
  defineProps<{
    // array of tag ids
    currentTags?: TagModel['id'][]
    // array of tag objects
    suggestedTags?: TagModel[]
    loading?: boolean
  }>(),
  {
    currentTags: () => [],
    suggestedTags: () => [],
    loading: false,
  }
)

const emit = defineEmits<{
  'add-tag': [TagModel]
}>()

const tagTexts = useTagTexts()
const displayableTags = computed(() => {
  return props.suggestedTags.filter((tag) => !props.currentTags.includes(tag.id))
})

const addTag = (tag) => emit('add-tag', tag)
</script>

<style lang="scss" scoped>
.suggested-tags-ctn {
  background: $primary-lighter;
  border-radius: $border-radius-xs;
  padding: $space-m;
  display: flex;
  flex-wrap: wrap;
  gap: $space-s;
}

.loader-ctn {
  padding: $space-m;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
