<script setup>
import { computed } from 'vue'
import useLanguagesStore from '@/stores/useLanguages.ts'
import useTagSearch from '@/composables/useTagSearch.js'

const { isEscoClassification } = useTagSearch()

defineProps({
    classification: {
        type: Object,
        required: true,
    },
})

const languagesStore = useLanguagesStore()
const escoLink = computed(
    () => `https://esco.ec.europa.eu/${languagesStore.current}/classification/skill_main`
)
</script>
<template>
    <p class="classification-description">
        {{ classification.description
        }}<span v-if="isEscoClassification(classification)">
            <a target="_blank" :href="escoLink">{{ escoLink }}</a>
        </span>
    </p>
</template>
<style lang="scss" scoped>
.classification-description {
    a {
        color: $primary-dark;
        font-weight: 700;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
