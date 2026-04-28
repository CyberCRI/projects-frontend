<template>
  <div class="profile-summary">
    <!-- Profile Header -->
    <ProfileHeaderV2 class="profile-header" :user="user" />

    <div v-if="user.description">
      <!-- User descriptions -->
      <UserDescriptions :is-limited="true" :user="user" class="user-description unboxed" />
    </div>

    <div>
      <SkillSummary :user="user" class="unboxed" />
    </div>
    <div class="lists">
      <!-- publications -->

      <UserProjectsSearch v-if="documentsCount.publications" :limit="DOCUMENTS_LIMIT" :user="user">
        <template #default>
          <div class="project-list-header">
            <h4 class="title">
              {{ $t('me.publications') }}
              <span>({{ documentsCount.publications }})</span>
            </h4>
            <SeeMoreArrow
              v-if="documentsCount.publications > DOCUMENTS_LIMIT"
              data-test="see-more"
              :to="{ name: 'ResearcherPublicationsOther', params: { userId: user.id } }"
            />
          </div>
          <OwnResearcherDocumentsList
            doc-type="publications"
            preview
            :limit="DOCUMENTS_LIMIT"
            :user="user"
          />
        </template>
      </UserProjectsSearch>

      <UserProjectsSearch v-if="documentsCount.conferences" :limit="DOCUMENTS_LIMIT" :user="user">
        <template #default>
          <div class="project-list-header">
            <h4 class="title">
              {{ $t('me.conferences') }}
              <span>({{ documentsCount.conferences }})</span>
            </h4>
            <SeeMoreArrow
              v-if="documentsCount.conferences > DOCUMENTS_LIMIT"
              data-test="see-more"
              :to="{ name: 'ResearcherConferencesOther', params: { userId: user.id } }"
            />
          </div>
          <OwnResearcherDocumentsList
            doc-type="conferences"
            preview
            :limit="DOCUMENTS_LIMIT"
            :user="user"
          />
        </template>
      </UserProjectsSearch>

      <!-- user projects (Owners, Members) -->
      <UserProjectsSearch :limit="LIST_LIMIT" :member-roles="['owners', 'members']" :user="user">
        <template #default="{ items: projects, isLoading, totalCount }">
          <template v-if="totalCount">
            <div class="project-list-header">
              <h4 class="title">
                {{ $t('me.projects-participate') }}
                <span>({{ totalCount }})</span>
              </h4>
              <SeeMoreArrow
                v-if="totalCount > LIST_LIMIT"
                data-test="see-more"
                @click.prevent="goToProfileProjects"
              />
            </div>
            <UserProjectList
              :empty-label="noParticipate"
              :limit="LIST_LIMIT"
              :number-column="LIST_LIMIT"
              :projects="projects"
              :projects-loading="isLoading"
              class="project-list"
            />
          </template>
        </template>
      </UserProjectsSearch>
      <!-- user projects (Reviewers) -->
      <UserProjectsSearch :member-roles="['reviewers']" :user="user">
        <template #default="{ items: projects, isLoading, totalCount }">
          <template v-if="totalCount">
            <div class="project-list-header">
              <h4 class="title">
                {{ $t('me.projects-reviewing') }}
                <span>({{ totalCount }})</span>
              </h4>
              <SeeMoreArrow
                v-if="totalCount > LIST_LIMIT"
                data-test="see-more"
                @click.prevent="goToProfileProjects"
              />
            </div>
            <UserProjectList
              :empty-label="noReviewLabel"
              :limit="LIST_LIMIT"
              :number-column="LIST_LIMIT"
              :projects="projects"
              :projects-loading="isLoading"
              class="project-list"
            />
          </template>
        </template>
      </UserProjectsSearch>
      <!-- user projects (Followed) -->
      <UserProjectsSearch :limit="LIST_LIMIT" follow :user="user">
        <template #default="{ items: projects, isLoading, totalCount }">
          <template v-if="totalCount">
            <div class="project-list-header">
              <h4 class="title">
                {{ $t('me.follow') }}
                <span>({{ totalCount }})</span>
              </h4>
              <SeeMoreArrow
                v-if="totalCount > LIST_LIMIT"
                data-test="see-more"
                @click.prevent="goToProfileProjects"
              />
            </div>
            <UserProjectList
              :empty-label="noFollowLabel"
              :number-column="LIST_LIMIT"
              :projects="projects"
              :projects-loading="isLoading"
              class="project-list"
            />
          </template>
        </template>
      </UserProjectsSearch>
      <!-- user resources -->
      <UserProjectsSearch v-if="resourcesCount" :user="user">
        <template #default>
          <ResourcesRecap
            class="unboxed"
            :files="user.resources.files"
            :links="user.resources.links"
            :target="{
              name: 'ProfileResourcesOther',
              params: { userId: user.id },
            }"
            :redirect="{
              name: 'ProfileResourcesOther',
              params: { userId: user.id },
              hash: '#tab',
            }"
          />
        </template>
      </UserProjectsSearch>
    </div>
    <div class="skills-mobile">
      <SkillSummary :user="user" />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserProjectsSearch from '~/components/people/UserProfile/UserProjectsSearch.vue'
