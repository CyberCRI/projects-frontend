<script setup lang="ts">
import useUsersStore from '~/stores/useUsers'

import FollowIcon from '~/components/base/FollowIcon.vue'
import followUtils from '~/functs/followUtils'

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
  <FollowIcon
    :followed="followed"
    :follow-label="hasCustomMessages ? t(props.messageFollowing) : t('project.followed')"
    :unfollow-label="hasCustomMessages ? t(props.messageFollow) : t('project.follow')"
    @follow="toggleFollow"
    @unfollow="toggleFollow"
  />
</template>
<style lang="css" scoped>
.follow-button {
  --external-button-outer-size: 1.2rem;
  --external-button-inner-size: 1.2rem;
}
</style>
