<template>
  <ProjectFormV2 :project="project" :loading="loading" @close="close" @submit="onSubmit" />
</template>

<script setup lang="ts">
import { patchProject, patchProjectHeader, postProjectHeader } from '~/api/projects.service'
import type { ProjectForm, TranslatedProject } from '~/models/project.model'
import { refreshProjectData } from '~/composables/project/refreshProject'
import ProjectFormV2 from '~/components/project/ProjectFormV2.vue'
import { imageSizesFormData } from '~/functs/imageSizesUtils'
import { omit } from 'es-toolkit'

const props = defineProps<{
  project: TranslatedProject
}>()

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

const onSubmit = (form: ProjectForm) => {
  loading.value = true
  const body = {
    ...omit(form, ['imageSizes', 'file']),
  }

  patchProject(props.project.id, body)
    .then(() => {
      const formData = new FormData()
      imageSizesFormData(formData, form.imageSizes)
      // if instanceof File (new file)
      if (form.file instanceof File) {
        formData.append('file', form.file, form.file.name)

        return postProjectHeader(props.project.id, formData)
      } else {
        formData.append('image_id', form.file.id.toString())
        return patchProjectHeader(props.project.id, form.file.id, formData)
      }
    })
    .then(() => {
      toaster.pushSuccess(t('toasts.project-edit.success'))
      refreshProjectData(props.project)
    })
    .catch(() => toaster.pushError(t('toasts.project-edit.error')))
    .finally(() => (loading.value = false))
}

// const toaster = useToasterStore()
// const editProject = async () => {
//   const payload = {
//     ...form.value,
//     header_image: form.value.header_image,
//     tags: form.value.tags.map((tag) => tag.id),
//   }

//   const formData = new FormData()
//   const imageSizes = payload['imageSizes']
//   imageSizesFormData(formData, imageSizes)

//   if (payload.header_image instanceof File) {
//     try {
//       formData.append('file', payload['header_image'], payload['header_image'].name)
//       payload.header_image_id = (
//         await postProjectHeader({
//           project_id: currentProject.value.id,
//           body: formData,
//         })
//       ).id
//       // TODO: make this in POST when backend allows it
//       formData.delete('file')
//       await patchProjectHeader({
//         project_id: currentProject.value.id,
//         image_id: payload.header_image_id,
//         body: formData,
//       })
//     } catch (headerError) {
//       toaster.pushError(`${t('toasts.project-header-create.error')} (${headerError})`)
//       console.error(headerError)
//     }
//   } else if (currentProject.value.header_image.id) {
//     try {
//       await patchProjectHeader({
//         project_id: currentProject.value.id,
//         image_id: currentProject.value.header_image.id,
//         body: formData,
//       })
//       delete payload.header_image
//       delete payload.imageSizes
//     } catch (headerError) {
//       toaster.pushError(`${t('toasts.project-header-create.error')} (${headerError})`)
//       console.error(headerError)
//     }
//   }

//   try {
//     await projectsStore.updateProject({
//       id: currentProject.value.id,
//       project: payload,
//     })
//     toaster.pushSuccess(t('toasts.project-edit.success'))
//   } catch (error) {
//     toaster.pushError(`${t('toasts.project-edit.error')} (${error})`)
//     console.error(error)
//   } finally {
//     emit('project-edited')
//     isSaving.value = false
//   }
// }

// const submit = async () => {
//   isFormCorrect.value = await v$.value.$validate()

//   if (isFormCorrect.value) {
//     isSaving.value = true
//     await editProject()
//     startEditWatcher()
//     emit('close')
//   }
// }

// onMounted(() => fillForm())
</script>
