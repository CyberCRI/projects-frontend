<script setup>
import { computed } from 'vue'
import { isEscoClassification } from '@/functs/ClassificationUtils.ts'

defineProps({
  classification: {
    type: Object,
    required: true,
  },
})

const { locale } = useI18n()

const escoLink = computed(
  () => `https://esco.ec.europa.eu/${locale.value}/classification/skill_main`
)
</script>
<template>
  <p class="classification-description">
    {{ classification.description }}
    <span v-if="isEscoClassification(classification)">
      <a target="_blank" :href="escoLink">{{ $t('admin.classifications.esco-link') }}</a>
    </span>
  </p>
</template>
<style lang="scss" scoped>
.classification-description {
  a {
    color: $primary-dark;
    font-weight: 700;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
