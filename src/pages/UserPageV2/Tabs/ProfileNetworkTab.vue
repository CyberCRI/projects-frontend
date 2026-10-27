<script setup lang="ts">
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'

const props = withDefaults(defineProps<{ user: TranslatedUserModel; editable?: boolean }>(), {
  editable: false,
})
// TODO remove - keeping it to present unused props error
console.log(props.user.id, props.editable)

const universities = ref([
  {
    label: 'University Paris Cité (France)',
    notice: 'Long-standing collaboration through UMR1284 and the AIRE/FIRE programs.',
    link: 'https://google.com',
  },
  {
    label: 'Université PSL (France)',
    notice: 'Joint projects in synthetic biology and open scientific education.',
    link: 'https://google.com',
  },
  {
    label: 'Weizmann Institute of Science (Israel)',
    notice: 'Ongoing collaboration on cellular biology and aging dynamics.',
    link: 'https://google.com',
  },
  {
    label: 'University of Cambridge (UK)',
    notice: 'Shared work on quantitative approaches to cellular aging.',
    link: 'https://google.com',
  },
  {
    label: 'Harvard Medical School (USA)',
    notice: 'Collaboration on systems biology and cellular plasticity in aging.',
    link: 'https://google.com',
  },
])

const teams = ref([
  {
    label: 'UniLPI – Biology for Global Good Departmentversity Paris Cité (France)',
    notice: '',
    link: 'https://google.com',
  },
  {
    label: 'INSERM U1284 – Systems Engineering and Evolution Dynamics Unit',
    notice: '',
    link: 'https://google.com',
  },
  {
    label: 'Long-term mentoring and co-development of synthetic biology projects.',
    notice: 'Long-term mentoring and co-development of synthetic biology projects.',
    link: 'https://google.com',
  },
  {
    label: 'CNRS – Quantitative Biology Laboratory (UMR7238)',
    notice: 'Collaboration on regulatory networks and cellular dynamics.',
    link: 'https://google.com',
  },
  {
    label: 'Institut Curie – Aging and Genome Stability Group',
    notice: 'oint research on molecular mechanisms of cellular aging.',
    link: 'https://google.com',
  },
])

const collabs = ref([
  {
    label: 'François Taddei',
    notice:
      'Co-founder of the Learning Planet Institute, collaborations on scientific education and open science.',
    link: 'https://google.com',
  },
  {
    label: 'Miro Radman',
    notice: 'Postdoctoral mentor; co-author on DNA repair and aging mechanisms.',
    link: 'https://google.com',
  },
  {
    label: 'Sara Mitri (University of Lausanne)',
    notice: 'Joint work on cooperative evolution and cellular behaviors.',
    link: 'https://google.com',
  },
  {
    label: 'Giulia Biffi (University of Cambridge)',
    notice: 'Collaborations on senescence and DNA dynamics in aging cells.',
    link: 'https://google.com',
  },
  {
    label: 'James Collins (MIT)',
    notice: 'Collaborations within the synthetic biology and genetic circuit design community.',
    link: 'https://google.com',
  },
])
</script>

<template>
  <BaseModuleTab :title="$t('profile.bio')">
    <div class="network-map">
      <GeneralMap
        ref="map"
        class="map-recap"
        :locations="locations"
        :editable="isEdit"
        @edit="onEdit"
        @expand="onExpand"
      />
    </div>
    <div class="network-lists">
      <div>
        <NetworkList
          :list-title="'Top University Collaborations'"
          :list-notice="'(by number of joint projects or publications)'"
          :list-items="universities"
          list-more-link="/"
          :list-more-count="10"
        />
      </div>
      <div>
        <NetworkList
          :list-title="'Top Team Collaborations'"
          :list-notice="'(based on recurring interactions in ANR, Horizon Europe, iGEM and LPI projects)'"
          :list-items="teams"
          list-more-link="/"
          :list-more-count="10"
        />
      </div>
      <div>
        <NetworkList
          :list-title="'Top Researcher Collaborations'"
          :list-notice="'(by joint publications and European projects)'"
          :list-items="collabs"
          list-more-link="/"
          :list-more-count="10"
        />
      </div>
    </div>
  </BaseModuleTab>
</template>
<style lang="scss" scoped>
.network-lists {
  margin-top: 2rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
</style>
