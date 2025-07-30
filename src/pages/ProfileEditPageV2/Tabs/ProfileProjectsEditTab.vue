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
  </div>
  <ChooseFollowedProjectsDrawer
    :is-opened="showFollowProjectDrawer"
    :target-user-id="user.id"
    @close="closeFollowProjectDrawer"
  />
</template>
<script>
export default {
  name: 'ProfileProjectsEditTab',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  emits: ['profile-edited'],
  data() {
    return {
      showFollowProjectDrawer: false,
      projectsLimit: 12,
      projectColumns: 4,
      followedProjectsKey: 1,
    }
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
</style>
