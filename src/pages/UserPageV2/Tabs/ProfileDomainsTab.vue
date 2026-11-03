<script setup lang="ts">
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseSkill from '~/components/profile/modules/Skills/BaseSkill.vue'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import { USER_MODULE_TITLE } from '~/functs/constants'
import { BaseResearcherDomain } from '#components'

withDefaults(defineProps<{ user: TranslatedUserModel; editable?: boolean }>(), { editable: false })
</script>

<template>
  <BaseModuleTab :title="$t(USER_MODULE_TITLE.researchAreasSkills)" :count="user.modules.skills">
    <div v-if="user.researcher?.modules.domains" class="section">
      <h3 class="inter-title">{{ $t(USER_MODULE_TITLE.researchAreas) }}</h3>
      <BaseResearcherDomain :user="user" />
    </div>

    <div v-if="user.modules.skills" class="section">
      <h3 class="inter-title">{{ $t(USER_MODULE_TITLE.skills) }}</h3>
      <BaseSkill researcher-mode :user="user" :editable="editable" :limit="9" />
    </div>
  </BaseModuleTab>
</template>
<style lang="scss" scoped>
.section + .section {
  margin-top: 2rem;
}

.inter-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
</style>
