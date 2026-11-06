<template>
  <BaseModulePreview
    :title="$t(USER_MODULE_TITLE.similarResearchers)"
    :total="user.researcher.modules.similars"
  >
    <template #content>
      <BaseResearcherSimilar :user="user" preview :limit="3" @similars="openModal" />
      <BaseModuleButton
        btn-icon="ArrowRight"
        :label="$t('researcher.view.all')"
        @click="openModal"
      />
      <BaseDrawer
        :is-opened="stateModal"
        :title="$t(USER_MODULE_TITLE.similarResearchers)"
        @close="closeModal"
      >
        <BaseResearcherSimilar :user="user" />
      </BaseDrawer>
    </template>
  </BaseModulePreview>
</template>
<script lang="ts" setup>
import BaseModulePreview from '@/components/modules/BaseModulePreview.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { USER_MODULE_TITLE } from '~/functs/constants'

defineProps<{ user: TranslatedUserModel }>()

const { stateModal, closeModal, openModal } = useModal(false)
</script>
<style lang="scss" scoped>
@use '~/design/scss/variables';
</style>
