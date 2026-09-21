<script setup lang="ts">
import BaseProjectTabText from '~/components/project/modules/Additionals/Types/Text/BaseProjectTabText.vue'
import BaseProjectTabBlog from '~/components/project/modules/Additionals/Types/Blog/BaseProjectTabBlog.vue'
import ProjectResourcesPreview from '~/components/project/modules/Resources/ProjectResourcesPreview.vue'
import ProjectReviewPreview from '~/components/project/modules/review/ProjectReviewPreview.vue'
import type { TranslatedProjectTab, TranslatedProject } from 'shared-projects-frontend/models'
import useUsersStore from '~/stores/useUsers'

defineProps<{ project: TranslatedProject; tab: TranslatedProjectTab }>()

const { isConnected } = useUsersStore()
</script>

<template>
  <ProjectMembersPreview v-if="tab.type === 'members'" :project="project" />
  <ProjectGroupsPreview v-else-if="tab.type === 'groups'" :project="project" />
  <ProjectLocationsPreview v-else-if="tab.type === 'locations'" :project="project" />

  <ProjectGoalsPreview v-else-if="tab.type === 'goals'" :project="project" />

  <ProjectBlogEntriesPreview v-else-if="tab.type === 'blogs'" :project="project" />

  <ProjectLinkedProjectsPreview v-else-if="tab.type === 'linked_projects'" :project="project" />

  <ProjectAnnouncementsPreview v-else-if="tab.type === 'announcements'" :project="project" />

  <ProjectResourcesPreview v-else-if="tab.type === 'resources'" :project="project" />
  <ProjectCommentsPreview v-else-if="tab.type === 'comments'" :project="project" />
  <ProjectReviewPreview v-else-if="tab.type === 'messages' && isConnected" :project="project" />
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
