<template>
    <!-- First Name -->
    <AccountSection ref="info">
        <TextInput
            :model-value="modelValue.given_name"
            @update:model-value="updateForm('given_name', $event)"
            @blur="v$.form.given_name.$touch"
        >
            <label class="label">{{ $t('account.form.first-name') }}</label>
        </TextInput>
        <FieldErrors :errors="v$.form.given_name.$errors" />
    </AccountSection>

    <!-- Last Name -->
    <AccountSection>
        <TextInput
            :model-value="modelValue.family_name"
            @update:model-value="updateForm('family_name', $event)"
            @blur="v$.form.family_name.$touch"
        >
            <label class="label">{{ $t('account.form.last-name') }}</label>
        </TextInput>
        <FieldErrors :errors="v$.form.family_name.$errors" />
    </AccountSection>

    <!-- Title -->
    <AccountSection>
        <TextInput
            :model-value="modelValue.job"
            @update:model-value="updateForm('job', $event)"
            @blur="v$.form.job.$touch"
        >
            <label class="label">{{ $t('account.form.title') }}</label>
        </TextInput>
        <FieldErrors :errors="v$.form.job.$errors" />
    </AccountSection>

    <!-- Picture -->
    <AccountSection>
        <label class="label">{{ $filters.capitalize($t('project.image-header')) }}</label>
        <ImageEditor
            :picture-alt="`${modelValue.name} image`"
            :contain="true"
            :round-picture="true"
            :image-sizes="modelValue.imageSizes"
            @update:image-sizes="updateForm('imageSizes', $event)"
            :picture="modelValue.profile_picture"
            @update:picture="updateForm('profile_picture', $event)"
            :default-picture="defaultPictures"
        ></ImageEditor>
    </AccountSection>
</template>
<script>
import ImageEditor from '@/components/base/form/ImageEditor.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import AccountSection from '@/components/people/Account/AccountSection.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
export default {
    name: 'AccountInfos',

    emits: ['update:modelValue'],

    components: {
        TextInput,
        ImageEditor,
        AccountSection,
        FieldErrors,
    },
    props: {
        modelValue: {
            type: Object,
            required: true,
        },
        v$: {
            type: Object,
            required: true,
        },
    },
    data() {
        const defaultPictures = [1, 2, 3, 4, 5, 6].map((index) => {
            return `${
                import.meta.env.VITE_APP_PUBLIC_BINARIES_PREFIX
            }/patatoids-project/Patatoid-${index}.png`
        })
        return { defaultPictures }
    },
    methods: {
        updateForm(fieldName, fieldValue) {
            this.$emit('update:modelValue', { ...this.modelValue, [fieldName]: fieldValue })
        },
    },
}
</script>
<style lang="scss" scoped>
.label {
    font-weight: 500;
    font-size: $font-size-m;
    padding-bottom: $space-m;
}
</style>
