<template>
  <IconImage
    v-if="!isFollowing"
    class="icon"
    name="BookmarkLine"
    tabindex="1"
    @click="actionFollow"
  />
  <IconImage v-else class="icon" name="BookmarkFill" tabindex="1" @click="actionFollow" />
</template>

<script setup lang="ts">
import { TranslatedProject } from '@/models/project.model'
import followUtils from '@/functs/followUtils'
import useUsersStore from '@/stores/useUsers'

const props = withDefaults(
  defineProps<{
    project: TranslatedProject
    targetUserId?: number
  }>(),
  { targetUserId: null }
)

const usersStore = useUsersStore()
const emit = defineEmits<{
  follow: [TranslatedProject['is_followed']]
  unfollow: []
}>()

const isFollowed = ref(props.project.is_followed)
watchEffect(() => {
  isFollowed.value = props.project.is_followed
})
const isFollowing = computed(() => isFollowed.value.is_followed)

const asyncing = ref(false)

const actionFollow = async () => {
  // ignore already in aciton
  if (asyncing.value) {
    return
  }
  asyncing.value = true

  if (isFollowing.value) {
    await followUtils.unfollow({
      follower_id: isFollowed.value.follow_id,
      project_id: props.project.id,
    })
    isFollowed.value = {
      is_followed: false,
      follow_id: null,
    }
    emit('unfollow')
  } else {
    const results = await followUtils.follow({
      follower_id: props.targetUserId ?? usersStore.user.id,
      project_id: props.project.id,
    })
    isFollowed.value = results.project.is_followed
    emit('follow', results.project.is_followed)
  }

  nextTick(() => (asyncing.value = false))
}

// can access from ref
defineExpose({ actionFollow })
</script>

<style lang="scss" scoped>
.icon {
  fill: $primary-dark;
  cursor: pointer;
}
</style>
