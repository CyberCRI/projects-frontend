<template>
  <div v-if="user.researcher" class="similar-researcher-preview">
    <h3 class="similar-title">{{ $t(USER_MODULE_TITLE.similarResearchers) }}</h3>
    <div class="similar-list">
      <SimilarResearcherCard
        v-for="(similar, index) in similarProfiles"
        :key="index"
        :user="similar"
      />
    </div>
    <BaseModuleButton :to="'/'" btn-icon="ArrowRight" :label="$t('researcher.view.all')" />
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

import { USER_MODULE_TITLE } from '~/functs/constants'

const props = defineProps<{ user: TranslatedUserModel }>()

const similarProfiles = computed(() => [props.user, props.user, props.user])
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.similar-researcher-preview {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
  justify-content: center;
}

.similar-title {
  font-weight: 700;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1rem;
  color: variables.$primary-dark;
}

.similar-list {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
}
</style>
