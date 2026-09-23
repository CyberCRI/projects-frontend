<script setup lang="ts">
import BaseProjectTabText from '~/components/project/modules/Additionals/Types/Text/BaseProjectTabText.vue'
import BaseProjectTabBlog from '~/components/project/modules/Additionals/Types/Blog/BaseProjectTabBlog.vue'
import ProjectResourcesPreview from '~/components/project/modules/Resources/ProjectResourcesPreview.vue'
import ProjectReviewPreview from '~/components/project/modules/review/ProjectReviewPreview.vue'
import type { TranslatedProjectTab, TranslatedProject } from 'shared-projects-frontend/models'
import { usePermissionProject } from '~/composables/usePermissions/useProjectPermissions'
import { usePermissions } from '~/composables/usePermissions/usePermissions'
import useUsersStore from '~/stores/useUsers'
import { textIsEmpty } from '~/functs/tiptap'

const props = defineProps<{ project: TranslatedProject; tab: TranslatedProjectTab }>()
const { isAdmin } = usePermissions()
const { isMember } = usePermissionProject(computed(() => props.project.id))

const isMemberOrAdmin = computed(() => isMember.value || isAdmin.value)
const { isConnected } = useUsersStore()

const descripitonEmpty = computed(() => textIsEmpty(props.project.$t.description))
</script>

<template>
  <ProjectDescriptionPreview
    v-if="tab.type === 'description' && !descripitonEmpty"
    :project="project"
    :tab="tab"
  />
  <ProjectMembersPreview v-else-if="tab.type === 'members'" :project="project" :tab="tab" />
  <ProjectGroupsPreview v-else-if="tab.type === 'groups'" :project="project" :tab="tab" />
  <ProjectLocationsPreview v-else-if="tab.type === 'locations'" :project="project" :tab="tab" />

  <ProjectGoalsPreview v-else-if="tab.type === 'goals'" :project="project" :tab="tab" />

  <ProjectBlogEntriesPreview v-else-if="tab.type === 'blogs'" :project="project" :tab="tab" />

  <ProjectLinkedProjectsPreview
    v-else-if="tab.type === 'linked_projects'"
    :project="project"
    :tab="tab"
  />

  <ProjectAnnouncementsPreview
    v-else-if="tab.type === 'announcements'"
    :project="project"
    :tab="tab"
  />

  <ProjectResourcesPreview v-else-if="tab.type === 'resources'" :project="project" :tab="tab" />
  <ProjectCommentsPreview v-else-if="tab.type === 'comments'" :project="project" :tab="tab" />
  <ProjectReviewPreview
    v-else-if="tab.type === 'reviews' && isConnected"
    :project="project"
    :tab="tab"
  />
  <ProjectPrivateExchangePreview
    v-if="tab.type === 'messages' && isMemberOrAdmin"
    :project="project"
    :tab="tab"
  />

  <BaseModulePreview
    v-else-if="tab.type === 'blog' || tab.type === 'text'"
    :title="tab.title"
    :icon="tab.icon"
    :total="tab.modules.items"
    :see-more="{
      name: 'projectAdditionals',
      params: { slugOrId: project.slug || project.id, tabId: tab.slug || tab.id },
    }"
  >
    <template #content>
      <!--
        Here you put all posibility of additions item
        actually is blog or text (description)
      -->
      <BaseProjectTabBlog
        v-if="tab.type === 'blog'"
        :project="project"
        :tab="tab"
        preview
        :limit="4"
      />
      <BaseProjectTabText v-else-if="tab.type === 'text'" :project="project" :tab="tab" preview />
    </template>
  </BaseModulePreview>
</template>
