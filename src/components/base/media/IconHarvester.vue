<template>
  <span :title="title ?? harvester">
    <component :is="ICONS[harvester]" class="icons" />
  </span>
</template>

<script setup lang="ts">
import halIcon from '@/assets/svg/hal.svg'
import doiIcon from '@/assets/svg/doi.svg'
import idrefIcon from '@/assets/svg/idref.svg'
import scopusIcon from '@/assets/svg/scopus.svg'
import orcidIcon from '@/assets/svg/orcid.svg'
import openalexIcon from '@/assets/svg/openalex.svg'
import scanrIcon from '@/assets/svg/scanr.svg'

const ICONS = {
  hal: halIcon,
  idref: idrefIcon,
  scopus: scopusIcon,
  orcid: orcidIcon,
  openalex: openalexIcon,
  scanr: scanrIcon,
  doi: doiIcon,
  local: null,
} as const

withDefaults(
  defineProps<{
    harvester: keyof typeof ICONS
    title?: string
    height?: string
  }>(),
  {
    title: null,
    height: '2rem',
  }
)
</script>

<style scoped>
.icons {
  height: v-bind(height);
  width: auto;
}
</style>