import UserProjectList from '~/components/people/UserProfile/UserProjectList.vue'
import UserDescriptions from '~/components/people/UserDescriptions.vue'
import SkillSummary from '~/components/people/skill/SkillSummary.vue'
import useUsersStore from '~/stores/useUsers'
import SeeMoreArrow from '~/components/base/button/SeeMoreArrow.vue'
import OwnResearcherDocumentsList from '~/components/people/Researcher/OwnResearcherDocumentsList.vue'
import { TranslatedUserModel } from '~/models/user.model'

const selectTab = inject<(number) => void>('tabsLayoutSelectTab', () => {})

const props = defineProps<{
  user: TranslatedUserModel
}>()
const { t } = useNuxtI18n()

const usersStore = useUsersStore()

const LIST_LIMIT = 6
const DOCUMENTS_LIMIT = 3

const resourcesCount = computed(() => {
  return props.user.resources.files + props.user.resources.links
})
const documentsCount = computed(
  () =>
    props.user.researcher?.documents ?? {
      publications: 0,
      conferences: 0,
    }
)
const isCurrentUser = computed(() => usersStore.id === props.user.id)

const noFollowLabel = computed(() => {
  return isCurrentUser.value ? t('me.no-follow') : t('you.no-follow')
})

const noReviewLabel = computed(() => {
  return isCurrentUser.value ? t('me.no-project-reviewing') : t('you.no-project-reviewing')
})

const noParticipate = computed(() => {
  return isCurrentUser.value ? t('me.no-project-participate') : t('you.no-project-participate')
})

const goToProfileProjects = () => selectTab(2)
</script>

<style lang="scss" scoped>
.unboxed {
  border: 0 none !important;
  border-radius: 0 !important;
  padding: $space-l 0 !important;
  background: transparent !important;
}

:deep(.unboxed .section-header) {
  justify-content: space-between !important;
}

.profile-summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .project-list {
    width: 100%;
  }

  .user-description {
    margin-top: $space-42;
  }

  .lists {
    padding: 0;
  }

  .skills-mobile {
    display: none;
  }
}

@media screen and (max-width: $max-tablet) {
  .profile-summary {
    padding: $space-s;

    .skills-mobile {
      display: block;
    }
  }

  .profile-summary .top {
    flex-direction: column;

    .right {
      display: none;
    }

    .left {
      width: 100%;
      margin-right: 0;
      margin-bottom: $space-l;
    }

    .lists {
      padding: 0 $layout-size-2xs;
    }
  }
}

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

.empty-field {
  padding-top: $space-l;
  color: $mid-gray;
  font-weight: 700;
}
</style>
