<template>
  <div class="profile-edit-projects">
    <!-- member -->
    <div class="form-group">
      <UserProjectsSearch
        :limit="PROJECTS_LIMIT"
        :member-roles="['owners', 'members']"
        :user="user"
      >
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
              :limit="PROJECTS_LIMIT"
              :number-column="PROJECTS_COLUMNS"
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
      <UserProjectsSearch :key="followedProjectsKey" :limit="PROJECTS_LIMIT" follow :user="user">
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
              :limit="PROJECTS_LIMIT"
              :number-column="PROJECTS_COLUMNS"
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
      <UserProjectsSearch :limit="PROJECTS_LIMIT" :member-roles="['reviewers']" :user="user">
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
              :limit="PROJECTS_LIMIT"
              :number-column="PROJECTS_COLUMNS"
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

<script setup lang="ts">
import useUsersStore from '~/stores/useUsers'
import useProjectCategories from '~/stores/useProjectCategories'
import { UserModel } from '~/models/user.model'

const PROJECTS_LIMIT = 12
const PROJECTS_COLUMNS = 4

defineProps<{
  user: UserModel
}>()

defineEmits<{
  'profile-edited': []
}>()

const usersStore = useUsersStore()
const projectCategoriesStore = useProjectCategories()
const showFollowProjectDrawer = ref(false)
const followedProjectsKey = ref(1)

const followedCategories = computed(() => {
  return (usersStore.followedCategories || [])
    .map((f) => projectCategoriesStore.allByIds[f.category.id])
    .filter((c) => !!c)
})

const closeFollowProjectDrawer = () => {
  showFollowProjectDrawer.value = false
  // this will trigger followed projects reload
  followedProjectsKey.value++
}
</script>

<style scoped lang="scss">
@import './profile-form';

.category-list-wrapper {
  display: flex;
  gap: 1rem;
  flex-flow: row wrap;
  margin-top: 2rem;
}
</style>
