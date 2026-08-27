<script setup lang="ts">
import UserResearcherDocumentsList from '~/components/profile/modules/Documents/UserResearcherDocumentsList.vue'
import type { ResearcherDocumentType, TranslatedUserModel } from 'shared-projects-frontend/models'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import EmptyLabel from '~/components/base/EmptyLabel.vue'
import { USER_MODULE_TITLE } from '~/functs/constants'
import SvgWarning from '~/assets/svg/warning.svg'

const props = withDefaults(
  defineProps<{
    user: TranslatedUserModel
    documentType: ResearcherDocumentType
    editable?: boolean
  }>(),
  { editable: false }
)

const { t } = useNuxtI18n()
const notEditable = computed(() => t(`profile.edit.${props.documentType}.no-editable`))
</script>

<template>
  <BaseModuleTab
    :title="$t(USER_MODULE_TITLE[documentType], user.modules[documentType])"
    :count="user.modules[documentType]"
  >
    <!--
    documents editions not form projects
    need to add iframe to show sovisuplus
   -->
    <template v-if="!editable">
      <BaseModuleHeader :editable="editable" />

      <UserResearcherDocumentsList
        v-if="user.modules[documentType] > 0"
        :document-type="documentType"
        :user="user"
      />
      <EmptyLabel />
    </template>
    <template v-else>
      <div class="documents-warning">
        <SvgWarning class="inline-block p2" />
        {{ notEditable }}
      </div>
    </template>
  </BaseModuleTab>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.documents-warning {
  border-radius: 20px;
  padding: 1rem;
  margin-top: 1rem;
  background-color: variables.$yellow;
  color: rgb(0 0 0 / 80%);
  font-style: italic;

  svg {
    width: 20px;
    height: 20px;
  }
}
</style>
