<script setup lang="ts">
import NothingHere from '~/components/base/NothingHere.vue'

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
      <div v-if="countResult > 0">
        <Field :label="`${$t('search.results')} :`">
          <slot name="results" />
        </Field>
      </div>
      <slot v-else name="empty">
        <NothingHere class="opacity-80" :label="$t('search.empty')" />
      </slot>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.results {
  margin-top: 1rem;
}
</style>
