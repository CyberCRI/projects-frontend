<template>
  <div>
    <CurrentTags :current-tags="model" @remove-tag="removeTag" />
  </div>
</template>

<script setup lang="ts">
import CurrentTags from '~/components/search/FilterTags/CurrentTags.vue'

const model = defineModel<any[]>({ default: [] })

const removeTag = (tag) => {
  model.value = model.value.filter((element) => element.id !== tag.id && element.name !== tag.name)
}
</script>
