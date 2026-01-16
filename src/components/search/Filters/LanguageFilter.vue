<template>
  <div class="language-filter">
    <LpiCheckbox
      v-for="(language, index) in languages"
      :key="index"
      v-model="language.selected"
      class="as-button min-width"
      :label="$t('language.label-' + language.label)"
    />
  </div>
</template>

<script setup lang="ts">
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'
import useOrganizationsStore from '@/stores/useOrganizations'

const props = defineProps<{
  modelValue: string[]
}>()

const emits = defineEmits<{
  'update:modelValue': [string[]]
}>()
const organizationsStore = useOrganizationsStore()
const languages = ref(
  organizationsStore.languages.map((lang) => ({
    label: lang,
    selected: props.modelValue.some((l) => l == lang),
  }))
)

watch(
  languages,
  (neo) => {
    emits(
      'update:modelValue',
      neo.filter((lang) => lang.selected).map((lang) => lang.label)
    )
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
.language-filter {
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  gap: 1rem;
}
</style>
