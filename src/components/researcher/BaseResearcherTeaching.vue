<template>
  <div v-if="user.researcher" class="teaching-list">
    <template v-for="teaching in teachings" :key="teaching.id">
      <div class="separator"></div>
      <div class="teaching">
        <h2 class="teaching-title">{{ teaching.title }}</h2>
        <div class="teaching-header">
          <span class="teaching-header-item">
            <IconImage name="SchoolOutline" class="teaching-header-icon" />
            <span class="teaching-header-label">{{ teaching.level }}</span>
          </span>
          <span class="teaching-header-item">
            <IconImage name="Article" class="teaching-header-icon" />
            <span class="teaching-header-label">{{ teaching.specialty }}</span>
          </span>
        </div>
        <p class="teaching-decription">
          {{ teaching.description }}
        </p>
        <div class="teaching-domains">
          <ResearcherDomain v-for="domain in teaching.domains" :key="domain.id" :domain="domain" />
        </div>
        <div class="teaching-footer">
          <LinkButton
            :to="teaching.syllabus"
            :label="$t('researcher.see-syllabus')"
            btn-icon="ExternalLink"
          />
          <LinkButton
            :to="teaching.similars.link"
            :label="$t('researcher.similar-teaching', { count: teaching.similars.count })"
            btn-icon="ArrowRight"
          />
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

defineProps<{ user: TranslatedUserModel }>()

const teachings = ref([
  {
    id: 1,
    title: 'Biologie de synthèse et ingénierie du vivant',
    level: 'Niveau : Bachelor – Year 3 (Licence 3)',
    specialty: 'Spécialisation: Biologie de synthèse et systèmes vivants complexes',
    description:
      'Ce cours explore les approches expérimentales et conceptuelles permettant de concevoir et reprogrammer des systèmes biologiques. Les étudiants apprennent à utiliser la biologie de synthèse pour répondre à des questions fondamentales en biologie cellulaire et en vieillissement.',
    domains: [
      { id: 2, label: 'SYSTEM BIOLOGY', progress: 1 },
      { id: 5, label: 'Neurodevelopmental Disorders (ND)', progress: 0.6 },
    ],
    syllabus: 'https://google.com',
    similars: { count: 4, link: 'https://google.com' },
  },
  {
    id: 2,
    title: 'Méthodes expérimentales pour l’étude du vieillissement cellulaire',
    level: 'Niveau : Bachelor – Year 3 (Licence 3)',
    specialty: 'Spécialisation: Biologie de synthèse et systèmes vivants complexes',
    description:
      'Ce cours aborde les approches multi-échelles utilisées pour comprendre les mécanismes du vieillissement, de la cellule unique aux réseaux de régulation. Une attention particulière est portée aux technologies de microfluidique et d’imagerie à haut débit.',
    domains: [
      { id: 3, label: 'SYNTHETIC BIOLOGY', progress: 1 },
      { id: 4, label: 'Autism Spectrum Disorders (ASD)', progress: 0.8 },
    ],
    syllabus: 'https://google.com',
    similars: { count: 2, link: 'https://google.com' },
  },
])
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';

.teaching {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
}

.teaching-title {
  font-size: 1.2rem;
}

.teaching-header,
.teaching-domains,
.teaching-footer {
  display: flex;
  gap: 1rem;
  align_items: center;
}

.teaching-header-item {
  display: inline-flex;
  gap: 0.8rem;
  align-items: center;
}
.teaching-header-icon {
  fill: variables.$primary;
  width: 1.2em;
  aspect-ratio: 1;
}

.separator {
  margin-block: 1rem;
  display: none;
  background-color: variables.$light-gray;
  height: 1px;
}

.teaching ~ .separator {
  display: block;
}
</style>
