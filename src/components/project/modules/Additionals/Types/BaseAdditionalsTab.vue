<script setup lang="ts">
import type {
  ProjectTabForm,
  TranslatedProjectTab,
  TranslatedProjectTabItem,
} from '~/models/projects-tabs.model'
import { deleteProjectTab, updateProjectTab } from '~/api/project-tabs.service'
import { refreshProjectTabs } from '~/composables/project/refreshProject'
import BaseModuleHeader from '~/components/modules/BaseModuleHeader.vue'
import ContentExpandable from '~/components/base/ContentExpandable.vue'
import type { TranslatedProject } from '@/models/project.model'
import LpiButton from '~/components/base/button/LpiButton.vue'
import TabForm from '~/components/tabs/TabForm.vue'
import { textIsEmpty } from '~/functs/tiptap'
import analytics from '~/analytics'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    tab: TranslatedProjectTab
    editable?: boolean
    preview?: boolean
  }>(),
  { editable: false, preview: false }
)

const emit = defineEmits<{
  refresh: []
}>()

const { t } = useNuxtI18n()
const toaster = useToaster()
const router = useRouter()

const selectedItem = ref<TranslatedProjectTabItem>()

const { stateModals, openModals, toggleModals, closeModals, closeAllModals } = useModals({
  editTab: false,
  deleteTab: false,
})
const asyncing = ref(false)

const clean = () => {
  selectedItem.value = null
  closeAllModals()
  asyncing.value = false
}

const refreshAll = () => refreshProjectTabs(props.project).then(() => emit('refresh'))

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
</script>

<template>
  <template v-if="!preview">
    <BaseModuleHeader v-if="editable" :editable="false">
      <div />
      <LpiButton
        class="w-fit"
        :btn-icon="stateModals.editTab ? 'ChevronUp' : 'ChevronDown'"
        :label="$t('tab.tab.edit')"
        @click="toggleModals('editTab')"
      />
    </BaseModuleHeader>

    <ContentExpandable
      v-if="editable"
      :height-limit="0"
      :opened="stateModals.editTab"
      hide-see-more
    >
      <TabForm
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
            color="red"
            :label="$t('tab.tab.delete')"
            @click="openModals('deleteTab')"
          />
        </template>
      </TabForm>
    </ContentExpandable>
    <ContentExpandable
      v-else-if="!textIsEmpty(tab.$t.description)"
      key="description"
      class="description-info"
      :description="tab.$t.description"
      :height-limit="300"
    />
  </template>

  <slot />

  <!-- drawer/modal -->
  <ConfirmModal
    v-if="stateModals.deleteTab"
    :title="$t('tab.tab.delete')"
    :asyncing="asyncing"
    @cancel="clean"
    @confirm="onConfirmDeleteTab"
  >
    {{ $t('tab.tab.delete-confirm') }}
  </ConfirmModal>
</template>

<style lang="scss" scoped>
.description-info {
  padding: 1rem;
  border-radius: 4px;
  border: 2px solid color-mix(in srgb, var(--primary-dark), transparent 85%);
}
</style>
