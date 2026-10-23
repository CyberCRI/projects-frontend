<template>
  <div v-if="user.researcher">
    <h3 class="similar-title">{{ $t('researcher.similar-profiles') }}</h3>
    <div class="similar-list">
      <SimilarResearcherCard
        v-for="(similar, index) in similarProfiles"
        :key="index"
        :user="similar"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

const props = defineProps<{ user: TranslatedUserModel }>()

const similarProfiles = computed(() => [props.user, props.user, props.user])
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.similar-title {
  font-weight: 700;
  font-size: 1.2rem;
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
