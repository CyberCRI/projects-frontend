<template>
  <div class="group-snapshot">
    <GroupHeaderV2
      :title="groupData.$t.name"
      :image="groupData.header_image"
      :visibility="groupData.publication_status"
      :email="groupData.email"
      :short-description="groupData.$t.short_description"
      :is-loading="isLoading"
    />
    <SubGroups
      v-if="groupData.children.length > 0"
      :subgroups="groupData.children"
      :is-loading="isLoading"
    />
    <div v-if="!isLoading" class="description">
      <DescriptionExpandable
        :description="groupData.$t.description"
        :height-limit="400"
        class="description-content"
      />
    </div>
    <div v-else class="skeleton">
      <SkeletonComponent width="60%" height="25px" border-radius="10px" />
      <SkeletonComponent width="80%" height="20px" border-radius="10px" />
      <SkeletonComponent width="45%" height="20px" border-radius="10px" />
      <SkeletonComponent width="100%" height="15px" border-radius="10px" />
      <SkeletonComponent width="90%" height="15px" border-radius="10px" />
      <SkeletonComponent width="95%" height="15px" border-radius="10px" />
    </div>

    <div v-if="projectsCount > 0 || isProjectsLoading" class="projects">
      <div class="projects-header">
        <h2 class="title">
          {{ $t('group.projects') }}
          <span v-if="projectsCount">( {{ projectsCount }} )</span>
        </h2>
        <SeeMoreArrow
          v-if="!isProjectsLoading"
          class="see-more-button"
          :to="{
            name: 'groupProjects',
            params: { groupId: $route.params.groupId },
          }"
        />
      </div>
      <div class="projects-container">
        <CardList :is-loading="isProjectsLoading" :items="projects.slice(0, totalDisplayed)">
          <template #default="projectListSlotProps">
            <ProjectCard :horizontal-display="true" :project="projectListSlotProps.item" />
          </template>
        </CardList>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'GroupSnapshotTab' })
const props = defineProps<{
  groupData: any
  isLoading: boolean
}>()
const { translateUsers, translateProjects } = useAutoTranslate()

const style = ref({})
const totalDisplayed = ref(12)
const profileDrawer = ref({
  isOpened: false,
  user_id: null,
})

const openProfileDrawer = async (user) => {
  this.profileDrawer.user_id = user.id
  this.profileDrawer.isOpened = true
}

const closeProfileDrawer = () => {
  this.isEditMode = false
  this.profileDrawer.isOpened = false
  this.profileDrawer.user_id = null
}
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
