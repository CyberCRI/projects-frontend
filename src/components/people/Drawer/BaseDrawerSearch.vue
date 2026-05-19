<script setup lang="ts">
withDefaults(
  defineProps<{
    countResult?: number
    countSelected?: number
  }>(),
  {
    countResult: 0,
    countSelected: 0,
  }
)

const emit = defineEmits<{
  search: [string]
  'update:modelValue': [string]
}>()

const search = defineModel<string>({ default: '' })

const onEnter = () => {
  search.value = search.value.toString()
  emit('update:modelValue', search.value)
}
const onDelete = () => (search.value = '')
</script>

<template>
  <section>
    <slot v-if="countSelected" name="selected" />
    <SearchInput
      ref="search-input-ctn"
      v-model="search"
      :placeholder="$t('search.search')"
      full
      :debounce="500"
      @enter="onEnter"
      @delete-query="onDelete"
    />

    <div class="results">
      <slot v-if="countResult > 0" name="results" />
      <slot v-else name="empty">
        <EmptyLabel :label="$t('common.no-result')" />
      </slot>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.results {
  margin-top: 1rem;
}
</style>
