<template>
    <div>
        <div v-if="loading" class="loader-ctn">
            <LoaderSimple />
        </div>
        <div v-else-if="displayableTags.length" class="suggested-tags-ctn">
            <div v-for="(tag, index) in displayableTags" :key="index">
                <FilterValue
                    v-if="tagLabel(tag)"
                    :label="tagLabel(tag)"
                    class="actionable suggested"
                    @click="addTag(tag)"
                />
            </div>
        </div>
    </div>
</template>

<script>
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import useLanguagesStore from '@/stores/useLanguages'

export default {
    name: 'SuggestedTags',

    emits: ['add-tag'],

    components: { FilterValue, LoaderSimple },

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

        suggestedTags: {
            type: Array,
            default: () => [],
        },

        loading: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        displayableTags() {
            return this.suggestedTags.filter(
                (tag) => !this.currentTags.some((currentTag) => currentTag.name === tag.name)
            )
        },
    },

    methods: {
        addTag(tag) {
            this.$emit('add-tag', tag)
        },

        tagLabel(tag) {
            return tag[`name_${this.languagesStore.current}`] || tag.name
        },
    },
}
</script>

<style lang="scss" scoped>
.suggested-tags-ctn {
    background: $primary-lighter;
    border-radius: $border-radius-xs;
    padding: $space-m;
    display: flex;
    flex-wrap: wrap;
    gap: $space-s;
}

.loader-ctn {
    padding: $space-m;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
