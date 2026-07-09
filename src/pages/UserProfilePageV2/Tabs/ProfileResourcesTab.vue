<template>
  <div>
    <FetchLoader :status="[statusFiles, statusLinks]">
      <ResourcesTab
        :file-resources="filesTranslated"
        :link-resources="LinksTranslated"
        :is-in-editing-mode="isInEditingMode"
        :delete-attachment-link="deleteAttachmentLink"
        :delete-attachment-file="deleteAttachmentFile"
        :permissions="canEditUser"
        :editable="isInEditingMode"
        @reload-link-resources="refresh(refreshLinks)"
        @reload-file-resources="refresh(refreshFiles)"
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
        @reload-link-resources="refresh(refreshLinks)"
        @reload-file-resources="refresh(refreshFiles)"
      />
    </FetchLoader>
  </div>
</template>

<script setup lang="ts">
import type { UserModel } from 'shared-projects-frontend/models'

import {
  deleteUserAttachmentLink,
  patchUserAttachmentLink,
  postUserAttachmentLink,
  deleteUserAttachmentFile,
  patchUserAttachmentFile,
  postUserAttachmentFile,
} from 'shared-projects-frontend/apis'

import { usePermissionUser } from '~/composables/usePermissions/useUserPermissions'
import { getUserAttachmentFile } from '~/api/v2/attachment-files.service'
import { getUserAttachmentLinks } from '~/api/v2/attachment-link.service'
import ResourceDrawer from '~/components/resources/ResourceDrawer.vue'
import ResourcesTab from '~/components/resources/ResourcesTab.vue'
import FetchLoader from '~/components/base/FetchLoader.vue'

const props = defineProps<{
  user: UserModel
  isInEditingMode: boolean
  onProfileEdited: () => void
}>()
const organizationCode = useOrganizationCode()
const userId = computed(() => props.user.id)
const { canEditUser } = usePermissionUser(userId)
const selectedItem = ref(null)
const isOpened = ref(false)

const {
  status: statusFiles,
  data: filesTranslated,
  refresh: refreshFiles,
} = getUserAttachmentFile(organizationCode, userId, {
  // TODO add pagiations buttons (after refacto profile)
  paginationConfig: {
    limit: 999,
  },
})

const {
  status: statusLinks,
  data: LinksTranslated,
  refresh: refreshLinks,
} = getUserAttachmentLinks(organizationCode, userId, {
  // TODO add pagiations buttons (after refacto profile)
  paginationConfig: {
    limit: 999,
  },
})

// refresh local links or files + projects (the onProfileEdited)
const refresh = (refreshFunction: () => Promise<void>) =>
  refreshFunction().then(() => props.onProfileEdited())

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
