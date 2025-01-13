<script setup>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import useSkillTexts from '@/composables/useSkillTexts.js'
import { ref, watchEffect } from 'vue'
import MentorshipForm from '@/components/people/skill/MentorshipForm.vue'

const emit = defineEmits(['close', 'update-mentorship'])

const props = defineProps({
    skill: { type: Object, required: true },
    isOpened: { type: Boolean, required: true },
})

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

const skillTexts = useSkillTexts()
</script>
<template>
    <BaseDrawer
        data-test="edit-mentorship-drawer"
        :confirm-action-name="$t('common.confirm')"
        :confirm-action-disabled="false"
        :is-opened="isOpened"
        :title="$t('profile.edit.skills.mentorship.edit', { skill: skillTexts.title(skill) })"
        class="medium"
        @close="$emit('close')"
        @confirm="saveMentorship"
    >
        <MentorshipForm v-model="mentorship" />
    </BaseDrawer>
</template>
