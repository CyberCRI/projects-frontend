<template>
  <FollowIcon
    :followed="isFollowing"
    :follow-label="followLabel"
    :unfollow-label="unfollowLabel"
    @follow="actionFollow"
    @unfollow="actionFollow"
    @click.prevent=""
  />
</template>

<script setup lang="ts">
import type {
  ProjectCategoryModel,
  TranslatedProjectCategory,
} from 'shared-projects-frontend/models'
import { useCategoryFollow } from '~/composables/category/useCategoryFollow'

const props = defineProps<{
  category: TranslatedProjectCategory | ProjectCategoryModel
  followLabel?: string
  unfollowLabel?: string
}>()

const emit = defineEmits<{
  follow: [TranslatedProjectCategory['is_followed']]
  unfollow: []
}>()

const { isFollowing, toggleFollow } = useCategoryFollow(computed(() => props.category))

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
