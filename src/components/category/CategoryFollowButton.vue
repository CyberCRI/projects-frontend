<script setup lang="ts">
import useUsersStore from '~/stores/useUsers'

import type {
  ProjectCategoryModel,
  TranslatedProjectCategory,
} from 'shared-projects-frontend/models'
import { refreshUserFollowedCategories } from '~/composables/user/refreshUser'
import FollowIcon from '~/components/base/FollowIcon.vue'
import followUtils from '~/functs/followUtils'

const { t } = useNuxtI18n()
const props = withDefaults(
  defineProps<{
    category: TranslatedProjectCategory | ProjectCategoryModel
    messageFollow?: string
    messageFollowing?: string
  }>(),
  {
    messageFollow: null,
    messageFollowing: null,
  }
)

const usersStore = useUsersStore()

const hasCustomMessages = computed(() => {
  return props.messageFollow && props.messageFollowing
})

const toggleFollow = async () => {
  try {
    if (props.category.is_followed.is_followed) {
      await followUtils.unfollowCategory({
        follower_id: usersStore.id,
        category_follow_id: props.category.is_followed.follow_id,
      })
    } else {
      await followUtils.followCategory({
        follower_id: usersStore.id,
        category_id: props.category.id,
      })
    }
    await refreshUserFollowedCategories(usersStore.user)
  } catch (error) {
    console.error('Error updating follow', error)
  }
}
</script>
<template>
  <FollowIcon
    :followed="props.category.is_followed.is_followed"
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
