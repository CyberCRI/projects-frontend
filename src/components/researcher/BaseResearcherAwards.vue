<template>
  <div v-if="user.researcher" class="awards-list">
    <template v-for="award in awards" :key="award.id">
      <div class="separator"></div>
      <div class="award">
        <h2 class="award-title">{{ award.year }} - {{ award.title }}</h2>
        <p>
          <span v-if="award.associates?.length" class="associates">
            With
            <span v-for="(associate, index) in award.associates" :key="index">
              <span v-if="index">and</span>
              <NuxtLink :to="associate.link" class="associate-link">{{ associate.name }}</NuxtLink>
            </span>
          </span>
          {{ award.title }}
        </p>
        <div v-if="award.project">
          <LinkedProjectRow :project="award.project" />
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

defineProps<{ user: TranslatedUserModel }>()

const { translateProject } = useAutoTranslate()

const awards = ref([
  {
    id: 1,
    year: '2022',
    title: 'Prix Inserm Innovation Biomédicale',
    associates: [{ name: 'Frédéric Taddéi', link: 'https://google.com' }],
    description:
      'French Institute of Health and Medical Research & Katrin Vohland - Naturhistorisches Museum Wien',
    project: null,
  },
  {
    id: 2,
    year: '2021',
    title: 'Bettencourt Schueller Foundation Grand Prize for Life Sciences',
    associates: [{ name: 'Valérie Gabelica', link: 'https://google.com' }],
    description: 'Reasearch Director at INSERM',
    project: translateProject({
      slug: 'internship-l3-vosges-structures-bois_-lorenz',
      purpose_nl: null,
      life_status: 'completed',
      purpose_ca: null,
      title:
        'INTERNSHIP L3 - VOSGES STRUCTURES BOIS_ LORENZO BERNARD LITTA MODIGNANI qergdfgdfgdsfgdsdfg s,k,,klo,l,,ol,ok,o,o,injnij',
      purpose_et: null,
      language: 'en',
      created_at: '2020-04-02T08:12:57+02:00',
      publication_status: 'public',
      categories: [
        {
          id: 139,
          slug: 'learning-planet-institute',
          name: 'Learning Planet Institute',
          background_color: '#EB3A3A',
          foreground_color: '#FFFFFF',
          organization: 'CRI',
          is_reviewable: true,
          is_followed: {
            is_followed: false,
            follow_id: null,
          },
        },
      ],
      title_ca: null,
      title_nl: null,
      header_image: {
        id: 2275,
        name: 'WifdEZyl_header_image.jpeg',
        url: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/42625777-3944-428f-aad5-af9b8d579eeeWifdEZyl_header_image.jpeg?se=2026-10-15T14%3A27%3A37Z&sp=r&sv=2026-02-06&sr=b&sig=3062vFWhfVaJtii0YTbIuTEJouca5IJ2VVu/eCddHGs%3D',
        height: 394,
        width: 512,
        natural_ratio: 1.299492385786802,
        scale_x: {
          source: '1.0',
          parsedValue: 1,
        },
        scale_y: {
          source: '1.0',
          parsedValue: 1,
        },
        left: -23.046875,
        top: {
          source: '0.0',
          parsedValue: 0,
        },
        created_at: '2022-05-09T06:50:01.829680+02:00',
        variations: {
          original:
            'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/42625777-3944-428f-aad5-af9b8d579eeeWifdEZyl_header_image.jpeg?se=2026-10-15T14%3A27%3A37Z&sp=r&sv=2026-02-06&sr=b&sig=3062vFWhfVaJtii0YTbIuTEJouca5IJ2VVu/eCddHGs%3D',
          full: 'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/42625777-3944-428f-aad5-af9b8d579eeeWifdEZyl_header_image.full.jpeg?se=2026-10-15T14%3A27%3A37Z&sp=r&sv=2026-02-06&sr=b&sig=kWBdpX7so%2BZpIUdrOLajJk5HxhVqIHsP5fps9hDT0FY%3D',
          large:
            'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/42625777-3944-428f-aad5-af9b8d579eeeWifdEZyl_header_image.large.jpeg?se=2026-10-15T14%3A27%3A37Z&sp=r&sv=2026-02-06&sr=b&sig=JDWzMaC8mRkz0quRBcGlWyQOn2i%2BkyrFxHJ4bkCihBk%3D',
          medium:
            'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/42625777-3944-428f-aad5-af9b8d579eeeWifdEZyl_header_image.medium.jpeg?se=2026-10-15T14%3A27%3A37Z&sp=r&sv=2026-02-06&sr=b&sig=6q1v91z7hON1ZdsQtpsQZQERSeF2MZ8c78fgbVMb5PE%3D',
          small:
            'https://criparisdevlabprojects.blob.core.windows.net/projects/project/header/42625777-3944-428f-aad5-af9b8d579eeeWifdEZyl_header_image.small.jpeg?se=2026-10-15T14%3A27%3A37Z&sp=r&sv=2026-02-06&sr=b&sig=svInX8ejM1BtDkUHt%2Bdh04TdSjlOsT8hcDXAiWXOi0Y%3D',
        },
      },
      title_es: null,
      title_fr:
        'STAGE L3 - VOSGES STRUCTURES BOIS_ LORENZO BERNARD LITTA MODIGNANI qergdfgdfgdsfgdsdfg s,k,,klo,l,ol,ok,o,o,injnij',
      title_de: null,
      purpose_en:
        "Bachelor's degree Business internship semester FdV. In charge of Technical-Commercial operations for a company called VSB in France.",
      id: 'WifdEZyl',
      purpose_es: null,
      updated_at: '2026-06-08T11:21:48.038933+02:00',
      sdgs: [9, 12, 15, 10, 16, 17, 5, 14],
      title_en:
        'INTERNSHIP L3 - VOSGES STRUCTURES BOIS_ LORENZO BERNARD LITTA MODIGNANI qergdfgdfgdsfgdsdfg s,k,,klo,l,,ol,ok,o,o,injnij',
      is_followed: {
        is_followed: false,
        follow_id: null,
      },
      title_et: null,
      purpose_fr:
        'Bachelier Stage en entreprise semestre FdV. En charge des opérations Technico-Commerciales pour la société VSB en France.',
      purpose:
        "Bachelor's degree Business internship semester FdV. In charge of Technical-Commercial operations for a company called VSB in France.",
      purpose_detected_language: 'en',
      title_detected_language: 'en',
      purpose_de: null,
    }),
  },
  {
    id: 3,
    year: '2019',
    title: 'Médaille d’argent du CNRS – Biologie moléculaire et cellulaire',
    associates: [{ name: 'Frédéric Taddéi', link: 'http://google.com' }],
    description: 'French Institute of Health and Medical Research',
    project: null,
  },
  {
    id: 4,
    year: '2018',
    title: 'European Award for Innovation in Synthetic Biology',
    associates: [{ name: 'Claire Dubois', link: 'https://google.com' }],
    description: 'Associate Professor in Synthetic Biology, Université Lyon 1',
    project: null,
  },
])
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
</style>
