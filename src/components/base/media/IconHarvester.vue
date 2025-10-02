<template>
  <span :title="title ?? harvester">
    <component :is="icons[harvester]" class="icons" />
  </span>
</template>

<script>
import halIcon from '@/assets/svg/hal.svg'
import idrefIcon from '@/assets/svg/idref.svg'
import scopusIcon from '@/assets/svg/scopus.svg'
import orcidIcon from '@/assets/svg/orcid.svg?raw'
import openalexIcon from '@/assets/svg/openalex.svg'
import scanrIcon from '@/assets/svg/scanr.svg'

const icons = {
  hal: halIcon,
  idref: idrefIcon,
  scopus: scopusIcon,
  orcid: orcidIcon,
  openalex: openalexIcon,
  scanr: scanrIcon,
  local: null,
}
</script>

<script setup>
defineOptions({
  name: 'IconHarvester',
})

const props = defineProps({
  harvester: {
    type: String,
    validator: (val) => Object.keys(icons).includes(val),
  },
  title: {
    type: String,
    default: null,
  },
  height: {
    type: String,
    default: '2rem',
  },
})
</script>

<style scoped>
.icons {
  height: v-bind(height);
  width: auto;
}
</style>
