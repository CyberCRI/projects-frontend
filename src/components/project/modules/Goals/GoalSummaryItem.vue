<template>
  <NuxtLink
    class="goal scale-hover"
    :to="{
      name: 'projectGoals',
      params: { slugOrId: project.slug || project.id },
      hash: `#goal:${goal.id}`,
    }"
  >
    <div v-if="statusIconVisible" :class="`goal-${goal.status}`" class="status-ctn">
      <span class="status skeletons-text">{{ goal.status }}</span>
    </div>

    <div class="goal-title skeletons-text">
      {{ goal.$t.title }}
    </div>

    <div v-if="deadlineAt" class="deadline skeletons-text">
      {{ deadlineAt }}
    </div>

    <ContextActionMenuInline
      class="actions"
      :can-delete="canDelete"
      :can-edit="canEdit"
      @delete="$emit('delete')"
      @edit="$emit('edit')"
    />
  </NuxtLink>
</template>

<script setup lang="ts">
import ContextActionMenuInline from '~/components/base/button/ContextActionMenuInline.vue'
import type { TranslatedProject } from '~/models/project.model'
import type { TranslatedGoal } from '@/models/goal.model'
import { formatDate } from '@/functs/date'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    goal: TranslatedGoal
    canDelete?: boolean
    canEdit?: boolean
  }>(),
  {
    canDelete: false,
    canEdit: false,
  }
)

defineEmits<{
  edit: []
  delete: []
}>()

const { locale } = useNuxtI18n()

const statusIconVisible = computed(() => {
  return props.goal.status && props.goal.status !== 'na' && props.goal.status !== 'cancel'
})

const deadlineAt = computed(() =>
  props.goal.deadline_at ? formatDate(props.goal.deadline_at, locale.value) : null
)
</script>

<style lang="scss" scoped>
.goal {
  position: relative;
  display: flex;
  border-radius: $border-radius-m;
  border: $border-width-s solid var(--primary-dark);
  color: var(--primary-dark);
  font-weight: bold;
  background: var(--primary-lighter);
  overflow: hidden;

  > div {
    padding: $space-xs;
  }

  .status-ctn {
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: $border-width-s solid var(--primary-dark);
    flex: 0 0 10em;

    svg {
      width: pxToRem(10px);
      height: pxToRem(10px);
    }

    &.completed {
      background: var(--primary);
      color: var(--white);

      svg {
        fill: var(--black);
      }
    }

    &.ongoing {
      background: var(--white);

      svg {
        fill: var(--black);
      }
    }
  }

  .goal-title {
    text-transform: uppercase;
    font-size: $font-size-2xs;
    display: flex;
    align-items: center;
    width: 100%;
    flex-grow: 1;
  }

  .deadline {
    font-size: $font-size-xs;
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: $border-width-s solid var(--primary-dark);
  }
}

.actions {
  position: absolute;
  top: 0;
  right: 0;
  margin: -1rem 0;
}
</style>
