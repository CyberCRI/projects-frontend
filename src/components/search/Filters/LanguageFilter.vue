<template>
    <div class="language-filter">
        <LpiCheckbox
            v-for="(language, index) in languages"
            :key="index"
            v-model="language.selected"
            :label="$t('language.label-' + language.label)"
            class="checkbox"
        />
    </div>
</template>

<script>
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'

export default {
    name: 'LanguageFilter',

    emits: ['update:modelValue'],

    components: { LpiCheckbox },

    props: {
        modelValue: {
            type: Array,
            required: true,
        },
    },

    data() {
        return {
            languages: this.$store.getters['languages/all'].map((lang) => ({
                label: lang,
                selected: this.modelValue.some((l) => l == lang),
            })),
        }
    },

    watch: {
        languages: {
            handler: function (neo) {
                this.$emit(
                    'update:modelValue',
                    neo.filter((lang) => lang.selected).map((lang) => lang.label)
                )
            },
            deep: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.language-filter {
    width: 100%;

    .checkbox {
        align-items: center;
    }
}
</style>
