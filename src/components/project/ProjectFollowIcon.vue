<template>
  <FollowIcon :followed="isFollowing" @follow="actionFollow" @unfollow="actionFollow" />
</template>

<script setup lang="ts">
import { useProjectFollow } from '~/composables/project/useProjectFollow'
import type { TranslatedProject } from '@/models/project.model'

const props = defineProps<{
  project: TranslatedProject
}>()

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
