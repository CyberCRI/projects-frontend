<template>
    <div>
        <CurrentTags :current-tags="tags" @remove-tag="removeTag" />
    </div>
</template>

<script>
import CurrentTags from '@/components/search/FilterTags/CurrentTags.vue'

export default {
    name: 'TagsFilterSummary',

    emits: ['update:modelValue'],

    components: {
        CurrentTags,
    },

    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            tags: [],
        }
    },

    methods: {
        removeTag(tag) {
            const tagIndex = this.tags.findIndex(
                (element) => element.id === tag.id && element.name === tag.name
            )
            this.tags.splice(tagIndex, 1)
            this.$emit('update:modelValue', this.tags)
        },
    },

    watch: {
        modelValue: {
            handler: function (neo, old) {
                if (neo && neo != old) this.tags = [...this.modelValue]
            },
            immediate: true,
            deep: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.tag-search-title {
    text-align: center;
    font-size: $font-size-2xl;
    font-weight: 700;
    margin: pxToRem(46px) auto;
}

.search-input-ctn {
    margin-bottom: 24px;
}
</style>
