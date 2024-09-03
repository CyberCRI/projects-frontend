<script setup>
import RadioButton from '@/components/base/form/RadioButton.vue'
import TextInput from '@/components/base/form/TextInput.vue'
const activate = defineModel('activate', { type: Boolean, required: true })
const note = defineModel('note', { type: String, required: true })
defineProps({ skillLabel: { type: String, required: true } })
defineEmits(['update:activate', 'update:note'])

const uniqueId = `skill-mentorship-edit-${Math.random().toString(36).substring(7)}`
</script>
<template>
    <div class="skill-mentorship-edit">
        <div class="choice-wrapper">
            <h4 class="skill-label">{{ skillLabel }}</h4>
            <div class="radios">
                <RadioButton
                    :model-value="activate"
                    :value="true"
                    @update:model-value="$emit('update:activate', $event)"
                    :label="$t('common.yes')"
                    :radio-group="uniqueId"
                />
                <RadioButton
                    :model-value="activate"
                    @update:model-value="$emit('update:activate', $event)"
                    :value="false"
                    :label="$t('common.no')"
                    :radio-group="uniqueId"
                />
            </div>
        </div>
        <div v-show="activate" class="note-wrapper">
            <TextInput
                type="textarea"
                :model-value="note"
                :placeholder="$t('profile.edit.skills.mentorship.edit.note-placeholder')"
                @update:model-value="$emit('update:note', $event)"
            />
        </div>
    </div>
</template>
<style scoped lang="scss">
.skill-mentorship-edit {
    border-bottom: $border-width-s solid $light-gray;
}

.choice-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-block: 1rem;
}

.note-wrapper {
    padding-block: 1rem;
}

.radios {
    display: flex;
    gap: 1rem;
}
</style>
