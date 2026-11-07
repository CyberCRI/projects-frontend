<template>
  <div v-if="user.researcher">RESEARCHER TEAM</div>
</template>
<script lang="ts" setup>
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

defineProps<{ user: TranslatedUserModel }>()
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';
</style>
