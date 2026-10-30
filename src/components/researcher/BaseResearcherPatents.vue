<template>
  <div v-if="user.researcher" class="patent-list">
    <template v-for="patent in patents" :key="patent.id">
      <div class="separator"></div>
      <div class="patent-card">
        <h3 class="patent-title">{{ patent.title }}</h3>
        <div class="patent-description">{{ patent.description }}</div>
        <div v-if="patent.link" class="patent-link">
          <LinkButton :label="patent.link.label" btn-icon="" :to="patent.link.url" />
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

defineProps<{ user: TranslatedUserModel }>()

const patents = ref([
  {
    title: 'Système microfluidique pour l’observation de cellules uniques sur le long terme',
    description:
      'Permet d’étudier les dynamiques du vieillissement cellulaire en conditions contrôlées.',
    link: {
      label: 'Dépôt : Inserm / Learning Planet Institute – 2018',
      url: 'https://google.com',
    },
  },
  {
    title: 'Circuits génétiques de détection de la sénescence cellulaire',
    description:
      'Utilisés pour identifier et suivre les cellules vieillissantes ou soumises à un stress.',
    link: {
      label: 'Dépôt : Inserm / CNRS / Université Paris Cité – 2021',
      url: 'https://google.com',
    },
  },
])
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.patent-card {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;

  .patent-title {
    font-size: 1.2rem;
  }

  .patent-link {
    display: flex;
    justify-content: flex-start;
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

.patent-card ~ .separator {
  display: block;
}
</style>
