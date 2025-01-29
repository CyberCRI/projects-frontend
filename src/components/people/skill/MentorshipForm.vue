<script setup>
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import { watchEffect } from 'vue'

const model = defineModel({ type: Object, required: true })

watchEffect(() => {
    if (model.value.can_mentor) {
        model.value.needs_mentor = false
    }
})

watchEffect(() => {
    if (model.value.needs_mentor) {
        model.value.can_mentor = false
    }
})
</script>

<template>
    <div class="form-group">
        <p>{{ $t('profile.edit.skills.mentorship.notice') }}</p>
    </div>
    <div class="form-group">
        <div class="buttons-group">
            <LpiCheckbox
                v-model="model.can_mentor"
                :label="$t('profile.edit.skills.mentorship.can-mentor')"
                class="as-button"
            />

            <LpiCheckbox
                v-model="model.needs_mentor"
                :label="$t('profile.edit.skills.mentorship.needs-mentor')"
                class="as-button"
            />
        </div>
    </div>
    <div class="form-group">
        <TextInput
            v-model="model.comment"
            :label="$t('profile.edit.skills.mentorship.comment')"
            input-type="textarea"
            :placeholder="$t('profile.edit.skills.mentorship.comment-placeholder')"
        />
    </div>
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
