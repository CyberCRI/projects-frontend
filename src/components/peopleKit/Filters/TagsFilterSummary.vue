<template>
    <div>
        <CurrentTags :current-tags="tags" @remove-tag="removeTag" />
    </div>
</template>

<script>
import CurrentTags from '@/components/lpikit/FilterTags/CurrentTags.vue'

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

<style lang="scss">
.input-ctn {
    width: 100%;

    label {
        align-self: flex-start;
    }

    input {
        width: 100%;
    }
}

.add-modal .s-modal-wrapper .s-modal-content {
    max-height: 526px;
}

.search-modal .s-modal-wrapper .s-modal-content {
    max-height: 660px;
}

.tag-search-label {
    font-size: $font-size-m;
    color: $primary-dark;
    font-weight: 700;
    margin: 0 0 $space-s $space-l;
}
</style>
