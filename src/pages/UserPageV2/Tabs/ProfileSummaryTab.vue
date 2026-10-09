<script setup lang="ts">
import ProfileResourcesPreview from '~/components/profile/modules/Resources/ProfileResourcesPreview.vue'
import ProfileDocumentsPreview from '~/components/profile/modules/Documents/ProfileDocumentsPreview.vue'
import ProfileProjectsPreview from '~/components/profile/modules/Projects/ProfileProjectsPreview.vue'
import ProfileSkillsPreview from '~/components/profile/modules/Skills/ProfileSkillsPreview.vue'
import ProfileGroupsPreview from '~/components/profile/modules/Groups/ProfileGroupsPreview.vue'
import ProfileBioPreview from '~/components/profile/modules/Bio/ProfileBioPreview.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { textIsEmpty } from '@/functs/tiptap'

const props = defineProps<{
  user: TranslatedUserModel
}>()

const bioEmpty = computed(() => textIsEmpty(props.user.$t.description))
</script>

<template>
  <div class="user-summary">
    <ProfileHeader :user="user" />

    <ResearcherBadgesPreview :user="user" />

    <div class="profile-row">
      <ResearcherPresentationPreview class="resarcher-presentaion" :user="user" />
      <ResearcherSimilarPreview class="resarcher-similar" :user="user" />
    </div>
    <ProfileBioPreview v-if="!bioEmpty && !user.researcher" :user="user" />

    <ResearcherTeamPreview :user="user" />
    <ResearcherAffiliatePreview :user="user" />
    <ProfileSkillsPreview v-if="user.modules.skills && !user.researcher" :user="user" />

    <ProfileProjectsPreview v-if="user.modules.projects" type="projects" :user="user" />
    <ProfileProjectsPreview
      v-if="user.modules.reviews_projects"
      type="reviews_projects"
      :user="user"
    />
    <ProfileProjectsPreview
      v-if="user.modules.follows_projects"
      type="follows_projects"
      :user="user"
    />
    <ProfileProjectsPreview
      v-if="user.modules.follows_categories"
      type="follows_categories"
      :user="user"
    />
    <ProfileGroupsPreview v-if="user.modules.groups" :user="user" />

    <ResearcherPublicationsPreview :user="user" />

    <div class="profile-row">
      <ResearcherDomainPreview class="researcher-domain" :user="user" />
      <ResearcherNetworkPreview class="researcher-network" :user="user" />
    </div>
    <!-- researcher -->
    <ProfileDocumentsPreview
      v-if="user.modules.publications"
      document-type="publications"
      :user="user"
    />
    <ProfileDocumentsPreview
      v-if="user.modules.conferences"
      document-type="conferences"
      :user="user"
    />

    <ProfileResourcesPreview v-if="user.modules.files || user.modules.links" :user="user" />

    <ResearcherPatentsPreview :user="user" />
    <ResearcherFundingsPreview :user="user" />

    <ResearcherPositionsPreview :user="user" />

    <ResearcherNeedsPreview :user="user" />
    <ResearcherAvailabilitiesPreview :user="user" />
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

$layout-gap: 1rem;

.user-summary {
  display: flex;
  flex-flow: column;
  gap: $layout-gap;
}

.profile-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: $layout-gap;
}
.resarcher-presentaion {
  grid-column: 1/6;
}
.resarcher-simalar {
  grid-column: 6;
}

.researcher-domain {
  grid-column: 1/3;
}
.researcher-network {
  grid-column: 3/7;
}
</style>
