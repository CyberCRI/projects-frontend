<script setup>
import { ref, computed, watchEffect } from 'vue'
import BaseModal from '@/components/base/modal/BaseModal.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import LpiButton from '../base/button/LpiButton.vue'
import LpiCheckbox from '../base/form/LpiCheckbox.vue'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { postOrgClassification, putOrgClassification } from '@/api/tag-classification.service'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()

const defaultForm = () => ({
    id: null,
    title: '',
    is_enabled_for_projects: false,
    is_enabled_for_skills: false,
})

const emit = defineEmits(['close', 'classification-created', 'classification-edited'])

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

    const payload = {
        ...form.value,
    }

    try {
        if (isAddMode.value) {
            delete payload.id
            const classification = await postOrgClassification(
                organizationsStore.current.code,
                payload
            )
            toaster.pushSuccess(t('admin.classifications.add-classification.success'))
            emit('classification-created', classification)
        } else {
            const classification = await putOrgClassification(
                organizationsStore.current.code,
                form.value.id,
                payload
            )
            toaster.pushSuccess(t('admin.classifications.add-classification.success'))
            emit('classification-edited', classification)
        }
    } catch (error) {
        console.log(error)
        if (isAddMode.value) {
            toaster.pushError(t('admin.classifications.add-classification.error'))
        } else {
            toaster.pushError(t('admin.classifications.edit-classification.error'))
        }
        emit('close')
    } finally {
        asyncing.value = false
    }
}
</script>
<template>
    <BaseModal v-if="isOpen" @close="emit('close')">
        <template #header-title>
            {{
                isAddMode
                    ? t('admin.classifications.add-classification.title')
                    : t('admin.classifications.edit-classification.title')
            }}
        </template>

        <template #content>
            <div class="form-section">
                <TextInput
                    v-model="form.title"
                    :label="t('admin.classifications.title-field')"
                    :placeholder="t('admin.classifications.enter-title')"
                    required
                />
            </div>
            <div class="form-section checkboxes">
                <LpiCheckbox
                    v-model="form.is_enabled_for_skills"
                    :label="t('admin.classifications.enabled-for-skills')"
                />
                <LpiCheckbox
                    v-model="form.is_enabled_for_projects"
                    :label="t('admin.classifications.enabled-for-projects')"
                />
            </div>
        </template>

        <template #footer>
            <div class="actions">
                <LpiButton
                    :disabled="asyncing"
                    :label="t('common.cancel')"
                    @click="emit('close')"
                />
                <LpiButton
                    :loading="asyncing"
                    :label="t('common.save')"
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
