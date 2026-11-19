<template>
  <div class="separator"></div>
  <div class="award">
    <div v-if="contributor.researcher" class="image-div">
      <CroppedApiImage
        :alt="`${contributor.researcher.user.given_name} ${contributor.researcher.user.family_name} image`"
        class="img-container skeletons-background"
        :picture-data="contributor.researcher.user.profile_picture"
        picture-size="medium"
        :default-picture="DEFAULT_USER_PATATOID"
      />
      <div class="text text-limit">
        <div class="name skeletons-text">
          {{ contributor.researcher.user.given_name }} {{ contributor.researcher.user.family_name }}
        </div>
      </div>
    </div>
    <h2 class="award-title skeletons-text">
      <span v-if="contributor.date">{{ formatDate(contributor.date, locale) }} -</span>
      {{ award.$t.name }}
    </h2>
    <p class="skeletons-text">
      {{ contributor.$t.description || award.$t.description }}
    </p>
    <LinkButton
      v-if="contributor.link"
      :to="contributor.link"
      :label="$t('common.see-more')"
      btn-icon="ExternalLink"
      class="award-link skeletons-background"
      target="_blank"
    />
  </div>
</template>

<script lang="ts" setup>
import type { TranslatedAward, TranslatedResearcherAward } from 'shared-projects-frontend/models'
import { formatDate } from '~/functs/date'

const { locale } = useNuxtI18n()

defineProps<{
  award: TranslatedAward
  contributor: TranslatedResearcherAward
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

.img-container {
  border-radius: 50%;
  background-size: cover;
  background-position: top center;
  width: variables.pxtorem(48px);
  height: variables.pxtorem(48px);
  flex-shrink: 0;
}

.image-div {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
