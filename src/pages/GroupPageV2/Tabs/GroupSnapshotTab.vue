<template>
  <div class="group-snapshot">
    <GroupHeaderV2
      :title="group.$t.name"
      :image="group.header_image"
      :visibility="group.publication_status"
      :email="group.email"
      :short-description="group.$t.short_description"
      :is-loading="isLoading"
    />
    <SubGroups v-if="group.children?.length" :subgroups="group.children" :is-loading="isLoading" />
    <div class="description">
      <DescriptionExpandable
        :description="group.$t.description"
        :height-limit="400"
        class="description-content"
      />
      <!-- add new modules Here -->
      <div class="group-modules-list" data-test="group-modules">
        <GroupProjectsPreview
          v-if="groupModules.featured_projects"
          :group="group"
          :is-loading="isLoading"
        />
        <GroupMembersPreview v-if="groupModules.members" :group="group" :is-loading="isLoading" />
        <GroupDocumentsPreview
          v-if="groupModules.publications"
          document-type="publications"
          :group="group"
          :is-loading="isLoading"
        />
        <GroupDocumentsPreview
          v-if="groupModules.conferences"
          document-type="publications"
          :group="group"
          :is-loading="isLoading"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import GroupProjectsPreview from '@/pages/GroupPageV2/Tabs/Projects/GroupProjectsPreview.vue'
import GroupMembersPreview from '@/pages/GroupPageV2/Tabs/Members/GroupMembersPreview.vue'
import GroupDocumentsPreview from '@/pages/GroupPageV2/Tabs/Documents/GroupDocumentsPreview.vue'

defineOptions({ name: 'GroupSnapshotTab' })
const props = defineProps<{
  group: TranslatedPeopleGroupModel
  isLoading: boolean
}>()

// filters only modules with upper than zero elements
const groupModules = computed(() => {
  if (!props.group || !props.group.modules) {
    return {
      featured_projects: 0,
      members: 0,
      publications: 0,
      conferences: 0,
    }
  }
  return props.group.modules
})
</script>

<style lang="scss" scoped>
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
.group-modules-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
