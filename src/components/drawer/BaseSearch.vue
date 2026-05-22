<script setup lang="ts">
import NothingHere from '~/components/base/NothingHere.vue'

withDefaults(
  defineProps<{
    countResult?: number
    countSelected?: number
    selectedAll?: boolean
  }>(),
  {
    countResult: 0,
    countSelected: 0,
    selectedAll: false,
  }
)

const emit = defineEmits<{
  search: [string]
  'select-clear': []
  'select-all': []
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
    <div v-if="countSelected">
      <LpiButton btn-icon="Eraser" :label="$t('common.clear')" @click="emit('select-clear')" />
      <slot name="selected" />
    </div>

    <div class="search-container">
      <SearchInput
        ref="search-input-ctn"
        v-model="search"
        :placeholder="$t('search.search')"
        full
        :debounce="500"
        @enter="onEnter"
        @delete-query="onDelete"
      />
      <LpiButton
        v-if="selectedAll && countResult > 0"
        btn-icon="CheckDouble"
        :secondary="true"
        :label="$t('common.select-all')"
        @click="emit('select-all')"
      />
    </div>

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

.search-container {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 0.5rem;
}
</style>
