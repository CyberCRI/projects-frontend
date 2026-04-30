<template>
  <div v-if="usersStore.isConnected" class="follow-parent">
    <div class="follow-container">
      <Transition name="follow">
        <button
          v-if="!followed"
          key="follow"
          class="follow-icon skeletons-background"
          tabindex="1"
          :title="followLabel || $t('follow.follow')"
          @click="$emit('follow')"
        >
          <IconImage name="BookmarkLine" class="icon" />
        </button>
        <button
          v-else
          key="unfollow"
          class="follow-icon skeletons-background"
          tabindex="1"
          :title="unfollowLabel || $t('follow.unfollow')"
          @click="$emit('unfollow')"
        >
          <IconImage class="icon" name="BookmarkFill" />
        </button>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import useUsersStore from '~/stores/useUsers'

withDefaults(
  defineProps<{
    followed?: boolean
    followLabel?: string
    unfollowLabel?: string
  }>(),
  {
    followed: false,
    followLabel: null,
    unfollowLabel: null,
  }
)

const usersStore = useUsersStore()
defineEmits<{
  follow: []
  unfollow: []
}>()
</script>

<style lang="scss" scoped>
.icon {
  fill: var(--primary-dark);
  cursor: pointer;
}

.follow-enter-active,
.follow-leave-to {
  opacity: 0;
  transform: scale(180%);
}

.follow-enter-to {
  opacity: 1;
  transform: scale(100%);
}

.follow-leave {
  opacity: 0;
}

.follow-icon {
  transition: all 0.3s;
  position: absolute;
  left: 0;
  top: 0;

  &:hover {
    transform: scale(110%);
  }
}

.follow-container {
  position: relative;
}

.follow-parent {
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: center;
}
</style>
