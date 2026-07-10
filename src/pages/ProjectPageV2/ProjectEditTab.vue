<template>
  <BaseModuleTab>
    <ProjectForm :project="project" :loading="loading" @close="close" @submit="onSubmit" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import {
  deleteProjectHeader,
  patchProject,
  patchProjectHeader,
  postProjectHeader,
} from '~/api/projects.service'
import type { ProjectForm as ProjectFormType, TranslatedProject } from '~/models/project.model'
import { refreshProjectData } from '~/composables/project/refreshProject'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import ProjectForm from '~/components/project/ProjectForm.vue'
import { imageSizesFormData } from '~/functs/imageSizesUtils'
import { omit } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    // eslint-disable-next-line vue/no-unused-properties
    editable?: boolean
  }>(),
  { editable: true }
)

const router = useRouter()

defineEmits<{
  close: []
  'project-edited': []
}>()

const { t } = useNuxtI18n()
const toaster = useToaster()
const loading = ref(false)
const close = () => {
  router.push({
    name: 'ProjectSnapshot',
    params: {
      slugOrId: props.project.slug || props.project.id,
    },
  })
}

const onSubmit = (form: ProjectFormType) => {
  loading.value = true
  const body = {
    ...omit(form, ['imageSizes', 'file']),
  }

  patchProject(props.project.id, body)
    .then(async () => {
      const formData = new FormData()
      imageSizesFormData(formData, form.imageSizes)
      // delete old file if is changed
      if (
        !(form.file instanceof File) &&
        props.project.header_image?.id != form.file?.id &&
        props.project.header_image?.id
      ) {
        await deleteProjectHeader(props.project.id, props.project.header_image.id)
      }
      if (form.file instanceof File) {
        formData.append('file', form.file, form.file.name)

        return await postProjectHeader(props.project.id, formData)
      } else if (form.file) {
        formData.append('image_id', form.file.id.toString())
        return await patchProjectHeader(props.project.id, form.file.id, formData)
      }
    })
    .then(() => {
      toaster.pushSuccess(t('toasts.project-edit.success'))
      refreshProjectData(props.project)
    })
    .catch(() => toaster.pushError(t('toasts.project-edit.error')))
    .finally(() => (loading.value = false))
}
</script>
