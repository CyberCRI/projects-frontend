<template>
  <div v-if="group.structure">STRUCTURE TEAM</div>
</template>
<script lang="ts" setup>
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';
</style>
