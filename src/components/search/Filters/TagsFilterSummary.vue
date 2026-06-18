<template>
  <div>
    <CurrentTags :current-tags="model" @remove-tag="removeTag" />
    <EmptyLabel v-if="model.length === 0" />
  </div>
</template>

<script setup lang="ts">
import CurrentTags from '~/components/search/FilterTags/CurrentTags.vue'
import type { TagModel } from '~/models/tag.model'

const model = defineModel<TagModel[]>({ default: [] })

const removeTag = (tag) => {
  model.value = model.value.filter((element) => element.id !== tag.id)
}
</script>
