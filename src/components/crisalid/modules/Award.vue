<template>
  <div class="separator"></div>
  <div class="award">
    <div v-if="researcher" class="image-div">
      <CroppedApiImage
        :alt="`${researcher.user.given_name} ${researcher.user.family_name} image`"
        class="img-container skeletons-background"
        :picture-data="researcher.user.profile_picture"
        picture-size="medium"
        :default-picture="DEFAULT_USER_PATATOID"
      />
      <div class="text text-limit">
        <div class="name skeletons-text">
          {{ researcher.user.given_name }} {{ researcher.user.family_name }}
        </div>
      </div>
    </div>

    <h2 class="award-title skeletons-text">
      {{ award.$t.name }}
    </h2>
    <p class="skeletons-text">
      {{ award.$t.description }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { TranslatedAward, TranslatedResearcher } from 'shared-projects-frontend/models'

defineProps<{
  award: TranslatedAward
  researcher?: TranslatedResearcher
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
