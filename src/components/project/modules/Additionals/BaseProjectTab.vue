<script setup lang="ts">
import type {
  ProjectTabForm,
  TranslatedProjectTab,
  TranslatedProjectTabItem,
} from '~/models/projects-tabs.model'
import {
  deleteProjectTab,
  deleteProjectTabItem,
  updateProjectTab,
} from '~/api/project-tabs.service'
import AdditionalsDrawer from '~/components/project/modules/Additionals/AdditionalsDrawer.vue'
import ProjectTabItem from '~/components/project/modules/Additionals/ProjectTabItem.vue'
import { projectTabItemSkeleton } from '~/skeletons/project-tabs.skeletons'
import { refreshProjectTabs } from '~/composables/project/refreshProject'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { getAllProjectTabItem } from '~/api/v2/project-tabs.service'
import type { TranslatedProject } from '@/models/project.model'
import LpiButton from '~/components/base/button/LpiButton.vue'
import { factoryPagination } from '~/skeletons/base.skeletons'
import FetchLoader from '~/components/base/FetchLoader.vue'
import TabForm from '~/components/tabs/TabForm.vue'
import analytics from '~/analytics'

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

const selectedItem = ref<TranslatedProjectTabItem>()

const { stateModals, openModals, closeModals, closeAllModals } = useModals({
  editTab: false,
  deleteTab: false,
  deleteItem: false,
  addItem: false,
  editItem: false,
})
const asyncing = ref(false)
const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)
const tabId = computed(() => props.tab.id)

const { status, error, data, pagination, refresh } = getAllProjectTabItem(
  organizationCode,
  projectId,
  tabId,
  {
    paginationConfig: {
      limit: props.limit,
    },
    default: () => factoryPagination(projectTabItemSkeleton, props.tab.modules.items),
  }
)

const clean = () => {
  selectedItem.value = null
  closeAllModals()
  asyncing.value = false
}

const refreshAll = () => refreshProjectTabs(props.project).then(() => refresh())

const onDelete = (item: TranslatedProjectTabItem) => {
  selectedItem.value = item
  openModals('deleteItem')
}
const onEdit = (item: TranslatedProjectTabItem) => {
  selectedItem.value = item
  openModals('editItem')
}

const onPatchTab = (form: ProjectTabForm) => {
  asyncing.value = true
  updateProjectTab(props.project.id, props.tab.id, form)
    .then(() => {
      analytics.track('update_project_tab', {
        project: props.project.id,
        tab: props.tab.id,
      })
      refreshProjectTabs(props.project)
      toaster.pushSuccess(t(`tab.toasts.tab-update.success`))
    })
    .catch(() => toaster.pushError(t(`tab.toasts.tab-update.error`)))
    .finally(() => {
      clean()
      openModals('editTab')
    })
}

const onConfirmDeleteTab = () => {
  asyncing.value = true
  deleteProjectTab(props.project.id, props.tab.id)
    .then(() => {
      analytics.track('delete_project_tab', {
        project: props.project.id,
        tab: props.tab.id,
      })

      return refreshAll().then(() => {
        toaster.pushSuccess(t(`tab.toasts.tab-delete.success`))
        refreshProjectTabs(props.project).then(() => {
          router.push({
            name: 'ProjectSnapshot',
            params: {
              slugOrId: props.project.slug || props.project.id,
            },
          })
        })
      })
    })
    .catch(() => toaster.pushError(t(`tab.toasts.tab-delete.error`)))
    .finally(() => clean())
}

const onConfirmDeleteTabItem = () => {
  asyncing.value = true
  deleteProjectTabItem(props.project.id, props.tab.id, selectedItem.value.id)
    .then(() => {
      analytics.track('delete_project_tab_item_image', {
        project: props.project.id,
        tab: props.tab.id,
        item: selectedItem.value.id,
      })
      refreshAll()
      toaster.pushSuccess(t(`tab.toasts.item-delete.success`))
    })
    .catch(() => toaster.pushError(t(`tab.toasts.item-delete.error`)))
    .finally(() => clean())
}
</script>

<template>
  <FetchLoader :status="status" :error="error" only-error skeleton>
    <TabForm
      v-if="editable"
      class="p2"
      :project="project"
      :tab="tab"
      @submit="onPatchTab"
      @close="closeModals('editTab')"
    >
      <template #footer>
        <LpiButton
          class="w-fit"
          btn-icon="TrashCanOutline"
          :label="$t('tab.tab.delete')"
          @click="openModals('deleteTab')"
        />
      </template>
    </TabForm>
    <ContentExpandable
      v-else
      key="description"
      class="description-info"
      :description="tab.$t.description"
      :height-limit="300"
    />

    <BaseModuleHeader
      v-if="!preview"
      :editable="editable"
      :add-label="$t('tab.item.add')"
      :pagination="pagination"
      @add="openModals('addItem')"
    />

    <div class="list-container mt2">
      <ProjectTabItem
        v-for="item in data"
        :key="item.id"
        :project="project"
        :tab="tab"
        :item="item"
        :editable="editable"
        @delete="onDelete(item)"
        @edit="onEdit(item)"
      />
      <NothingHere v-if="data.length === 0" />
    </div>
    <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
  </FetchLoader>

  <!-- drawer/modal -->
  <ConfirmModal
    v-if="stateModals.deleteTab"
    title="$t('tab.tab.delete')"
    :asyncing="asyncing"
    @cancel="clean"
    @confirm="onConfirmDeleteTab"
  >
    {{ $t('tab.tab.delete-confirm') }}
  </ConfirmModal>

  <ConfirmModal
    v-if="stateModals.deleteItem"
    :title="$t('tab.item.delete-confirm')"
    :asyncing="asyncing"
    @cancel="clean"
    @confirm="onConfirmDeleteTabItem"
  >
    <ProjectTabItem :project="project" :tab="tab" :item="selectedItem" />
  </ConfirmModal>

  <AdditionalsDrawer
    :is-opened="stateModals.addItem || stateModals.editItem"
    :project="project"
    :tab="tab"
    :item="selectedItem"
    @close="clean"
    @reload="refreshAll"
  />
</template>

<style lang="scss" scoped>
.description-info {
  padding: 1rem;
  border-radius: 4px;
  border: 2px solid color-mix(in srgb, var(--primary-dark), transparent 85%);
}
</style>
