<template>
  <div v-if="user.researcher" class="position-list">
    <template v-for="position in positions" :key="position.id">
      <div class="separator"></div>
      <div class="position-card">
        <div class="position-head">
          {{ position.category }}
          -
          {{ formatDate(position.date) }}
        </div>
        <h3 class="position-title">
          {{ position.title }}
        </h3>
        <div class="position-content">{{ position.description }}</div>
        <div class="action">
          <LinkButton btn-icon="ArrowRight" :label="$t('researcher.view-job-offer')" />
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
const { locale } = useNuxtI18n()
defineProps<{ user: TranslatedUserModel }>()

const positions = ref([
  {
    id: 1,
    category: 'Post doctorant.e',
    date: new Date(),
    title: 'Postdoc position in cellular senescence, tissue repair and tumorigenesis',
    description:
      'Our lab (https://research.pasteur.fr/en/team/cellular-plasticity-in-age-related-pathologies/ ) explores how cellular senescence orchestrates tissue repair and regeneration. We focus on how senescent cells dynamically shape the microenvironment and how these processes can either promote regeneration or contribute to cancer, degenerative diseases, and aging.',
  },
  {
    id: 2,
    category: 'Post doctorant.e',
    date: new Date(),
    title: 'Postdoc position in cellular senescence, tissue repair and tumorigenesis',
    description:
      'Our lab (https://research.pasteur.fr/en/team/cellular-plasticity-in-age-related-pathologies/ ) explores how cellular senescence orchestrates tissue repair and regeneration. We focus on how senescent cells dynamically shape the microenvironment and how these processes can either promote regeneration or contribute to cancer, degenerative diseases, and aging.',
  },
])

const formatDate = (date) =>
  date.toLocaleDateString(locale.value, {
    dateStyle: 'short',
  })
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.position-card {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;

  .position-head {
    color: variables.$primary;
    text-transform: uppercase;
    font-weight: 500;
  }

  .position-title {
    font-weight: 700;
    font-size: 1.2rem;
  }
}

.separator {
  margin-block: 1rem;
  display: none;
  background-color: variables.$light-gray;
  height: 1px;
  margin-right: 66%;

  @media screen and (max-width: variables.$min-tablet) {
    margin-inline: 17%;
  }
}

.position-card ~ .separator {
  display: block;
}
</style>
