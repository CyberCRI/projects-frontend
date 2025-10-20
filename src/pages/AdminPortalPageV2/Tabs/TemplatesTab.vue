<template>
  <LayoutTab :title="t('template.list')" :notice="t('template.info')">
    <template #actions>
      <LinkButton
        btn-icon="Plus"
        :label="t('admin.portal.templates.add')"
        :to="{ name: 'templatesCreate' }"
      />
    </template>

    <FetchLoader :status="status" :with-data="!!data">
      <div class="list">
        <ul>
          <AdminList
            v-for="template in data?.results"
            :key="template.id"
            :label="template.name"
            :action-see="false"
            :action-add="false"
            :data-test="`template-list-${template.id}`"
            @edit="redirectEditTemplate(template)"
            @delete="setDeleted(template)"
          />
        </ul>
      </div>
      <ConfirmModal
        v-if="templateToDelete"
        :content="
          t('admin.portal.templates.delete-templates-description', {
            templateName: templateToDelete.name,
          })
        "
        :data-test="`template-modal-delete-${templateToDelete.id}`"
        :title="$t('admin.portal.templates.delete-templates')"
        @cancel="cancelDelete"
        @confirm="confirmDelete"
      />
    </FetchLoader>
  </LayoutTab>
</template>

<script setup>
import useNuxtI18n from '@/composables/useNuxtI18n'

import AdminList from '@/components/admin/AdminListItem.vue'
import ConfirmModal from '@/components/base/modal/ConfirmModal.vue'
import LayoutTab from '@/components/admin/LayoutTab.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { getTemplates, deleteTemplate } from '@/api/templates.service'

defineOptions({ name: 'TemplatesTab' })

const { t } = useNuxtI18n()
const organizationCode = useOrganizationCode()
console.log(organizationCode)
const { data, status, refresh } = getTemplates(organizationCode)

const router = useRouter()
const redirectEditTemplate = (template) =>
  router.push({ name: 'templatesEdit', params: { id: template.id } })

// link template to deleted
const templateToDelete = ref(null)
const setDeleted = (template) => (templateToDelete.value = template)
const cancelDelete = () => (templateToDelete.value = null)
const confirmDelete = () => {
  deleteTemplate(organizationCode, templateToDelete.value.id).then(() => refresh())
  templateToDelete.value = null
}
</script>

<style lang="scss" scoped>
.list {
  display: flex;
  flex-wrap: wrap;
  gap: $space-l;
  justify-content: stretch;

  ul {
    flex-grow: 1;
  }
}
</style>
