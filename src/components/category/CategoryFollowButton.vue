<script setup>
import useUsersStore from '@/stores/useUsers.ts'
import followUtils from '@/functs/followUtils.ts'
const { t } = useNuxtI18n()
const props = defineProps({
  categoryId: {
    type: Number,
    required: true,
  },
  messageFollow: {
    type: String,
    default: null,
  },
  messageFollowing: {
    type: String,
    default: null,
  },
})

const usersStore = useUsersStore()

const follow = computed(() =>
  usersStore.followedCategories.find((f) => f.category.id === props.categoryId)
)
const followed = computed(() => !!follow.value)

const hasCustomMessages = computed(() => {
  return props.messageFollow && props.messageFollowing
})

const label = computed(() => {
  if (hasCustomMessages.value) {
    return followed.value ? t(props.messageFollowing) : t(props.messageFollow)
  }
  return followed.value ? t('project.followed') : t('project.follow')
})

const toggleFollow = async () => {
  try {
    if (followed.value) {
      await followUtils.unfollowCategory({
        follower_id: usersStore.id,
        category_follow_id: follow.value.id,
      })
    } else {
      await followUtils.followCategory({
        follower_id: usersStore.id,
        category_id: props.categoryId,
      })
    }
    await usersStore.fetchFollowedCategories()
  } catch (error) {
    console.error('Error updating follow', error)
  }
}
</script>
<template>
  <ExternalLabelButton
    v-if="usersStore.isConnected"
    class="space-button bg-on-hover small-top-padding follow-button"
    :label="label"
    :btn-icon="followed ? 'BookmarkFill' : 'BookmarkLine'"
    :vertical-layout="!hasCustomMessages"
    :label-on-hover="!hasCustomMessages"
    @click="toggleFollow"
  />
</template>
<style lang="css" scoped>
.follow-button {
  --external-button-outer-size: 1.2rem;
  --external-button-inner-size: 1.2rem;
}
</style>
