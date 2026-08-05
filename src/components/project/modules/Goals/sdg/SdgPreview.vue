<script setup lang="ts">
import SdgList from '~/components/sdgs/SdgList.vue'

withDefaults(
  defineProps<{
    sdgs?: number[]
  }>(),
  {
    sdgs: () => [],
  }
)

// TODO change to better images
const SDG_LOGO_HEADER = 'https://sdgs.un.org/themes/custom/porto/assets/goals/global-goals.png' // usePublicURL('/sdgs/logo.png')
</script>

<template>
  <div class="sdg-preview">
    <div class="sdg-logo skeletons-background">
      <div class="img-container">
        <CroppedImage :src="SDG_LOGO_HEADER" :title="$t('complete-profile.sdgs.sdg-notice')" />
      </div>
    </div>
    <EmptyLabel v-if="sdgs.length === 0" />
    <SdgList
      class="sdg-preview-list"
      :sdgs="sdgs"
      logo="full"
      :to="{
        name: 'ProjectSearch',
        query: {
          section: 'projects',
        },
      }"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.sdg-preview {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.5rem;
  border-radius: 20px;
  height: 100%;
  min-height: 140px;

  @media screen and (max-width: variables.$min-tablet) {
    grid-template-rows: 1fr auto;
    grid-template-columns: unset;
  }
}
</style>

<style lang="scss">
@use '~/design/scss/variables';

.sdg-logo {
  width: 140px;
  height: 100%;
  display: flex;
  align-items: center;
  border: 1px solid var(--primary);
  border-radius: 20px;

  @media screen and (max-width: variables.$min-tablet) {
    width: 100%;
    height: 140px;
  }

  .img-container {
    margin: auto;
    width: 100%;
    height: 117px;
    padding: 0.5rem;

    @media screen and (max-width: variables.$min-tablet) {
      width: 140px;
    }
  }
}

.sdg-preview-list {
  .sdg--unselected {
    --size: 96px;

    width: var(--size) !important;
    height: var(--size) !important;
    transition: all 0.2s;
    border-radius: 99px;
    transform: skew(-10deg);

    &:not(:last-child) {
      margin-right: calc(var(--size) / 2 * -1);
    }

    &:hover {
      margin: 0;
      transform: skew(-10deg) scale(105%);
    }

    .cropped-image {
      border-radius: 10px;
    }
  }
}
</style>
