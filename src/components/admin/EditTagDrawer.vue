<script setup>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import { ref, watchEffect, computed } from 'vue'
import TextInput from '@/components/base/form/TextInput.vue'
import useToasterStore from '@/stores/useToaster.ts'

const toaster = useToasterStore()

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

const emit = defineEmits(['close'])

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

async function saveTag() {
    asyncing.value = true

    // TODO
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toaster.pushSuccess(
        `Tag ${isAddMode.value ? `created in '${props.classification.title}'` : 'updated'}`
    )
    asyncing.value = false
    emit('close')
}
</script>
<template>
    <BaseDrawer
        :confirm-action-name="$t('common.save')"
        :is-opened="isOpen"
        :title="isAddMode ? 'Add a tag' : 'Edit a tag'"
        class="small"
        @close="emit('close')"
        @confirm="saveTag"
        :asyncing="asyncing"
    >
        <div class="form-section">
            <TextInput v-model="form.title_en" label="Title (EN)" :required="true" />
        </div>
        <div class="form-section">
            <TextInput v-model="form.title_fr" label="Title (FR)" :required="true" />
        </div>
        <div class="form-section">
            <TextInput v-model="form.description_en" label="Description (EN)" :required="true" />
        </div>
        <div class="form-section">
            <TextInput v-model="form.description_fr" label="Description (FR)" :required="true" />
        </div>
    </BaseDrawer>
</template>
