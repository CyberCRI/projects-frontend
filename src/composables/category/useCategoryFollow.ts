import type {
  ProjectCategoryModel,
  TranslatedProjectCategory,
} from 'shared-projects-frontend/models'
import followUtils from '~/functs/followUtils'
import useUsersStore from '~/stores/useUsers'

export const useCategoryFollow = (
  category: ComputedRef<ProjectCategoryModel | TranslatedProjectCategory>
) => {
  const asyncing = ref(false)
  const usersStore = useUsersStore()

  const followed = ref()

  watch(
    category,
    () => {
      followed.value = category.value?.is_followed
    },
    { immediate: true, deep: true }
  )

  const isFollowing = computed(() => {
    return followed.value?.is_followed || false
  })

  const toggleFollow = () => {
    if (asyncing.value) {
      return
    }

    if (isFollowing.value) {
      return followUtils
        .unfollowCategory({
          follower_id: usersStore.id,
          category_follow_id: followed.value.follow_id,
        })
        .then(() => {
          followed.value = null
        })
        .finally(() => nextTick(() => (asyncing.value = false)))
        .then(() => followed.value)
    } else {
      return followUtils
        .followCategory({
          follower_id: usersStore.user.id,
          category_id: category.value.id,
        })
        .then((follow) => {
          followed.value = {
            is_followed: true,
            follow_id: follow.id,
          }
        })
        .finally(() => nextTick(() => (asyncing.value = false)))
        .then(() => followed.value)
    }
  }

  return {
    followed,
    isFollowing,
    toggleFollow,
  }
}
