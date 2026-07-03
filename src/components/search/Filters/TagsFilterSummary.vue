<template>
  <div>
    <CurrentTags :current-tags="model" @remove-tag="removeTag" />
    <EmptyLabel v-if="model.length === 0" />
  </div>
</template>

<script setup lang="ts">
import type { TagModel } from 'shared-projects-frontend/models/tag.model'
import CurrentTags from '~/components/search/FilterTags/CurrentTags.vue'

const model = defineModel<TagModel[]>({ default: [] })

const removeTag = (tag) => {
  model.value = model.value.filter((element) => element.id !== tag.id)
}
</script>
