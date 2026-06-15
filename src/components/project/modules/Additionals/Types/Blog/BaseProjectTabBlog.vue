<script setup lang="ts">
import AdditionalsItemDrawer from '~/components/project/modules/Additionals/Types/AdditionalsItemDrawer.vue'
import BaseAdditionalsTab from '~/components/project/modules/Additionals/Types/BaseAdditionalsTab.vue'
import type { TranslatedProjectTab, TranslatedProjectTabItem } from '~/models/projects-tabs.model'
import BlogEntry from '~/components/project/modules/BlogEntries/BlogEntry.vue'
import { projectTabItemSkeleton } from '~/skeletons/project-tabs.skeletons'
import { refreshProjectTabs } from '~/composables/project/refreshProject'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import { getAllProjectTabItem } from '~/api/v2/project-tabs.service'
import type { TranslatedBlogEntry } from '~/models/blog-entry.model'
import { deleteProjectTabItem } from '~/api/project-tabs.service'
import type { TranslatedProject } from '@/models/project.model'
import { factoryPagination } from '~/skeletons/base.skeletons'
import FetchLoader from '~/components/base/FetchLoader.vue'
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

const selectedItem = ref<TranslatedProjectTabItem>()

const { stateModals, openModals, closeAllModals } = useModals({
  deleteItem: false,
  addOrEditItem: false,
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
  openModals('addOrEditItem')
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

const dataBlogs = computed(
  () => data.value satisfies TranslatedBlogEntry[] as TranslatedBlogEntry[]
)

// expnadable
const route = useRoute()
const expanded = ref<number>()
const setExpanded = (state: boolean, item: TranslatedProjectTabItem) => {
  if (state && expanded.value !== item.id) {
    expanded.value = item.id
  } else if (!state && expanded.value == item.id) {
    expanded.value = null
  }
}

watchEffect(() => {
  expanded.value = parseInt(route.hash.replaceAll('#item:', ''), 10)
})
</script>

<template>
  <FetchLoader :status="status" :error="error" only-error skeleton>
    <BaseAdditionalsTab :project="project" :tab="tab" :editable="editable" :preview="preview">
      <BaseModuleHeader
        :editable="editable"
        :add-label="$t('tab.item.add')"
        :pagination="pagination"
        @add="openModals('addOrEditItem')"
      />

      <div class="list-container mt2">
        <BlogEntry
          v-for="item in dataBlogs"
          :id="`item:${item.id}`"
          :key="item.id"
          :project="project"
          :blog-entry="item"
          :can-delete="editable"
          :can-edit="editable"
          :to="
            preview
              ? {
                  name: 'projectAdditionals',
                  params: { slugOrId: project.slug || project.id, tabId: tab.id },
                  hash: `#item:${item.id}`,
                }
              : null
          "
          :class="{ 'scale-hover': preview }"
          :expanded="expanded === item.id"
          @expanded="setExpanded($event, item as TranslatedProjectTabItem)"
          @delete="onDelete(item as TranslatedProjectTabItem)"
          @edit="onEdit(item as TranslatedProjectTabItem)"
        />
        <NothingHere v-if="dataBlogs.length === 0" />
        <PaginationButtonsV2 v-if="!preview" :pagination="pagination" />
      </div>
    </BaseAdditionalsTab>
  </FetchLoader>

  <ConfirmModal
    v-if="stateModals.deleteItem"
    :title="$t('tab.item.delete-confirm')"
    :asyncing="asyncing"
    @cancel="clean"
    @confirm="onConfirmDeleteTabItem"
  >
    <BlogEntry :blog-entry="selectedItem as TranslatedBlogEntry" />
  </ConfirmModal>

  <AdditionalsItemDrawer
    :is-opened="stateModals.addOrEditItem"
    :project="project"
    :tab="tab"
    :item="selectedItem"
    @close="clean"
    @reload="refreshAll"
  />
</template>
