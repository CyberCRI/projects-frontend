<template>
  <div class="goal">
    <div
      v-if="statusIconVisible"
      :class="{ completed: goal.status === 'complete', ongoing: goal.status === 'ongoing' }"
      class="status-ctn"
    >
      <span class="status">{{ goal.status }}</span>
    </div>

    <div class="goal-title">
      {{ goal.title }}
    </div>

    <div v-if="goal.deadline_at" class="deadline">
      {{ $d(new Date(goal.deadline_at)) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoalSummaryItem',

  props: {
    goal: {
      type: Object,
      required: true,
    },
  },

  computed: {
    statusIconVisible() {
      return this.goal.status && this.goal.status !== 'na' && this.goal.status !== 'cancel'
    },
  },
}
</script>

<style lang="scss" scoped>
.goal {
  display: flex;
  overflow: hidden;
  border-radius: $border-radius-m;
  border: $border-width-s solid $primary-dark;
  color: $primary-dark;
  font-weight: bold;
  background: $primary-lighter;

  > div {
    padding: $space-xs;
  }

  .status-ctn {
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: $border-width-s solid $primary-dark;
    flex: 0 0 10em;

    svg {
      width: pxToRem(10px);
      height: pxToRem(10px);
    }

    &.completed {
      background: $primary;
      color: $white;

      svg {
        fill: $black;
      }
    }

    &.ongoing {
      background: $white;

      svg {
        fill: $black;
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
    border-left: $border-width-s solid $primary-dark;
  }
}
</style>
