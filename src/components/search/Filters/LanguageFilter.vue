<template>
    <div class="language-filter">
        <LpiCheckbox
            class="as-button min-width"
            v-for="(language, index) in languages"
            :key="index"
            v-model="language.selected"
            :label="$t('language.label-' + language.label)"
        />
    </div>
</template>

<script>
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'
import useLanguagesStore from '@/stores/useLanguages'

export default {
    name: 'LanguageFilter',

    emits: ['update:modelValue'],

    components: { LpiCheckbox },

    setup() {
        const languagesStore = useLanguagesStore()
        return {
            languagesStore,
        }
    },
    props: {
        modelValue: {
            type: Array,
            required: true,
        },
    },

    data() {
        return {
            languages: this.languagesStore.all.map((lang) => ({
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
    display: flex;
    flex-flow: column wrap;
    gap: 1rem;
}
</style>
