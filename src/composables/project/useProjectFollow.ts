import type { AnyProject } from '~/models/project.model'
import followUtils from '~/functs/followUtils'
import useUsersStore from '~/stores/useUsers'

export const useProjectFollow = (project: ComputedRef<AnyProject>) => {
  const asyncing = ref(false)
  if (asyncing.value) {
    return
  }

  const usersStore = useUsersStore()

  const followed = ref()

  watch(
    project,
    () => {
      followed.value = project.value?.is_followed
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
        .unfollow({
          follower_id: followed.value.follow_id,
          project_id: project.value.id,
        })
        .then(() => {
          followed.value = null
        })
        .finally(() => nextTick(() => (asyncing.value = false)))
    } else {
      return followUtils
        .follow({
          follower_id: usersStore.user.id,
          project_id: project.value.id,
        })
        .then((follow) => {
          followed.value = {
            is_followed: true,
            follow_id: follow.id,
          }
          return follow
        })
        .finally(() => nextTick(() => (asyncing.value = false)))
    }
  }

  return {
    followed,
    isFollowing,
    toggleFollow,
  }
}
