<template>
  <div class="goal-ctn">
    <div class="goal">
      <div class="content">
        <div v-if="goal.status !== 'na'" class="left skeletons-text" :class="`goal-${goal.status}`">
          {{ $t(`status.${goal.status}`) }}
        </div>

        <div class="right">
          <div class="main-content">
            <p class="goal-title skeletons-text">
              {{ goal.$t.title }}
            </p>

            <p v-if="deadlineVisible" class="goal-deadline skeletons-text" :class="goal.status">
              {{ deadlineFormatted }}
            </p>
          </div>
          <ContentExpandable :description="goal.$t.description" :height-limit="30" />
        </div>
      </div>

      <div class="actions-btns">
        <ContextActionMenuInline
          :can-delete="canDelete"
          :can-edit="canEdit"
          @edit="editGoal"
          @delete="deleteGoal"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TranslatedGoal } from '~/models/goal.model'

import { formatDate } from '~/functs/date'

const props = withDefaults(
  defineProps<{
    goal: TranslatedGoal
    canEdit?: boolean
    canDelete?: boolean
  }>(),
  {
    canEdit: false,
    canDelete: false,
  }
)

const { t, locale } = useNuxtI18n()

const emit = defineEmits<{
  edit: [any]
  delete: [any]
}>()

const deadlineVisible = computed(() => {
  return props.goal.deadline_at && props.goal.status !== 'na' && props.goal.status !== 'cancel'
})

const deadlineFormatted = computed(() => {
  return `${
    props.goal.status === 'complete' ? t('goal.completed-on-the') : t('goal.planned-for-the')
  } ${formatDate(new Date(props.goal.deadline_at), locale.value)}`
})

const editGoal = () => emit('edit', props.goal)
const deleteGoal = () => emit('delete', props.goal)
</script>

<style lang="scss" scoped>
.goal-ctn {
  .goal {
    position: relative;
    outline: $border-width-s solid var(--black); // outline is crisper than border
    border-radius: $border-radius-l;
    background: var(--white);
    transform: scale3d(1, 1, 1); // fix rounding pixel glitch
    &.shadow-box {
      cursor: pointer;
    }

    .content {
      display: flex;
      min-height: 100px;

      .left {
        writing-mode: tb-rl;
        transform: rotate(-180deg);
        text-align: center;
        padding: $space-m;
        box-sizing: border-box;
        font-size: $font-size-s;
        font-weight: 500;
        border-top-right-radius: $border-radius-l;
        border-bottom-right-radius: $border-radius-l;
      }

      .right {
        padding: $space-s $space-l;
        box-sizing: border-box;
        width: 20rem; // dummy value to fix layout issues
        flex-grow: 1;

        .main-content {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: 100px;

          p {
            margin: 0;
          }

          .goal-title {
            font-size: $font-size-l;
            font-weight: 900;
          }
        }
      }
    }

    .actions-btns {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      display: flex;
      align-items: center;

      > button:nth-child(2) {
        margin-left: $space-m;
      }
    }
  }
}
</style>
