<template>
  <a
    v-if="href"
    :href="href"
    :title="label"
    target="_blank"
    rel="referer,noopener"
    class="link-identifier skeletons-background"
  >
    <component :is="icon" v-if="icon" class="icons" :filled="true" />
    <IconImage v-else name="LinkRotated" class="icons" />
  </a>
</template>

<script setup lang="ts">
import type { HarvesterType, Identifier } from 'shared-projects-frontend/models'

import { documentHarvesterToUrl, researcherHarvesterToUrl } from '~/functs/researcher'
import openalexIcon from '~/assets/svg/openalex.svg'
import scopusIcon from '~/assets/svg/scopus.svg'
import scanrIcon from '~/assets/svg/scanr.svg'
import orcidIcon from '~/assets/svg/orcid.svg'
import idrefIcon from '~/assets/svg/idref.svg'
import viafIcon from '~/assets/svg/viaf.svg'
import halIcon from '~/assets/svg/hal.svg'
import doiIcon from '~/assets/svg/doi.svg'

const ICONS: Partial<Record<HarvesterType, string>> = {
  hal: halIcon,
  idhals: halIcon,
  idref: idrefIcon,
  scopus: scopusIcon,
  orcid: orcidIcon,
  openalex: openalexIcon,
  scanr: scanrIcon,
  doi: doiIcon,
  viaf: viafIcon,
} as const

const props = withDefaults(
  defineProps<{
    identifier: Identifier
    type: 'researcher' | 'document'
    height?: string
    title?: string
  }>(),
  {
    title: '',
    height: '1.3rem',
  }
)

const href = computed(() => {
  switch (props.type) {
    case 'document':
      return documentHarvesterToUrl(props.identifier)
    case 'researcher':
      return researcherHarvesterToUrl(props.identifier)
    default:
      return ''
  }
})

const icon = computed(() => ICONS[props.identifier.harvester])
const label = computed(() => props.title || `${$t('common.link-to')} ${props.identifier.harvester}`)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.link-identifier {
  border: 1px gray;
  border-radius: 30px;
  padding: 0.2rem 0.4rem;
  transition: all 0.2s;
  background-color: variables.$primary-light;
  transform: translateZ(0);

  &:hover {
    transform: translateZ(0) scale(102%);
  }
}

.icons {
  height: v-bind(height);
  width: auto;
}

.text-harvester {
  font-style: italic;
  opacity: 0.7;
}
</style>
