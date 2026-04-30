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

    <div v-if="followedCategories.length" class="follower-categories">
      <div class="project-list-header">
        <h4 class="title">
          {{ $t('me.follow-category') }}
          <span>({{ followedCategories.length }})</span>
        </h4>
      </div>
      <div class="category-list-wrapper">
        <CategoryCard
          v-for="category in followedCategories"
          :key="category.id"
          :category="category"
          class="category-card"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TranslatedUserModel } from '~/models/user.model'

import UserProjectsSearch from '~/components/people/UserProfile/UserProjectsSearch.vue'
import UserProjectList from '~/components/people/UserProfile/UserProjectList.vue'
import LpiButton from '~/components/base/button/LpiButton.vue'

import useProjectCategories from '~/stores/useProjectCategories'
import useUsersStore from '~/stores/useUsers'

const props = defineProps<{
  user: TranslatedUserModel
}>()

const { t } = useNuxtI18n()

const usersStore = useUsersStore()
const { canCreateProject } = usePermissions()
const projectCategoriesStore = useProjectCategories()

const followedCategories = computed(() => {
  return (usersStore.followedCategories || [])
    .map((f) => projectCategoriesStore.allByIds[f.category.id])
    .filter((c) => !!c)
})

const isMyProfileAndCanCreateProject = computed(() => {
  const loggedAsID = usersStore.id
  return loggedAsID && props.user.id === loggedAsID && canCreateProject.value
})

const isCurrentUser = computed(() => {
  return usersStore.id === props.user.id
})

const noFollowLabel = computed(() => {
  return isCurrentUser.value ? t('me.no-follow') : t('you.no-follow')
})

const noReviewLabel = computed(() => {
  return isCurrentUser.value ? t('me.no-project-reviewing') : t('you.no-project-reviewing')
})

const noParticipate = computed(() => {
  return isCurrentUser.value ? t('me.no-project-participate') : t('you.no-project-participate')
})
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

.category-list-wrapper {
  display: flex;
  gap: 1rem;
  flex-flow: row wrap;
}
</style>
