<script setup lang="ts">
import { computed } from 'vue'
import { isEscoClassification } from '@/functs/ClassificationUtils'
import { TagModel } from '@/models/tag.model'

defineProps<{
  classification: TagModel
}>()

const { locale } = useNuxtI18n()

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
