<script setup>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import { ref, watchEffect, computed } from 'vue'
import TextInput from '@/components/base/form/TextInput.vue'
import useToasterStore from '@/stores/useToaster.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
import { postClassificationTag, putClassificationTag } from '@/api/tag-classification.service'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const toaster = useToasterStore()
const organizationsStore = useOrganizationsStore()

const defaultForm = () => ({
    id: null,
    title_en: '',
    description_en: '',
    title_fr: '',
    description_fr: '',
})

const props = defineProps({
    tag: {
        type: [Object, null],
        required: true,
    },
    classification: {
        type: Object,
        required: true,
    },
    isOpen: {
        type: Boolean,
        required: true,
    },
})

const emit = defineEmits(['close', 'tag-edited'])

const asyncing = ref(false)

const form = ref(defaultForm())

watchEffect(() => {
    form.value = defaultForm()
    if (props.tag) {
        form.value = {
            id: props.tag.id,
            title_en: props.tag.title_en,
            description_en: props.tag.description_en,
            title_fr: props.tag.title_fr,
            description_fr: props.tag.description_fr,
        }
    }
})

const isAddMode = computed(() => !form.value.id)

const drawerTitle = computed(() => {
    return isAddMode.value
        ? t('admin.classifications.add-tag.title')
        : t('admin.classifications.edit-tag.title')
})

async function saveTag() {
    asyncing.value = true

    const isFrOrg = organizationsStore.current.language === 'fr'

    const payload = {
        ...form.value,
        title: isFrOrg ? form.value.title_fr : form.value.title_en,
        description: isFrOrg ? form.value.description_fr : form.value.description_en,
    }

    try {
        if (isAddMode.value) {
            delete payload.id
            await postClassificationTag(
                organizationsStore.current.code,
                props.classification.id,
                payload
            )
            toaster.pushSuccess(t('admin.classifications.add-tag.success'))
        } else {
            await putClassificationTag(
                organizationsStore.current.code,
                props.classification.id,
                form.value.id,
                payload
            )
            toaster.pushSuccess(t('admin.classifications.edit-tag.success'))
        }
    } catch (error) {
        if (isAddMode.value) {
            toaster.pushError(t('admin.classifications.add-tag.error'))
        } else {
            toaster.pushError(t('admin.classifications.edit-tag.error'))
        }
        console.error(error)
    } finally {
        asyncing.value = false
        emit('tag-edited')
    }
}
</script>
<template>
    <BaseDrawer
        :confirm-action-name="$t('common.save')"
        :is-opened="isOpen"
        :title="drawerTitle"
        class="small"
        @close="emit('close')"
        @confirm="saveTag"
        :asyncing="asyncing"
    >
        <div class="form-section">
            <TextInput
                v-model="form.title_en"
                :label="t('admin.classifications.tag-form.title-en')"
                :required="true"
            />
        </div>
        <div class="form-section">
            <TextInput
                v-model="form.title_fr"
                :label="t('admin.classifications.tag-form.title-fr')"
                :required="true"
            />
        </div>
        <div class="form-section">
            <TextInput
                v-model="form.description_en"
                :label="t('admin.classifications.tag-form.description-en')"
                :required="true"
            />
        </div>
        <div class="form-section">
            <TextInput
                v-model="form.description_fr"
                :label="t('admin.classifications.tag-form.description-fr')"
                :required="true"
            />
        </div>
    </BaseDrawer>
</template>
