<script setup lang="ts">
import type {
  TranslatedProject,
  ProjectTabForm,
  TranslatedProjectTab,
  ProjectTab,
} from 'shared-projects-frontend/models'
import {
  createProjectTab,
  createProjectTabItem,
  updateProjectTab,
} from 'shared-projects-frontend/apis'
import {
  defaultProjectTabForm,
  useProjectTabForm,
  useProjectTabItemForm,
} from '~/form/project-tabs'
import { refreshProjectData, refreshProjectTabs } from '~/composables/project/refreshProject'
import { usePermissionProject } from '~/composables/usePermissions/useProjectPermissions'
import { usePermissions } from '~/composables/usePermissions/usePermissions'
import TabItemFormRaw from '~/components/tabs/TabItemFormRaw.vue'
import TabForm from '~/components/tabs/TabForm.vue'
import Title from '~/components/base/Title.vue'
import analytics from '~/analytics'
import { isNil } from 'es-toolkit'

const props = defineProps<{
  project: TranslatedProject
  tab?: TranslatedProjectTab | ProjectTab
  isOpened?: boolean
}>()

const emit = defineEmits<{
  refresh: []
  close: []
}>()

const toaster = useToaster()
const { t } = useNuxtI18n()
const router = useRouter()

const asyncing = ref(false)
const gobals = useGlobals()

const defaultLocalForm = () => {
  const local = defaultProjectTabForm()
  if (props.tab) {
    local.id = props.tab.id || local.id
    local.uuid = props.tab.uuid || local.uuid
    local.description = props.tab.title || local.title
    local.description = props.tab.description || local.description
    local.description = props.tab.icon || local.icon
    local.order = props.tab.order || local.order
    local.project = props.tab.project || local.project
    local.show_preview = props.tab.show_preview || local.show_preview
    local.show_tab = props.tab.show_tab || local.show_tab
  }
  console.log(local, props.tab)
  return local
}

const {
  form: formTab,
  validate: validateTab,
  reset,
} = useProjectTabForm({ default: defaultLocalForm() })
const { form: formTabItem, validate } = useProjectTabItemForm()

watch(
  () => props.tab,
  () => reset(defaultLocalForm()),
  { immediate: true, deep: true }
)

const createOrUpdate = (form: ProjectTabForm): Promise<ProjectTab> => {
  if (isNil(form.id)) {
    return createProjectTab(props.project.id, form)
      .then((projectTab) => {
        analytics.track('create_project_tab', {
          project: props.project.id,
          tab: projectTab.id,
        })
        return projectTab
      })
      .then((projectTab) => {
        // ignore blog creations
        if (projectTab.type === 'blog') {
          return projectTab
        }
        return createProjectTabItem(props.project.id, projectTab.id, formTabItem.value)
          .catch(() => {
            toaster.pushError(t('tab.toasts.item-create.error'))
          })
          .then(() => projectTab)
      })
  } else {
    return updateProjectTab(props.project.id, form.id, form).then((projectTab) => {
      analytics.track('update_project_tab', {
        project: props.project.id,
        tab: projectTab.id,
      })
      return projectTab
    })
  }
}

const onSubmit = async (form: ProjectTabForm) => {
  // TODO:  !(await validatTabItem())
  if (!(await validateTab())) {
    return
  }

  asyncing.value = true
  createOrUpdate(form)
    .then(() => {
      if (isNil(form.id)) {
        toaster.pushSuccess(t('tab.toasts.tab-create.success'))
      } else {
        toaster.pushSuccess(t('tab.toasts.tab-update.success'))
      }
      refreshProjectData(props.project)
        .then(() => refreshProjectTabs(props.project))
        .then(() => {
          gobals.uiIsLocked = false
          router.push({
            name: 'ProjectTabsSettingsEdit',
            params: {
              slugOrId: props.project.slug || props.project.id,
            },
          })
        })
        .then(() => emit('refresh'))
    })
    .catch(() => {
      if (isNil(form.id)) {
        toaster.pushError(t('tab.toasts.tab-create.error'))
      } else {
        toaster.pushError(t('tab.toasts.tab-update.error'))
      }
    })
    .then(() => {
      asyncing.value = false
    })
}

const { isAdmin } = usePermissions()
const { canCreateTab } = usePermissionProject(
  computed(() => props.project.id),
  computed(() => props.project)
)

watchEffect(() => {
  if (!canCreateTab.value && !isAdmin.value) {
    toaster.pushError(t('message.error.unauthorized'))
    router.push({
      name: 'ProjectSnapshot',
      params: {
        slugOrId: props.project.slug || props.project.id,
      },
    })
  }
})
</script>

<template>
  <BaseDrawer :title="$t('tab.tab.add')" :is-opened="isOpened" no-footer @close="emit('close')">
    <!-- show message when creation is only enable when you are admin -->
    <LpiSnackbar v-if="!canCreateTab && isAdmin" icon="AlertOutline" type="warning">
      {{ $t('tab.tab.not-enabled.admin') }}
    </LpiSnackbar>

    <TabForm
      v-model="formTab"
      :asyncing="asyncing"
      :project="project"
      :tab="tab"
      @submit="onSubmit"
    >
      <!-- you can create description in create tabs only if type is text -->
      <template v-if="isNil(formTab.id) && formTab.type === 'text'">
        <br />
        <Title :title="$t('tab.item.create')" />
        <TabItemFormRaw v-model="formTabItem" />
      </template>
    </TabForm>
  </BaseDrawer>
</template>
