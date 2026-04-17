<template>
  <IconImage
    v-if="!isFollowing && usersStore.isConnected"
    class="icon"
    name="BookmarkLine"
    tabindex="1"
    @click="actionFollow"
  />
  <IconImage
    v-else-if="usersStore.isConnected"
    class="icon"
    name="BookmarkFill"
    tabindex="1"
    @click="actionFollow"
  />
</template>

<script setup lang="ts">
import { TranslatedProject } from '@/models/project.model'
import useUsersStore from '@/stores/useUsers'
import { useProjectFollow } from '@/pages/ProjectPageV2/useProject'

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

const { isFollowing, toggleFollow } = useProjectFollow(computed(() => props.project))

const actionFollow = () => {
  return toggleFollow().then((val) => {
    if (val) {
      emit('follow', val)
    } else {
      emit('unfollow')
    }
  })
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
