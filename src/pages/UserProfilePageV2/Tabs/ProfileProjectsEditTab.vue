<template>
  <div class="profile-edit-projects">
    <!-- member -->
    <div class="form-group">
      <UserProjectsSearch :limit="projectsLimit" :member-roles="['owners', 'members']" :user="user">
        <template
          #default="{ items: projects, isLoading, totalCount, pagination, paginationAction }"
        >
          <label>{{ $t('profile.edit.projects.member.label') }} ({{ totalCount }})</label>
          <p class="notice">
            {{ $t('profile.edit.projects.member.notice') }}
          </p>
          <div class="project-list-wrapper">
            <UserProjectList
              :empty-label="$t('me.no-project-participate')"
              :limit="projectsLimit"
              :number-column="projectColumns"
              :projects="projects"
              :projects-loading="isLoading"
              :pagination="pagination"
              class="project-list"
              @pagination-changed="paginationAction"
            />
          </div>
        </template>
      </UserProjectsSearch>
    </div>
    <hr class="separator" />
    <!-- follow -->
    <div class="form-group">
      <UserProjectsSearch :key="followedProjectsKey" :limit="projectsLimit" follow :user="user">
        <template
          #default="{ items: projects, isLoading, totalCount, pagination, paginationAction }"
        >
          <div class="label-wrapper">
            <label>{{ $t('profile.edit.projects.followed.label') }} ({{ totalCount }})</label>
            <LpiButton
              :label="$t('profile.edit.projects.followed.add')"
              btn-icon="Plus"
              @click="showFollowProjectDrawer = true"
            />
          </div>
          <p class="notice">
            {{ $t('profile.edit.projects.followed.notice') }}
          </p>
          <div class="project-list-wrapper">
            <UserProjectList
              :empty-label="$t('me.no-follow')"
              :limit="projectsLimit"
              :number-column="projectColumns"
              :projects="projects"
              :projects-loading="isLoading"
              :pagination="pagination"
              class="project-list"
              @pagination-changed="paginationAction"
            />
          </div>
        </template>
      </UserProjectsSearch>
    </div>
    <hr class="separator" />
    <!-- review -->
    <div class="form-group">
      <UserProjectsSearch :limit="projectsLimit" :member-roles="['reviewers']" :user="user">
        <template
          #default="{ items: projects, isLoading, totalCount, pagination, paginationAction }"
        >
          <label>{{ $t('profile.edit.projects.reviewed.label') }} ({{ totalCount }})</label>
          <p class="notice">
            {{ $t('profile.edit.projects.reviewed.notice') }}
          </p>
          <div class="project-list-wrapper">
            <UserProjectList
              :empty-label="$t('me.no-project-reviewing')"
              :limit="projectsLimit"
              :number-column="projectColumns"
              :projects="projects"
              :projects-loading="isLoading"
              :pagination="pagination"
              class="project-list"
              @pagination-changed="paginationAction"
            />
          </div>
        </template>
      </UserProjectsSearch>
    </div>

    <hr class="separator" />
    <!-- followed categories -->
    <div class="form-group follower-categories">
      <div class="label-wrapper">
        <label>
          {{ $t('profile.edit.categories.followed.label') }}
          ({{ followedCategories.length }})
        </label>
      </div>
      <p class="notice">
        {{ $t('profile.edit.categories.followed.notice') }}
      </p>
      <div class="category-list-wrapper">
        <CategoryCard
          v-for="category in followedCategories"
          :key="category.id"
          :category="category"
          class="category-card"
        />
        <EmptyCard
          v-if="!followedCategories.length"
          class="empty-card"
          :label="$t('profile.edit.categories.followed.empty')"
        />
      </div>
    </div>
  </div>
  <ChooseFollowedProjectsDrawer
    :is-opened="showFollowProjectDrawer"
    :target-user-id="user.id"
    @close="closeFollowProjectDrawer"
  />
</template>
<script>
import useUsersStore from '@/stores/useUsers.ts'
import useProjectCategories from '@/stores/useProjectCategories.ts'
export default {
  name: 'ProfileProjectsEditTab',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  emits: ['profile-edited'],
  setup() {
    const usersStore = useUsersStore()
    const projectCategoriesStore = useProjectCategories()
    return {
      usersStore,
      projectCategoriesStore,
    }
  },
  data() {
    return {
      showFollowProjectDrawer: false,
      projectsLimit: 12,
      projectColumns: 4,
      followedProjectsKey: 1,
    }
  },
  computed: {
    followedCategories() {
      return (this.usersStore.followedCategories || [])
        .map((f) => this.projectCategoriesStore.allByIds[f.category.id])
        .filter((c) => !!c)
    },
  },
  methods: {
    closeFollowProjectDrawer() {
      this.showFollowProjectDrawer = false
      // this will trigger followed projects reload
      this.followedProjectsKey++
    },
  },
}
</script>
<style scoped lang="scss">
@import './profile-form';

.project-list-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: $space-2xl 0 $space-l 0;

  .title {
    font-size: $font-size-l;
    font-weight: 700;
    color: $primary-dark;
    margin: 0;
  }
}

.category-list-wrapper {
  display: flex;
  gap: 1rem;
  flex-flow: row wrap;
  margin-top: 2rem;
}
</style>
