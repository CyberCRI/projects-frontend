<template>
  <div class="separator"></div>
  <div class="award">
    <h2 class="award-title skeletons-text">
      <span v-if="award.date">{{ formatDate(award.date, locale) }} -</span>
      {{ award.award.$t.name }}
    </h2>
    <p class="skeletons-text">
      {{ award.$t.description || award.award.$t.description }}
    </p>
    <LinkButton
      v-if="award.link"
      :to="award.link"
      :label="$t('common.see-more')"
      btn-icon="ExternalLink"
      class="award-link skeletons-background"
      target="_blank"
    />
  </div>
</template>

<script lang="ts" setup>
import type { TranslatedResearcherAward } from 'shared-projects-frontend/models'
import { formatDate } from '~/functs/date'

const { locale } = useNuxtI18n()

defineProps<{
  award: TranslatedResearcherAward
}>()
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.associate-link {
  color: variables.$primary-dark;
  font-weight: 600;
}

.separator {
  margin-block: 1rem;
  display: none;
  background-color: variables.$light-gray;
  height: 1px;
}

.award-link {
  margin-top: 1rem;
  width: fit-content;
  justify-self: flex-start;
}

.award ~ .separator {
  display: block;
}
</style>
