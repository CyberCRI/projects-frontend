<script setup lang="ts">
import MentorshipForm from '~/components/people/skill/MentorshipForm.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

import type { SkillForm } from 'shared-projects-frontend/models'

const emit = defineEmits(['close', 'update-mentorship'])

const props = defineProps<{
  skill: SkillForm
  isOpened: boolean
}>()

const mentorship = ref({
  can_mentor: false,
  needs_mentor: false,
  comment: '',
})

watchEffect(function onOpen() {
  if (props.isOpened) {
    mentorship.value = {
      can_mentor: props.skill.can_mentor || false,
      needs_mentor: props.skill.needs_mentor || false,
      comment: props.skill.comment || '',
    }
  }
})

function saveMentorship() {
  emit('update-mentorship', { id: props.skill.id, ...mentorship.value })
}
</script>
<template>
  <BaseDrawer
    data-test="edit-mentorship-drawer"
    :confirm-action-name="$t('common.confirm')"
    :confirm-action-disabled="false"
    :is-opened="isOpened"
    :title="
      $t('profile.edit.skills.mentorship.edit', {
        skill: skill.tag?.$t?.title || skill.tag?.title,
      })
    "
    class="medium"
    @close="$emit('close')"
    @confirm="saveMentorship"
  >
    <MentorshipForm v-model="mentorship" />
  </BaseDrawer>
</template>
