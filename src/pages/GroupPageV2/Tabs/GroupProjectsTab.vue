<template>
  <div class="group-projects">
    <div class="projects">
      <div class="projects-header">
        <h2 class="title">
          {{ $t('group.group-projects') }}
          <span v-if="!isLoading">( {{ count }} )</span>
        </h2>
      </div>
      <div class="projects-container">
        <CardList :is-loading="isLoading" :items="data">
          <template #default="projectListSlotProps">
            <ProjectCard :project="projectListSlotProps.item" />
          </template>
        </CardList>
        <div v-if="total > 1" class="pagination-container">
          <PaginationButtons2 :pagination="pagination" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CardList from '@/components/base/CardList.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'

import { getGroupProject } from '@/api/groups.service'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

defineOptions({ name: 'GroupMembersTab' })

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const { translateProjects } = useAutoTranslate()
const organizationCode = useOrganizationCode()
const key = computed(() => `group-${props.group.id}-projects-tabs`)
const { data, isLoading, pagination } = useAsyncPaginationAPI(
  key,
  ({ config }) => getGroupProject(organizationCode, props.group.id, config),
  {
    translate: translateProjects,
  }
)
const { total, count } = pagination
</script>

<style lang="scss" scoped>
.group-projects {
  .projects {
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

  .pagination-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: $space-xl;
  }
}
</style>
