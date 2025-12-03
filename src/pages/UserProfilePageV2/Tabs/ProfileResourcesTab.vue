<template>
  <div class="document-tab">
    <FetchLoader :status="[statusFiles, statusLinks]">
      <ResourcesTab
        :file-resources="filesTranslated"
        :link-resources="LinksTranslated"
        :is-in-editing-mode="isInEditingMode"
        :delete-attachment-link="deleteAttachmentLink"
        :delete-attachment-file="deleteAttachmentFile"
        :permissions="canEditUser"
        @edit="onEdit"
      />
      <ResourceDrawer
        :user="user"
        :is-add-mode="!!!selectedItem"
        :selected-item="selectedItem"
        :is-opened="isOpened"
        :links="resultsLinks"
        :post-attachment-files="postAttachmentFiles"
        :patch-attachment-file="patchAttachmentFile"
        :post-attachment-links="postAttachmentLinks"
        :patch-attachment-link="patchAttachmentLink"
        @close="isOpened = false"
        @reload-link-resources="refreshLinks"
        @reload-file-resources="refreshFiles"
      />
    </FetchLoader>
  </div>
</template>

<script setup lang="ts">
import {
  patchUserAttachmentFile,
  postUserAttachmentFile,
  deleteUserAttachmentFile,
} from '@/api/attachment-files.service'
import {
  patchUserAttachmentLink,
  postUserAttachmentLink,
  deleteUserAttachmentLink,
} from '@/api/attachment-links.service'
import FetchLoader from '@/components/base/FetchLoader.vue'
import ResourceDrawer from '@/components/resources/ResourceDrawer.vue'
import ResourcesTab from '@/components/resources/ResourcesTab.vue'
import { AttachmentFileModel, TranslatedAttachmentFileModel } from '@/models/attachment-file.model'
import { UserModel } from '@/models/user.model'

defineOptions({ name: 'ProfileResourcesTab' })

const props = defineProps<{ user: UserModel; isInEditingMode: boolean }>()
const { canEditUser } = usePermissions()
const { translateFiles, translateLinks } = useAutoTranslate()
const selectedItem = ref(null)
const isOpened = ref(false)

// paginated limits (add paginated query ?)
const query = { query: { limit: 500 } }

const {
  status: statusFiles,
  data: dataFiles,
  refresh: refreshFiles,
} = useAPI2<PaginationResult<AttachmentFileModel>>(`user/${props.user.id}/file`, query)
const resultsFiles = computed<AttachmentFileModel[] | undefined>(() => dataFiles.value?.results)
const filesTranslated: ComputedRef<TranslatedAttachmentFileModel[]> = translateFiles(resultsFiles)

const {
  status: statusLinks,
  data: dataLinks,
  refresh: refreshLinks,
} = useAPI2<PaginationResult<AttachmentFileModel>>(`user/${props.user.id}/link`, query)
const resultsLinks = computed<AttachmentFileModel[] | undefined>(() => dataLinks.value?.results)
const LinksTranslated: ComputedRef<TranslatedAttachmentFileModel[]> = translateLinks(resultsLinks)

const deleteAttachmentLink = (linkId) => deleteUserAttachmentLink(props.user.id, linkId)
const deleteAttachmentFile = (fileId) => deleteUserAttachmentFile(props.user.id, fileId)
const postAttachmentFiles = (body) => postUserAttachmentFile(props.user.id, body)
const patchAttachmentFile = (body) => patchUserAttachmentFile(props.user.id, body.id, body)
const postAttachmentLinks = (body) => postUserAttachmentLink(props.user.id, body)
const patchAttachmentLink = (body) => patchUserAttachmentLink(props.user.id, body.id, body)

const onEdit = (resource) => {
  isOpened.value = true
  selectedItem.value = resource
}
</script>
