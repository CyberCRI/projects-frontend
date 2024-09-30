<template>
    <div v-if="currentTags.length" class="current-tags-ctn">
        <div v-for="tag in currentTags" :key="tag.id">
            <FilterValue
                v-if="tagLabel(tag)"
                :label="tagLabel(tag)"
                class="actionable"
                icon="Close"
                @click="removeTag(tag)"
            />
        </div>
    </div>
</template>

<script>
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import useLanguagesStore from '@/stores/useLanguages'

export default {
    name: 'CurrentTags',

    emits: ['remove-tag'],

    components: { FilterValue },

    setup() {
        const languagesStore = useLanguagesStore()
        return {
            languagesStore,
        }
    },
    props: {
        currentTags: {
            type: Array,
            default: () => [],
        },
    },

    methods: {
        removeTag(tag) {
            this.$emit('remove-tag', tag)
        },

        tagLabel(tag) {
            return tag[`name_${this.languagesStore.current}`] || tag.name
        },
    },
}
</script>

<style lang="scss" scoped>
.current-tags-ctn {
    display: flex;
    flex-wrap: wrap;
    gap: $space-s;
}

.clear-selection {
    text-transform: uppercase;
    color: $primary-dark;
    margin-bottom: pxToRem(24px);
    text-align: center;
    font-weight: 700;
    font-size: $font-size-2xs;
    cursor: pointer;

    svg {
        height: $space-m;
        fill: $primary-dark;
        margin-right: $space-s;
    }
}
</style>
