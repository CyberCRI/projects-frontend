<script setup lang="ts">
import ProjectTabItem from '~/components/project/modules/Additionals/ProjectTabItem.vue'
import type { ProjectTabForm, TranslatedProjectTab } from '~/models/projects-tabs.model'
import { deleteProjectTab, updateProjectTab } from '~/api/project-tabs.service'
import { refreshProjectTabs } from '~/composables/project/refreshProject'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { getAllProjectTabItem } from '~/api/v2/project-tabs.service'
import type { TranslatedProject } from '@/models/project.model'
import LpiButton from '~/components/base/button/LpiButton.vue'
import FetchLoader from '~/components/base/FetchLoader.vue'
import TabForm from '~/components/tabs/TabForm.vue'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    tab: TranslatedProjectTab
    editable?: boolean
    preview?: boolean
    limit?: number
  }>(),
  { editable: false, preview: false, limit: null }
)

const { t } = useNuxtI18n()
const toaster = useToaster()
const router = useRouter()

const { stateModals, openModals, toggleModals, closeModals } = useModals({
  edit: false,
  delete: false,
})
const asyncing = ref(false)
const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)
const tabId = computed(() => props.tab.id)

const { status, error, data, pagination } = getAllProjectTabItem(
  organizationCode,
  projectId,
  tabId,
  {
    paginationConfig: {
      limit: props.limit,
    },
  }
)

const onSubmit = (form: ProjectTabForm) => {
  asyncing.value = true
  updateProjectTab(props.project.id, props.tab.id, form)
    .then(() => {
      refreshProjectTabs(props.project)
      toaster.pushSuccess(t(`tab.toast.update.success`))
    })
    .catch(() => toaster.pushError(t(`tab.toast.update.error`)))
    .finally(() => (asyncing.value = false))
}

const onDelete = () => {
  asyncing.value = true
  deleteProjectTab(props.project.id, props.tab.id)
    .then(() => {
      toaster.pushSuccess(t(`tab.toast.delete.success`))
      refreshProjectTabs(props.project).then(() => {
        router.push({
          name: 'ProjectSnapshot',
          params: {
            slugOrId: props.project.slug || props.project.id,
          },
        })
      })
    })
    .catch(() => toaster.pushError(t(`tab.toast.delete.error`)))
    .finally(() => (asyncing.value = false))
}
</script>

<template>
  <FetchLoader :status="status" :error="error">
    <BaseModuleHeader
      v-if="!preview"
      :editable="false"
      :add-label="$t('common.edit')"
      @add="openModals('edit')"
    >
      <LpiButton
        v-if="editable"
        class="w-fit"
        :btn-icon="stateModals.edit ? 'ChevronUp' : 'ChevronDown'"
        :label="$t('tab.edit')"
        @click="toggleModals('edit')"
      />
    </BaseModuleHeader>

    <ContentExpandable
      v-if="editable"
      key="description-editable"
      :height-limit="0"
      :opened="stateModals.edit"
      hide-see-more
    >
      <TabForm
        class="p2"
        :project="project"
        :tab="tab"
        @submit="onSubmit"
        @close="closeModals('edit')"
      >
        <template #footer>
          <LpiButton
            class="w-fit"
            btn-icon="TrashCanOutline"
            :label="$t('tab.delete')"
            @click="closeModals('delete')"
          />
        </template>
      </TabForm>
      <!-- this is only for form expandable -->
      <div style="height: 100px" />
    </ContentExpandable>
    <div v-else class="description-info">
      <ContentExpandable key="description" :description="tab.$t.description" :height-limit="300" />
    </div>

    <div class="list-container">
      <ProjectTabItem
        v-for="item in data"
        :key="item.id"
        :project="project"
        :tab="tab"
        :item="item"
        :editable="editable"
      />
      <NothingHere v-if="data.length === 0" />
    </div>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>

  <!-- drawer/modal -->
  <ConfirmModal
    v-if="stateModals.delete"
    :title="$t('project.blog-entry-confirm-delete')"
    :asyncing="asyncing"
    @cancel="closeModals('delete')"
    @confirm="onDelete"
  >
    <ProjectTabItem
      v-for="item in data"
      :key="item.id"
      :project="project"
      :tab="tab"
      :item="item"
    />
  </ConfirmModal>
</template>

<style lang="scss" scoped>
.description-info {
  padding: 1rem;
  border-radius: 4px;
  border: 2px solid var(--primary-dark);
  background-color: color-mix(in srgb, var(--primary-dark), transparent 95%);
}
</style>
