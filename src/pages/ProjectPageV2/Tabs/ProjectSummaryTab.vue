<template>
  <div class="project-summary">
    <div class="main-ctn">
      <LazyProjectHeaderV2
        :project="project"
        :sdgs="sdgs"
        :loading="!project"
        class="project-header v2"
      />

      <!-- description -->
      <DescriptionPlaceholder
        v-if="canEditProject && showDescriptionPlaceHolder"
        class="unboxed"
        :project="project"
      />
      <DescriptionRecap
        v-else-if="project?.$t?.description"
        class="unboxed"
        :project="project"
        :description="project.$t.description"
      />

      <!-- team -->
      <ProjectMemberSection
        v-if="mergedTeam?.length"
        class="unboxed"
        :members="mergedTeam"
        @user-click="openProfileDrawer"
      />

      <!-- locations -->
      <LazyMapRecap
        v-if="locations.length"
        class="unboxed"
        expand
        :editable="false"
        :locations="locations"
        @expand="projectLayoutToggleAddModal('location')"
      />

      <!-- goals -->
      <GoalsRecap v-if="filteredGoals.length" class="unboxed" :goals="filteredGoals" />

      <!-- blog -->
      <PublicationRecap
        v-if="blogEntries.length"
        class="unboxed"
        :is-blog="true"
        :publications="blogEntries"
      />

      <!-- resources -->
      <ResourcesRecap
        v-if="linkResources?.length || fileResources?.length"
        class="unboxed"
        :files="fileResources.length"
        :links="linkResources.length"
        :target="`/projects/${$route.params.slugOrId}/resources`"
        :redirect="{
          name: 'projectResources',
          params: { slugOrId: $route.params.slugOrId },
          hash: '#tab',
        }"
      />

      <!-- linked projects -->
      <LinkedProjectsRecap
        v-if="linkedProjects?.length"
        class="unboxed"
        :linked-projects="linkedProjects"
      />

      <ReviewRecap
        v-if="project && project.publication_status"
        class="unboxed"
        :project="project"
        :reviews="reviews"
        @reload-reviews="$emit('reload-reviews')"
        @reload-project="$emit('reload-project')"
      />

      <!-- comments -->
      <PublicationRecap
        v-if="comments.length"
        class="unboxed"
        :is-blog="false"
        :publications="comments"
      />
    </div>
    <BaseDrawer
      no-footer
      :is-opened="profileDrawer.isOpened"
      :title="$t('profile.drawer_title')"
      @close="closeProfileDrawer"
      @confirm="closeProfileDrawer"
    >
      <UserProfileV2
        v-if="profileDrawer.isOpened"
        ref="profile-user"
        :can-edit="false"
        :user-id="profileDrawer.user_id"
        is-preview
      />
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import ProjectMemberSection from '@/components/group/ProjectMemberSection/ProjectMemberSection.vue'
import { textIsEmpty } from '@/functs/string'
import { isNotGroup } from '@/functs/users'
import { AttachmentFileModel } from '@/models/attachment-file.model'
import { AttachmentLinkModel } from '@/models/attachment-link.model'
import { BlogEntryModel } from '@/models/blog-entry.model'
import { CommentModel } from '@/models/comment.model'
import { TranslatedGoal } from '@/models/goal.model'
import { LocationModel } from '@/models/location.model'
import { TranslatedProject } from '@/models/project.model'
import { UserModel } from '@/models/user.model'

const projectLayoutToggleAddModal = inject<(name: string) => void>('projectLayoutToggleAddModal')

const props = withDefaults(
  defineProps<{
    project?: TranslatedProject
    comments?: CommentModel[]
    locations?: LocationModel[]
    fileResources?: AttachmentFileModel[]
    linkResources?: AttachmentLinkModel[]
    blogEntries?: BlogEntryModel[]

    reviews?: any[]
    linkedProjects?: TranslatedProject[]
    goals?: TranslatedGoal[]
    sdgs?: number[]
    team?: {
      owners: UserModel[]
      members: UserModel[]
      reviewers: UserModel[]
      owner_groups: UserModel[]
      reviewer_groups: UserModel[]
      member_groups: UserModel[]
    }
  }>(),
  {
    project: null,
    comments: () => [],
    locations: () => [],
    fileResources: () => [],
    linkResources: () => [],
    blogEntries: () => [],
    reviews: () => [],
    linkedProjects: () => [],
    goals: () => [],
    team: () => ({
      owners: [],
      members: [],
      reviewers: [],
      owner_groups: [],
      reviewer_groups: [],
      member_groups: [],
    }),
    sdgs: () => [],
  }
)

defineEmits<{
  'reload-reviews': []
  'reload-project': []
}>()

const router = useRouter()

useScrollToTab()
const { canEditProject } = usePermissions()
const { translateUser, translateGroup } = useAutoTranslate()
const profileDrawer = ref({
  isOpened: false,
  user_id: null,
})

const filteredGoals = computed(() => {
  return (
    props.goals?.filter(
      (goal) => goal.status && (goal.status === 'complete' || goal.status === 'ongoing')
    ) || []
  )
})

const mergedTeam = computed(() => {
  return [
    ...(props.team.owners || []).map((o) => ({
      ...unref(translateUser(o)),
      role: 'owners',
    })),
    ...(props.team.reviewers || []).map((o) => ({
      ...unref(translateUser(o)),
      role: 'reviewers',
    })),
    ...(props.team.members || []).map((o) => ({
      ...unref(translateUser(o)),
      role: 'members',
    })),
    ...(props.team.owner_groups || []).map((o) => ({
      ...unref(translateGroup(o)),
      role: 'owner_groups',
    })),
    ...(props.team.reviewer_groups || []).map((o) => ({
      ...unref(translateGroup(o)),
      role: 'reviewer_groups',
    })),
    ...(props.team.member_groups || []).map((o) => ({
      ...unref(translateGroup(o)),
      role: 'member_groups',
    })),
  ]
})

const showDescriptionPlaceHolder = computed(() => textIsEmpty(props.project.description))

const openProfileDrawer = async (user) => {
  if (isNotGroup(user)) {
    profileDrawer.value.user_id = user.id
    profileDrawer.value.isOpened = true
  } else {
    // TODO why user.id for group ????
    router.push({ name: 'Group', params: { groupIdOrSlug: user.id } })
  }
}

const closeProfileDrawer = () => {
  profileDrawer.value.isOpened = false
  profileDrawer.value.user_id = null
}
</script>

<style lang="scss" scoped>
.project-summary {
  .main-ctn {
    display: flex;
    flex-flow: column;
    gap: 1rem;
  }

  .similar-projects {
    margin-top: 80px;
  }
}

.unboxed {
  border: 0 none !important;
  border-radius: 0 !important;
  padding: $space-l 0 !important;
  background: transparent !important;
}

:deep(.unboxed .section-header) {
  justify-content: space-between !important;
}
</style>
