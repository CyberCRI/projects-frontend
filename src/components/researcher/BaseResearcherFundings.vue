<template>
  <div v-if="user.researcher" class="funding-list">
    <template v-for="funding in fundings" :key="funding.id">
      <div class="separator"></div>
      <div class="funding-card">
        <div class="funding-main">
          <h3 class="funding-title">{{ funding.title }}</h3>
          <div class="funding-description">{{ funding.description }}</div>
          <div class="funding-data">
            <span class="funding-datum">
              <IconImage name="Euro" class="icon" />
              <span>{{ funding.amount }}</span>
            </span>
            <span class="funding-datum">
              <IconImage name="Calendar" class="icon" />
              <span>{{ funding.date }}</span>
            </span>
          </div>
        </div>
        <div v-if="funding.researchers" class="funding-aside">
          <div class="funding-team">
            <div class="funding-team-head">
              <IconImage class="funding-team-icon" name="Link" />
              <span class="researcher-count">{{ funding.researchers }}</span>
            </div>
            <div class="funding-team-label">{{ $t('researcher.researchers') }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

defineProps<{ user: TranslatedUserModel }>()

const fundings = ref([
  {
    title: 'Projet PATTERN - Horizon Europe Grant',
    description: 'Promoting Open and Responsible Research and Innovation Practices (ORRI)',
    amount: '8.3M€',
    date: '2022-2029',
    researchers: 9,
    lab: null,
  },

  {
    title: 'ERC Consolidator Grant – “SynAge: Synthetic Biology of Aging”',
    description:
      'Financement européen soutenant un programme visant à recréer artificiellement les dynamiques du vieillissement cellulaire pour mieux les comprendre et les moduler.',
    amount: '8.3M€',
    date: '2022-2029',
    researchers: 12,
    lab: null,
  },

  {
    title: 'NIH–INSERM Collaborative Grant – “Engineering Robust Aging Models Across Species”',
    description:
      'Projet bilatéral franco-américain entre le Learning Planet Institute et plusieurs laboratoires du NIH, explorant comment des principes de biologie de synthèse peuvent être appliqués pour comparer les processus de vieillissement chez différentes espèces.',
    amount: '8.3M€',
    date: '2022-2029',
    researchers: 0,
    lab: null,
  },
])
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.funding-card {
  display: flex;
  gap: 1rem;

  .funding-main {
    display: flex;
    flex-flow: column nowrap;
    gap: 1rem;
    flex-grow: 1;
    flex-shrink: 1;
  }

  .funding-title {
    font-size: 1.2rem;
  }

  .funding-data {
    display: flex;
    gap: 2rem;
  }

  .funding-datum {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    font-weight: 500;
    gap: 0.6rem;

    .icon {
      width: 1em;
      height: 1em;
      fill: variables.$primary;
    }
  }

  .funding-aside {
    flex-basis: 6rem;
    flex-shrink: 0;
  }

  .funding-team {
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    background-color: variables.$lighter-gray;
    border: 1px solid variables.$mid-gray;
    padding: 1rem;
    border-radius: 4px;
    color: variables.$primary-dark;
  }

  .funding-team-head {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 1.4rem;

    .funding-team-icon {
      width: 1em;
      height: 1em;
      fill: variables.$primary;
    }
  }

  .funding-team-label {
    font-size: 0.8rem;
  }
}

.separator {
  margin-block: 1rem;
  display: none;
  background-color: variables.$light-gray;
  height: 1px;

  @media screen and (max-width: variables.$min-tablet) {
    margin-inline: 17%;
  }
}

.funding-card ~ .separator {
  display: block;
}
</style>
