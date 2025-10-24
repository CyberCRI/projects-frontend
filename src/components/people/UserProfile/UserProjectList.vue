<template>
  <div>
    <CardList
      :desktop-columns-number="numberColumn"
      :is-loading="projectsLoading"
      :limit="limit"
      :items="projects"
    >
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

<script setup>
import CardList from '@/components/base/CardList.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import EmptyCard from './EmptyCard.vue'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'

defineOptions({ name: 'UserProjectList' })

const props = defineProps({
  projects: {
    // use this to pass project list (without making a request here)
    type: [Array, Boolean],
    required: true,
  },

  projectsLoading: {
    type: Boolean,
    default: false,
  },

  emptyLabel: {
    type: String,
    default: null,
  },

  numberColumn: {
    type: Number,
    default: 4,
  },

  limit: {
    type: Number,
    default: 12,
  },
  pagination: {
    type: [Object, null],
    default: null,
  },
})

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
