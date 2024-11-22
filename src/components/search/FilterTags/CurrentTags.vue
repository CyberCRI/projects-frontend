<template>
    <div v-if="currentTags.length" class="current-tags-ctn">
        <template v-for="(tag, index) in currentTags">
            <span :key="tag.id" v-if="showSeparator && index > 0"> {{ $t('search.or') }} </span>
            <FilterValue
                :key="tag.id"
                v-if="tagLabel(tag)"
                :label="tagLabel(tag)"
                class="actionable"
                icon="Close"
                @click="removeTag(tag)"
            />
        </template>
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

        showSeparator: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        removeTag(tag) {
            this.$emit('remove-tag', tag)
        },

        tagLabel(tag) {
            return tag[`title_${this.languagesStore.current}`] || tag.title
        },
    },
}
</script>

<style lang="scss" scoped>
.current-tags-ctn {
    display: flex;
    flex-wrap: wrap;
    gap: $space-s;
    align-items: center;
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
