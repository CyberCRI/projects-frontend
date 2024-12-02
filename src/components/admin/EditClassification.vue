<script setup>
import { ref, computed, watchEffect } from 'vue'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { postOrgClassification, putOrgClassification } from '@/api/tag-classification.service'
import TagClassificationAdmin from '@/components/admin/TagClassificationAdmin.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()

const defaultForm = () => ({
    id: null,
    title: '',
    description: '',
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
            description: props.classification.description,
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
    let classification
    try {
        if (isAddMode.value) {
            delete payload.id
            classification = await postOrgClassification(organizationsStore.current.code, payload)
        } else {
            classification = await putOrgClassification(
                organizationsStore.current.code,
                form.value.id,
                payload
            )
        }

        // set enabled for skills
        // we remove it anyway and (re-)add it if needed
        const org_enabled_for_skills = organizationsStore.current.enabled_skills_tag_classifications
            .map((c) => c.id)
            .filter((id) => id != classification.id)
        if (form.value.is_enabled_for_skills) org_enabled_for_skills.push(classification.id)
        // set enabled for projects
        // we remove it anyway and (re-)add it if needed
        const org_enabled_for_projects =
            organizationsStore.current.enabled_projects_tag_classifications
                .map((c) => c.id)
                .filter((id) => id != classification.id)
        if (form.value.is_enabled_for_projects) org_enabled_for_projects.push(classification.id)

        // patch organization
        await organizationsStore.updateCurrentOrganization({
            enabled_skills_tag_classifications: org_enabled_for_skills,
            enabled_projects_tag_classifications: org_enabled_for_projects,
        })

        if (isAddMode.value) {
            toaster.pushSuccess(t('admin.classifications.add-classification.success'))
            emit('classification-created', classification)
        } else {
            toaster.pushSuccess(t('admin.classifications.edit-classification.success'))
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
    <BaseDrawer
        :title="
            isAddMode
                ? t('admin.classifications.add-classification.title')
                : t('admin.classifications.edit-classification.title')
        "
        :is-opened="isOpen"
        @close="emit('close')"
        @confirm="saveClassification"
    >
        <div class="form-section">
            <TextInput
                v-model.trim="form.title"
                :label="t('admin.classifications.title-field')"
                :placeholder="t('admin.classifications.enter-title')"
                required
            />
        </div>
        <div class="form-section">
            <TextInput
                v-model.trim="form.description"
                :label="t('admin.classifications.description-field')"
                :placeholder="t('admin.classifications.enter-description')"
                input-type="textarea"
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

        <TagClassificationAdmin
            v-if="classification"
            :classification="classification"
            @classification-deleted="onClassificationDeleted"
            @classification-edited="$emit('classification-edited', $event)"
            @classification-created="$emit('classification-created', $event)"
        />
    </BaseDrawer>
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
