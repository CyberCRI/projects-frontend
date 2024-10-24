<script setup>
import { ref, computed, watchEffect } from 'vue'
import BaseModal from '@/components/base/modal/BaseModal.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import LpiButton from '../base/button/LpiButton.vue'
import LpiCheckbox from '../base/form/LpiCheckbox.vue'
import useToasterStore from '@/stores/useToaster.ts'

const toaster = useToasterStore()

const defaultForm = () => ({
    id: null,
    title: '',
    is_enabled_for_projects: false,
    is_enabled_for_skills: false,
})

const emit = defineEmits(['close'])

const props = defineProps({
    classification: {
        type: [Object, null],
        required: true,
    },
    isOpen: {
        type: Boolean,
        required: true,
    },
})

const asyncing = ref(false)

const form = ref(defaultForm())
watchEffect(() => {
    form.value = defaultForm()
    if (props.classification) {
        form.value = {
            id: props.classification.id,
            title: props.classification.title,
            is_enabled_for_projects: props.classification.is_enabled_for_projects,
            is_enabled_for_skills: props.classification.is_enabled_for_skills,
        }
    }
})

const isAddMode = computed(() => !form.value.id)

const saveClassification = async () => {
    asyncing.value = true

    // TODO
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toaster.pushSuccess(`Classification ${isAddMode.value ? 'added' : 'updated'}`)
    asyncing.value = false
    emit('close')
}
</script>
<template>
    <BaseModal v-if="isOpen">
        <template #header-title>
            {{ isAddMode ? 'Add classification' : 'Edit Classification' }}
        </template>

        <template #content>
            <div class="form-section">
                <TextInput v-model="form.title" label="Title" placeholder="Enter title" required />
            </div>
            <div class="form-section checkboxes">
                <LpiCheckbox v-model="form.is_enabled_for_skills" label="Is Skills" />
                <LpiCheckbox v-model="form.is_enabled_for_projects" label="Is Tags" />
            </div>
        </template>

        <template #footer>
            <div class="actions">
                <LpiButton :disabled="asyncing" label="cancel" @click="emit('close')" />
                <LpiButton
                    :loading="asyncing"
                    label="Save"
                    :disabled="!form.title || asyncing"
                    :btn-icon="asyncing ? 'LoaderSimple' : null"
                    @click="saveClassification"
                />
            </div>
        </template>
    </BaseModal>
</template>
<style scoped lang="scss">
.form-section + .form-section {
    margin-top: 1rem;
}

.actions,
.checkboxes {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
}

.form-control {
    margin-top: 0 !important;
}
</style>
