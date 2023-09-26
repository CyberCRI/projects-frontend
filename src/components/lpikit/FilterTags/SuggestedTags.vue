<template>
    <div>
        <div v-if="displayableTags.length" class="suggested-tags-ctn">
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
import FilterValue from '@/components/peopleKit/Filters/FilterValue.vue'

export default {
    name: 'SuggestedTags',

    emits: ['add-tag'],

    components: { FilterValue },

    props: {
        currentTags: {
            type: Array,
            default: () => [],
        },

        suggestedTags: {
            type: Array,
            default: () => [],
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
            return tag[`name_${this.$store.getters['languages/current']}`] || tag.name
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
</style>
