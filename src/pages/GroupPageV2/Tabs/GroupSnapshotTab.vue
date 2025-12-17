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
    <div v-if="!isLoading" class="description">
      <DescriptionExpandable
        :description="group.$t.description"
        :height-limit="400"
        class="description-content"
      />
      <template v-for="([name], idx) in groupModules">
        <GroupMembersPreview v-if="name === 'members'" :key="`members-${idx}`" :group="group" />
        <GroupProjectsPreview
          v-else-if="name === 'featured_projects'"
          :key="`featured_projects-${idx}`"
          :group="group"
        />
      </template>
    </div>
    <div v-else class="skeleton">
      <SkeletonComponent width="60%" height="25px" border-radius="10px" />
      <SkeletonComponent width="80%" height="20px" border-radius="10px" />
      <SkeletonComponent width="45%" height="20px" border-radius="10px" />
      <SkeletonComponent width="100%" height="15px" border-radius="10px" />
      <SkeletonComponent width="90%" height="15px" border-radius="10px" />
      <SkeletonComponent width="95%" height="15px" border-radius="10px" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import GroupProjectsPreview from '@/pages/GroupPageV2/Tabs/previews/GroupProjectsPreview.vue'
import GroupMembersPreview from '@/pages/GroupPageV2/Tabs/previews/GroupMembersPreview.vue'

defineOptions({ name: 'GroupSnapshotTab' })
const props = defineProps<{
  group: TranslatedPeopleGroupModel
  isLoading: boolean
}>()

// filters only modules with upper than zero elements
const groupModules = computed(() => {
  if (!props.group || !props.group.modules) {
    return []
  }
  return Object.entries(props.group.modules).filter(([, count]) => count > 0)
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
</style>
