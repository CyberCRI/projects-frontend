<template>
  <div class="filter-members-summary">
    <FilterValue
      v-for="(member, index) in selection"
      :key="member.id"
      :label="member.name.fullname"
      icon="Close"
      class="actionable"
      @click="removeFilter(index)"
    />
  </div>
</template>

<script setup lang="ts">
import FilterValue from '@/components/search/Filters/FilterValue.vue'

const props = defineProps<{
  modelValue: any[]
}>()

const emit = defineEmits<{
  'update:model-value': [any[]]
}>()

const selection = ref([])

watch(
  () => props.modelValue,
  (neo, old) => {
    if (neo && neo != old) {
      selection.value = [...neo]
    }
  },
  {
    immediate: true,
    deep: true,
  }
)

onMounted(() => {
  selection.value = [...props.modelValue]
})

const removeFilter = (index) => {
  const newSelection = [...selection.value]
  newSelection.splice(index, 1)
  selection.value = newSelection
  emit('update:model-value', newSelection)
}
</script>

<style scoped lang="scss">
.filter-members-summary {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2xs;
}
</style>
