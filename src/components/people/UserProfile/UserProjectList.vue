<template>
  <div>
    <CardList :is-loading="projectsLoading" :limit="limit" :items="projects">
      <template #default="projectListSlotProps">
        <ProjectCard
          v-if="projectListSlotProps.item"
          :horizontal-display="true"
          :project="projectListSlotProps.item"
          @card-update="emit('card-update')"
        />
      </template>
      <template #empty>
        <div class="empty-ctn" :class="gridLayout">
          <EmptyCard class="empty-card" :label="emptyLabel" />
        </div>
      </template>
    </CardList>
    <div v-if="pagination?.total > 1 && !projectsLoading" class="project-list-pagination">
      <PaginationButtons
        :current="pagination.currentPage"
        :pagination="pagination"
        :total="pagination.total"
        @update-pagination="emit('pagination-changed', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import CardList from '~/components/base/CardList.vue'
import ProjectCard from '~/components/project/ProjectCard.vue'
import EmptyCard from './EmptyCard.vue'
import { TranslatedProject } from '~/models/project.model'

const props = withDefaults(
  defineProps<{
    // use this to pass project list (without making a request here)
    projects: TranslatedProject[]
    projectsLoading?: boolean
    emptyLabel?: string
    numberColumn?: number
    limit?: number
    pagination?: any
  }>(),
  {
    projectsLoading: false,
    emptyLabel: null,
    numberColumn: 4,
    limit: 12,
    pagination: null,
  }
)

const emit = defineEmits(['card-update', 'pagination-changed'])
const gridLayout = computed(() => `desktop-col--${props.numberColumn}`)
</script>

<style lang="scss" scoped>
.empty-ctn {
  display: grid;
  justify-items: center;
  justify-content: left;
  grid-template-columns: $card_width;
}

.project-list-pagination {
  padding-top: $space-l;
  padding-bottom: $space-2xl;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
