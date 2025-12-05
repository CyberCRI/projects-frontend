<template>
  <div class="project-tab">
    <div v-if="isMyProfileAndCanCreateProject" class="create-project">
      <LpiButton
        :label="$t('project.create-project')"
        class="btn"
        btn-icon="Plus"
        secondary
        @click="$router.push({ name: 'createProject' })"
      />
    </div>
    <!-- user projects (Owners, Members) -->

    <UserProjectsSearch :limit="12" :member-roles="['owners', 'members']" :user="user">
      <template #default="{ items: projects, isLoading, totalCount, pagination, paginationAction }">
        <div class="project-list-header">
          <h4 class="title">
            {{ $t('me.projects-participate') }}
            <span>({{ totalCount }})</span>
          </h4>
        </div>
        <UserProjectList
          :label="$t('me.projects-participate')"
          :empty-label="noParticipate"
          :number-column="6"
          :projects="projects"
          :projects-loading="isLoading"
          :pagination="pagination"
          class="project-list"
          @pagination-changed="paginationAction"
        />
      </template>
    </UserProjectsSearch>

    <!-- user projects (Reviewers) -->
    <UserProjectsSearch :limit="12" :member-roles="['reviewers']" :user="user">
      <template #default="{ items: projects, isLoading, totalCount, pagination, paginationAction }">
        <div class="project-list-header">
          <h4 class="title">
            {{ $t('me.projects-reviewing') }}
            <span>({{ totalCount }})</span>
          </h4>
        </div>
        <UserProjectList
          :empty-label="noReviewLabel"
          :number-column="6"
          :projects="projects"
          :projects-loading="isLoading"
          :pagination="pagination"
          class="project-list"
          @pagination-changed="paginationAction"
        />
      </template>
    </UserProjectsSearch>

    <!-- user projects (Followed) -->
    <UserProjectsSearch :limit="12" follow :user="user">
      <template #default="{ items: projects, isLoading, totalCount, pagination, paginationAction }">
        <div class="project-list-header">
          <h4 class="title">
            {{ $t('me.follow') }}
            <span>({{ totalCount }})</span>
          </h4>
        </div>
        <UserProjectList
          :empty-label="noFollowLabel"
          :limit="12"
          :number-column="6"
          :projects="projects"
          :projects-loading="isLoading"
          :pagination="pagination"
          class="project-list"
          @pagination-changed="paginationAction"
        />
      </template>
    </UserProjectsSearch>
  </div>
</template>

<script>
import UserProjectsSearch from '@/components/people/UserProfile/UserProjectsSearch.vue'
import UserProjectList from '@/components/people/UserProfile/UserProjectList.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import useUsersStore from '@/stores/useUsers.ts'

export default {
  name: 'ProfileProjectTab',

  components: { UserProjectsSearch, UserProjectList, LpiButton },

  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const usersStore = useUsersStore()
    const { canCreateProject } = usePermissions()
    return {
      usersStore,
      canCreateProject,
    }
  },

  computed: {
    isMyProfileAndCanCreateProject() {
      const loggedAsID = this.usersStore.id
      return loggedAsID && this.user.id === loggedAsID && this.canCreateProject
    },

    isCurrentUser() {
      return this.usersStore.id === this.user.id
    },

    noFollowLabel() {
      return this.isCurrentUser ? this.$t('me.no-follow') : this.$t('you.no-follow')
    },

    noReviewLabel() {
      return this.isCurrentUser
        ? this.$t('me.no-project-reviewing')
        : this.$t('you.no-project-reviewing')
    },

    noParticipate() {
      return this.isCurrentUser
        ? this.$t('me.no-project-participate')
        : this.$t('you.no-project-participate')
    },
  },

  mounted() {
    this.setFollowedProject()
  },

  methods: {
    setFollowedProject() {},
  },
}
</script>

<style lang="scss" scoped>
.project-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-l;

  .title {
    font-size: $font-size-l;
    font-weight: 700;
    color: $primary-dark;
    margin-bottom: $space-l;
  }
}

.create-project {
  padding-top: $space-l;
  display: flex;
  justify-content: flex-end;
}

@media screen and (max-width: $min-tablet) {
  .project-tab {
    padding: 0 $space-s;
  }
}
</style>
