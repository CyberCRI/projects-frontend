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
import type { HarvesterType, Identifier } from '~/interfaces/researcher'

import { documentHarvesterToUrl, researcherHarvesterToUrl } from '~/functs/researcher'
import googlescholarIcon from '~/assets/svg/googlescholar.svg'
import openalexIcon from '~/assets/svg/openalex.svg'
import biorxivIcon from '~/assets/svg/biorxiv.svg'
import scopusIcon from '~/assets/svg/scopus.svg'
import irsteaIcon from '~/assets/svg/irstea.svg'
import scanrIcon from '~/assets/svg/scanr.svg'
import orcidIcon from '~/assets/svg/orcid.svg'
import idrefIcon from '~/assets/svg/idref.svg'
import arxivIcon from '~/assets/svg/arxiv.svg'
import viafIcon from '~/assets/svg/viaf.svg'
import pmidIcon from '~/assets/svg/pmid.svg'
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
  irstea: irsteaIcon,
  pmid: pmidIcon,
  pmcid: pmidIcon,
  biorxiv: biorxivIcon,
  arxiv: arxivIcon,
  viaf: viafIcon,
  googlescholar: googlescholarIcon,
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
.link-identifier {
  border: 1px gray;
  border-radius: 30px;
  padding: 0.2rem 0.4rem;
  transition: all 0.2s;
  background-color: $primary-light;
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
