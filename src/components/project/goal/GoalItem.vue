<template>
  <div class="goal-ctn">
    <div class="goal" :class="{ 'shadow-box': hasDescription }" @click="toggleDescription">
      <div class="content">
        <div class="left" :class="goal.status">
          {{ $t(`status.${goal.status}`) }}
        </div>

        <div class="right">
          <div class="main-content">
            <p class="goal-title">
              {{ goal?.$t?.title }}
            </p>

            <p v-if="deadlineVisible" class="goal-deadline" :class="goal.status">
              {{ deadlineFormatted }}
            </p>

            <span v-if="hasDescription" class="chevron-icon">
              <IconImage v-if="descriptionVisible" name="ChevronUp" />
              <IconImage v-else name="ChevronDown" />
            </span>
          </div>

          <div v-show="descriptionVisible" class="goal-description-wrapper">
            <TipTapOutput class="goal-description-content" :content="goal?.$t?.description" />
          </div>
        </div>
      </div>

      <div class="actions-btns">
        <ContextActionButton v-if="canEditGoal" class="small" action-icon="Pen" @click="editGoal" />

        <ContextActionButton
          v-if="canDeleteGoal"
          class="small"
          action-icon="Close"
          @click="deleteGoal"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ContextActionButton from '@/components/base/button/ContextActionButton.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import TipTapOutput from '@/components/base/form/TextEditor/TipTapOutput.vue'

export default {
  name: 'GoalItem',

  components: { ContextActionButton, IconImage, TipTapOutput },

  mixins: ['permissions'],

  props: {
    goal: {
      type: Object,
      default: () => {},
    },

    canEditGoal: {
      type: Boolean,
      default: false,
    },

    canDeleteGoal: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['edit-goal', 'delete-goal'],
  data() {
    return {
      descriptionVisible: false,
    }
  },

  computed: {
    deadlineVisible() {
      return this.goal.deadline_at && this.goal.status !== 'na' && this.goal.status !== 'cancel'
    },

    deadlineFormatted() {
      return `${
        this.goal.status === 'complete'
          ? this.$t('goal.completed-on-the')
          : this.$t('goal.planned-for-the')
      } ${this.$d(new Date(this.goal.deadline_at))}`
    },

    hasDescription() {
      return this.goal.description && this.goal.description != '<p></p>'
    },
  },

  methods: {
    editGoal() {
      this.$emit('edit-goal', this.goal)
    },

    deleteGoal() {
      this.$emit('delete-goal', this.goal)
    },

    toggleDescription() {
      this.descriptionVisible = !this.descriptionVisible
    },
  },
}
</script>

<style lang="scss" scoped>
.goal-ctn {
  .goal {
    position: relative;
    outline: $border-width-s solid $black; // outline is crisper than border
    border-radius: $border-radius-l;
    background: $white;
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
        background: $primary-lighter;
        color: $black;
        text-align: center;
        padding: $space-m;
        box-sizing: border-box;
        font-size: $font-size-s;
        font-weight: 500;
        border-top-right-radius: $border-radius-l;
        border-bottom-right-radius: $border-radius-l;

        &.complete {
          background: $primary;
        }

        &.ongoing {
          background: $primary-light;
        }

        &.cancel {
          background: $lighter-gray;
          color: $mid-gray;
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
              color: $black;
            }

            &.ongoing {
              color: $black;
            }
          }

          .chevron-icon {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            cursor: pointer;
            fill: $primary-dark;
            align-self: center;
            transition: background-color 0.2s ease-in-out;

            &:hover {
              background-color: $primary-light;
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
