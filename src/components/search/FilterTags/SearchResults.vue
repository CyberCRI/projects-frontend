<template>
    <div :class="{ 'in-modal': inModal, inline }" class="search-results">
        <div class="search-results-ctn" v-if="tagResults?.length">
            <div
                v-for="(tag, index) in tagResults"
                :key="`${tag.name}-${index}`"
                class="tag-result"
                tabindex="0"
                @click="tagClicked(tag)"
            >
                <TagResult :label="tagLabel(tag)" :description="tagDescription(tag)" />
            </div>
        </div>
        <div v-else class="no-result">
            {{ $t('common.no-result') }}
        </div>
    </div>
</template>

<script>
import TagResult from '@/components/search/FilterTags/TagResult.vue'
import useUsersStore from '@/stores/useUsers.ts'
import useLanguagesStore from '@/stores/useLanguages'

export default {
    name: 'SearchResults',

    emits: ['result-clicked'],

    components: { TagResult },
    setup() {
        const usersStore = useUsersStore()
        const languagesStore = useLanguagesStore()
        return {
            usersStore,
            languagesStore,
        }
    },
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
        tagLabel(tag) {
            return tag[`title_${this.languagesStore.current}`] || tag.title
        },
        tagDescription(tag) {
            return tag[`description_${this.languagesStore.current}`] || tag.description
        },
    },
}
</script>

<style lang="scss" scoped>
.search-results {
    .back-btn {
        margin-left: auto;
    }

    .no-result {
        width: 100%;
        text-align: center;
        font-size: $font-size-l;
        padding-top: $space-2xl;
        font-style: italic;
        color: $mid-gray;
    }

    .search-results-ctn {
        width: 100%;
        display: flex;
        flex-flow: column wrap;
        gap: $space-m;
        align-items: stretch;
        padding-top: $space-l;
        padding-bottom: $space-l;
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
