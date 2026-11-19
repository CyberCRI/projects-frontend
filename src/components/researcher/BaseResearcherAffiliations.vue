<template>
  <div v-if="user.researcher">
    <div class="affiliations">
      <div class="affiliation">
        <h2 class="title">
          <IconImage name="BookShelfLine" class="affiliation-icon" />
          {{ $t('researcher.affiliations.boards') }}
        </h2>
        <ul class="affiliations-list">
          <li v-for="affiliation in editorialBoards" :key="affiliation.id">
            <RouterLink :to="affiliation.link" class="affiliation-link">
              {{ affiliation.name }}
            </RouterLink>
            - {{ affiliation.role }}
          </li>
        </ul>
      </div>
      <div class="affiliation">
        <h2 class="title">
          <IconImage name="BookShelfLine" class="affiliation-icon" />
          {{ $t('researcher.affiliations.societies') }}
        </h2>
        <ul class="affiliations-list">
          <li v-for="affiliation in scientificSocieties" :key="affiliation.id">
            <RouterLink :to="affiliation.link" class="affiliation-link">
              {{ affiliation.name }}
            </RouterLink>
            - {{ affiliation.role }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

defineProps<{ user: TranslatedUserModel }>()

const editorialBoards = computed(() => [
  {
    id: 1,
    name: 'Synthetic Biology (Oxford Academic)',
    link: 'https://google.com',
    role: 'Membre du comité éditorial',
  },
  {
    id: 2,
    name: 'Frontiers in Aging',
    link: 'https://google.com',
    role: 'Associate Editor, section “Cellular and Molecular Mechanisms of Aging”',
  },
  {
    id: 3,
    name: 'PLOS Biology',
    link: 'https://google.com',
    role: 'Relecteur régulier et membre du board thématique “Quantitative Biology and Systems Approaches”',
  },
])

const scientificSocieties = computed(() => [
  {
    id: 4,
    name: 'Réseau international Global Community for Synthetic Biology (iGEM & Learning Planet Network)',
    link: 'https://google.com',
    role: 'Membre du comité de direction',
  },
  {
    id: 5,
    name: 'EMBO (European Molecular Biology Organization)',
    link: 'https://google.com',
    role: 'Membre',
  },
  {
    id: 6,
    name: 'Société Française de Biologie Cellulaire (SFBC)',
    link: 'https://google.com',
    role: 'Membre',
  },
])
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.affiliations {
  display: flex;
  flex-flow: column nowrap;
  gap: 2rem;
}

.affiliation {
  .title {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    display: inline-flex;
    gap: 0.6rem;

    .affiliation-icon {
      width: 1.2em;
      aspect-ratio: 1;
      fill: variables.$primary;
    }
  }
}

.affiliations-list {
  list-style: outside disc;
  padding: 1.2rem;

  ::marker {
    color: variables.$primary-dark;
  }

  li {
    margin-bottom: 1em;
  }

  .affiliation-link {
    color: variables.$primary-dark;
    font-weight: 600;
  }
}
</style>
