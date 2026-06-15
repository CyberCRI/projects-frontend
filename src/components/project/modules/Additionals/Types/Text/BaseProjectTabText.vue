<script setup lang="ts">
import InlineAdditionalsItemForm from '~/components/project/modules/Additionals/Types/InlineAdditionalsItemForm.vue'
import BaseAdditionalsTab from '~/components/project/modules/Additionals/Types/BaseAdditionalsTab.vue'
import type { TranslatedProjectTab, TranslatedProjectTabItem } from '~/models/projects-tabs.model'
import BaseDescription from '~/components/modules/Abstract/BaseDescription.vue'
import { projectTabItemSkeleton } from '~/skeletons/project-tabs.skeletons'
import { refreshProjectTabs } from '~/composables/project/refreshProject'
import ContentExpandable from '~/components/base/ContentExpandable.vue'
import { getAllProjectTabItem } from '~/api/v2/project-tabs.service'
import type { TranslatedProject } from '@/models/project.model'
import { factoryPagination } from '~/skeletons/base.skeletons'
import FetchLoader from '~/components/base/FetchLoader.vue'

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

const selectedItem = ref<TranslatedProjectTabItem>()

const { closeAllModals } = useModals({ addOrEditItem: false })
const asyncing = ref(false)
const organizationCode = useOrganizationCode()
const projectId = computed(() => props.project.id)
const tabId = computed(() => props.tab.id)

const { status, error, data, refresh } = getAllProjectTabItem(organizationCode, projectId, tabId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => factoryPagination(projectTabItemSkeleton, props.tab.modules.items),
})

const clean = () => {
  selectedItem.value = null
  closeAllModals()
  asyncing.value = false
}

const refreshAll = () => refreshProjectTabs(props.project).then(() => refresh())

const item = computed(() => data.value[0])
</script>

<template>
  <FetchLoader :status="status" only-error :error="error" skeleton>
    <BaseAdditionalsTab :project="project" :tab="tab" :editable="editable" :preview="preview">
      <template v-if="item">
        <ContentExpandable
          v-if="preview"
          :description="item.$t.content"
          :height-limit="400"
          hide-see-more
        />
        <BaseDescription
          v-else-if="!editable"
          :title="item.$t.title"
          :description="item.$t.content"
        />
        <InlineAdditionalsItemForm
          v-else
          :project="project"
          :tab="tab"
          :item="item"
          @reload="refreshAll"
          @close="clean"
        />
      </template>
      <NothingHere v-else />
    </BaseAdditionalsTab>
  </FetchLoader>
</template>

<style lang="scss" scoped>
.description-info {
  padding: 1rem;
  border-radius: 4px;
  border: 2px solid color-mix(in srgb, var(--primary-dark), transparent 85%);
}
</style>
