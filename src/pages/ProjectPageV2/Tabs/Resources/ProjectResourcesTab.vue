<template>
  <BaseModuleTab>
    <BaseProjectResources :project="project" :editable="editable" />
  </BaseModuleTab>
</template>

<script setup lang="ts">
import BaseProjectResources from '~/components/project/modules/Resources/BaseProjectResources.vue'
import BaseModuleTab from '~/components/modules/BaseModuleTab.vue'
import type { TranslatedProject } from '~/models/project.model'

withDefaults(defineProps<{ project: TranslatedProject; editable?: boolean }>(), {
  editable: false,
})

// async deleteResource(resource, type) {
//   this.asyncing = true
//   if (type === 'link') {
//     try {
//       await deleteAttachmentLink({
//         id: resource.id,
//         projectId: this.project.id,
//       })

//       analytics.attachmentLink.removeAttachment({
//         project: {
//           id: this.project.id,
//         },
//         attachment: resource,
//       })

//       this.$emit('reload-link-resources')

//       this.toaster.pushSuccess(this.$t('toasts.link-delete.success'))
//     } catch (error) {
//       this.toaster.pushError(`${this.$t('toasts.link-delete.error')} (${error})`)
//       console.error(error)
//     } finally {
//       this.asyncing = false
//       this.confirmModalVisible = false
//     }
//   } else if (type === 'file') {
//     try {
//       await deleteAttachmentFile({ id: resource.id, projectId: this.project?.id })

//       analytics.attachmentFile.removeAttachment({
//         project: {
//           id: this.project.id,
//         },
//         attachment: resource,
//       })

//       this.$emit('reload-file-resources')

//       this.toaster.pushSuccess(this.$t('toasts.file-delete.success'))
//     } catch (error) {
//       this.toaster.pushError(`${this.$t('toasts.file-delete.error')} (${error})`)
//       console.error(error)
//     } finally {
//       this.asyncing = false
//       this.confirmModalVisible = false
//     }
//   }
// },
</script>
