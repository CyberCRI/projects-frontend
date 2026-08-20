<script setup lang="ts">
import ProfileDescription from '~/components/profile/modules/ProfileDescription.vue'
import ProfileResources from '~/components/profile/modules/ProfileResources.vue'
import ProfileDocuments from '~/components/profile/modules/ProfileDocuments.vue'
import ProfileProjects from '~/components/profile/modules/ProfileProjects.vue'
import ProfileSkills from '~/components/profile/modules/ProfileSkills.vue'
import ProfileGroups from '~/components/profile/modules/ProfileGroups.vue'
import ProfileHeader from '~/components/profile/Headers/ProfileHeader.vue'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { textIsEmpty } from '@/functs/tiptap'

const props = defineProps<{
  user: TranslatedUserModel
}>()

const descripitonEmpty = computed(() => textIsEmpty(props.user.$t.description))
</script>

<template>
  <div class="user-summary">
    <ProfileHeader :user="user" class="user-header v2" />
    <ProfileDescription v-if="!descripitonEmpty" :user="user" />

    <ProfileSkills v-if="user.modules.skills" :user="user" />
    <ProfileProjects v-if="user.modules.projects" :user="user" />
    <ProfileGroups v-if="user.modules.groups" :user="user" />

    <!-- researcher -->
    <ProfileDocuments v-if="user.modules.publications" document-type="publications" :user="user" />
    <ProfileDocuments v-if="user.modules.conferences" document-type="conferences" :user="user" />

    <ProfileResources v-if="user.modules.files || user.modules.links" :user="user" />
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.user-summary {
  display: flex;
  flex-flow: column;
  gap: 1rem;
}
</style>
