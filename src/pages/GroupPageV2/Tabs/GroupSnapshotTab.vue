<template>
  <div class="group-snapshot">
    <GroupHeaderV2
      :title="groupName"
      :image="groupImage"
      :visibility="groupVisibility"
      :email="groupEmail"
      :short-description="groupShortDescription"
      :is-loading="isLoading"
    />
    <SubGroups v-if="groupChildren.length > 0" :subgroups="groupChildren" :is-loading="isLoading" />
    <div v-if="!isLoading" class="description">
      <DescriptionExpandable
        :description="description"
        :height-limit="400"
        class="description-content"
      />
    </div>
    <div v-else class="skeleton">
      <SkeletonComponent width="60%" height="25px" border-radius="10px" />
      <SkeletonComponent width="80%" height="20px" border-radius="10px" />
      <SkeletonComponent width="45%" height="20px" border-radius="10px" />
      <SkeletonComponent width="100%" height="15px" border-radius="10px" />
      <SkeletonComponent width="90%" height="15px" border-radius="10px" />
      <SkeletonComponent width="95%" height="15px" border-radius="10px" />
    </div>

    <div v-if="membersCount > 0 || isMembersLoading" class="members">
      <div class="members-header">
        <h2 class="title">
          {{ $t('group.members') }}
          <span v-if="membersCount">( {{ membersCount }} )</span>
        </h2>

        <SeeMoreArrow
          v-if="!isMembersLoading"
          class="see-more-button"
          :to="{ name: 'groupMembers', params: { groupId: $route.params.groupId } }"
        />
      </div>

      <div v-if="isMembersLoading" class="members-container">
        <MemberListSkeleton :min-gap="90" :desktop-columns-number="6" />
      </div>
      <DynamicGrid v-else :min-gap="90" class="members-container">
        <GroupMemberItem
          v-for="member in members.slice(0, totalDisplayed)"
          :key="member.id"
          :user="member"
          :is-manager="member.is_manager"
          class="cursor-pointer shadow-drop"
          @user-click="openProfileDrawer"
          @close="closeProfileDrawer"
        />
      </DynamicGrid>
    </div>

    <div v-if="projectsCount > 0 || isProjectsLoading" class="projects">
      <div class="projects-header">
        <h2 class="title">
          {{ $t('group.projects') }}
          <span v-if="projectsCount">( {{ projectsCount }} )</span>
        </h2>
        <SeeMoreArrow
          v-if="!isProjectsLoading"
          class="see-more-button"
          :to="{
            name: 'groupProjects',
            params: { groupId: $route.params.groupId },
          }"
        />
      </div>
      <div class="projects-container">
        <CardList :is-loading="isProjectsLoading" :items="projects.slice(0, totalDisplayed)">
          <template #default="projectListSlotProps">
            <ProjectCard :horizontal-display="true" :project="projectListSlotProps.item" />
          </template>
        </CardList>
      </div>
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
        @close="closeProfileDrawer"
      />
    </BaseDrawer>
  </div>
</template>

<script>
export default {
  name: 'GroupSnapshotTab',

  props: {
    description: {
      type: String,
      default: '',
    },

    projectsInitialRequest: {
      type: Object,
      default: () => ({}),
    },

    isProjectsLoading: {
      type: Boolean,
      default: true,
    },

    membersInitialRequest: {
      type: Object,
      default: () => ({}),
    },

    isMembersLoading: {
      type: Boolean,
      default: true,
    },

    isLoading: {
      type: Boolean,
      default: true,
    },
    groupName: {
      type: String,
      default: '',
    },
    groupImage: {
      type: [Object, null],
      default: null,
    },
    groupEmail: {
      type: String,
      default: '',
    },
    groupVisibility: {
      type: String,
      default: '',
    },
    groupShortDescription: {
      type: String,
      default: '',
    },
    groupChildren: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      style: {},
      totalDisplayed: 12,
      profileDrawer: {
        isOpened: false,
        user_id: null,
      },
    }
  },

  computed: {
    members() {
      return this.membersInitialRequest.results || []
    },
    membersCount() {
      return this.membersInitialRequest.count || 0
    },
    projects() {
      return this.projectsInitialRequest.results || []
    },
    projectsCount() {
      return this.projectsInitialRequest.count || 0
    },
  },

  methods: {
    async openProfileDrawer(user) {
      this.profileDrawer.user_id = user.id
      this.profileDrawer.isOpened = true
    },

    closeProfileDrawer() {
      this.isEditMode = false
      this.profileDrawer.isOpened = false
      this.profileDrawer.user_id = null
    },
  },
}
</script>

<style lang="scss" scoped>
.description {
  padding-top: $space-2xl;
}

.members {
  margin-top: $space-xl;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-xl;

  &-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    gap: $space-l;

    .title {
      font-weight: 700;
      font-size: $font-size-l;
      color: $primary-dark;
    }
  }

  &-container {
    width: 100%;
    justify-content: space-between;

    .cursor-pointer {
      cursor: pointer;
    }
  }
}

.skeleton {
  margin: $space-xl 0;
}

.projects {
  margin-top: $space-2xl;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    gap: $space-l;

    .title {
      font-weight: 700;
      font-size: $font-size-l;
      color: $primary-dark;
    }
  }

  &-container {
    width: 100%;
  }
}

@media screen and (max-width: $med-mobile) {
  .description {
    padding: $space-m $space-m 0 $space-m;
  }
}
</style>
