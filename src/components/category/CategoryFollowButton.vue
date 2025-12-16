<script setup>
import useUsersStore from '@/stores/useUsers.ts'
import followUtils from '@/functs/followUtils.ts'

const props = defineProps({
  categoryId: {
    type: Number,
    required: true,
  },
})

const usersStore = useUsersStore()

const follow = computed(() =>
  usersStore.followedCategories.find((f) => f.category.id === props.categoryId)
)
const followed = computed(() => !!follow.value)

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
    class="space-button bg-on-hover follow-button"
    :label="followed ? $t('project.followed') : $t('project.follow')"
    :btn-icon="followed ? 'Heart' : 'HeartOutline'"
    vertical-layout
    @click="toggleFollow"
  />
</template>
