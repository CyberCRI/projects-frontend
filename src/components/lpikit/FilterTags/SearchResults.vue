<template>
    <div :class="{ 'in-modal': inModal, inline }" class="search-results">
        <div class="search-results-ctn">
            <div
                v-for="(tag, index) in tagResults"
                :key="`${tag.name}-${index}`"
                class="tag-result"
                tabindex="0"
                @click="tagClicked(tag)"
            >
                <TagResult :is-ambiguous="tag.ambiguous" :label="tag.name" />
            </div>
        </div>
    </div>
</template>

<script>
import TagResult from '@/components/lpikit/FilterTags/TagResult.vue'

export default {
    name: 'SearchResults',

    emits: ['result-clicked'],

    components: { TagResult },

    props: {
        tagResults: {
            type: Array,
            default: () => [],
        },
        inModal: {
            type: Boolean,
            default: false,
        },
        inline: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        tagClicked(tag) {
            this.$emit('result-clicked', tag)
        },
    },
}
</script>

<style lang="scss" scoped>
.search-results {
    .back-btn {
        margin-left: auto;
    }

    .search-results-ctn {
        width: 100%;
        display: flex;
        flex-flow: column wrap;
        gap: $space-m;
        align-items: stretch;
        padding-top: $space-l;
        box-sizing: border-box;

        > * {
            flex: 1 1 calc(50% - $space-m);
        }

        .tag-result {
            cursor: pointer;
            text-align: start;
        }
    }

    &.inline .search-results-ctn {
        flex-direction: row;

        > div {
            flex: initial;
        }
    }

    .tag-description {
        text-align: start;
    }
}

.search-results.in-modal .search-results-ctn {
    position: static;
}
</style>
