<template>
  <div class="goal-ctn">
    <div class="goal" :class="{ 'shadow-box': hasDescription }" @click="toggleModal">
      <div class="content">
        <div class="left skeletons-text" :class="goal.status">
          {{ goal.status == 'na' ? '&nbsp;' : $t(`status.${goal.status}`) }}
        </div>

        <div class="right">
          <div class="main-content">
            <p class="goal-title skeletons-text">
              {{ goal.$t.title }}
            </p>

            <p v-if="deadlineVisible" class="goal-deadline skeletons-text" :class="goal.status">
              {{ deadlineFormatted }}
            </p>

            <span v-if="hasDescription" class="chevron-icon skeletons-background">
              <IconImage :name="stateModal ? 'ChevronUp' : 'ChevronDown'" />
            </span>
          </div>

          <div v-show="stateModal" class="goal-description-wrapper">
            <TipTapOutput
              class="goal-description-content skeletons-text"
              :content="goal.$t.description"
            />
          </div>
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

import TipTapOutput from '~/components/base/form/TextEditor/TipTapOutput.vue'
import IconImage from '~/components/base/media/IconImage.vue'

import { textIsEmpty } from '~/functs/string'
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

const { stateModal, toggleModal } = useModal()

const deadlineVisible = computed(() => {
  return props.goal.deadline_at && props.goal.status !== 'na' && props.goal.status !== 'cancel'
})

const deadlineFormatted = computed(() => {
  return `${
    props.goal.status === 'complete' ? t('goal.completed-on-the') : t('goal.planned-for-the')
  } ${formatDate(new Date(props.goal.deadline_at), locale.value)}`
})

const hasDescription = computed(() => !textIsEmpty(props.goal.description))

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
        background: var(--primary-lighter);
        color: var(--black);
        text-align: center;
        padding: $space-m;
        box-sizing: border-box;
        font-size: $font-size-s;
        font-weight: 500;
        border-top-right-radius: $border-radius-l;
        border-bottom-right-radius: $border-radius-l;

        &.complete {
          background: var(--primary);
        }

        &.ongoing {
          background: var(--primary-light);
        }

        &.cancel {
          background: var(--lighter-gray);
          color: var(--mid-gray);
        }
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

          .goal-deadline {
            font-size: $font-size-m;
            font-weight: 400;

            &.complete {
              color: var(--black);
            }

            &.ongoing {
              color: var(--black);
            }
          }

          .chevron-icon {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            cursor: pointer;
            fill: var(--primary-dark);
            align-self: center;
            transition: background-color 0.2s ease-in-out;

            &:hover {
              background-color: var(--primary-light);
            }
          }
        }
      }
    }

    .actions-btns {
      position: absolute;
      top: -15px;
      right: 30px;
      display: flex;
      align-items: center;

      > button:nth-child(2) {
        margin-left: $space-m;
      }
    }
  }
}

.goal-description-wrapper {
  padding-right: 2rem; // dirty fix for table overlow. TODO: fix in a cleaner way
}
</style>
