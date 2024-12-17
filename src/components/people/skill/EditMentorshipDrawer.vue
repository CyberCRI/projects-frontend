<script setup>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import useSkillTexts from '@/composables/useSkillTexts.js'
import { ref, watchEffect } from 'vue'
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'
import TextInput from '@/components/base/form/TextInput.vue'

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
        <div class="form-group">
            <p>{{ $t('profile.edit.skills.mentorship.notice') }}</p>
        </div>
        <div class="form-group">
            <div class="buttons-group">
                <LpiCheckbox
                    v-model="mentorship.can_mentor"
                    :label="$t('profile.edit.skills.mentorship.can-mentor')"
                    class="as-button"
                />

                <LpiCheckbox
                    v-model="mentorship.needs_mentor"
                    :label="$t('profile.edit.skills.mentorship.needs-mentor')"
                    class="as-button"
                />
            </div>
        </div>
        <div class="form-group">
            <TextInput
                v-model="mentorship.comment"
                :label="$t('profile.edit.skills.mentorship.comment')"
                input-type="textarea"
                :placeholder="$t('profile.edit.skills.mentorship.comment-placeholder')"
            />
        </div>
    </BaseDrawer>
</template>
<style lang="scss" scoped>
.buttons-group {
    display: flex;
    gap: $space-unit;

    > * {
        flex-basis: 50%;
    }
}

.form-group + .form-group {
    margin-top: $space-unit;
}
</style>
