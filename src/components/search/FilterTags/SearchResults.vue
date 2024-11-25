<template>
    <div :class="{ 'in-modal': inModal, inline }" class="search-results">
        <div class="search-results-ctn" v-if="tagResults?.length">
            <TagResult
                class="tag-result"
                v-for="tag in tagResults"
                :key="tag.id"
                tabindex="0"
                @click="tagClicked(tag)"
                :label="tagTexts.title(tag)"
                :description="tagTexts.description(tag)"
                :classification-name="tag.classificationName || ''"
            />
        </div>
        <div v-else class="no-result">
            {{ $t('common.no-result') }}
        </div>
    </div>
</template>

<script>
import TagResult from '@/components/search/FilterTags/TagResult.vue'
import useUsersStore from '@/stores/useUsers.ts'
import useTagTexts from '@/composables/useTagTexts.js'

export default {
    name: 'SearchResults',

    emits: ['result-clicked'],

    components: { TagResult },
    setup() {
        const usersStore = useUsersStore()
        const tagTexts = useTagTexts()
        return {
            usersStore,
            tagTexts,
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

        .tag-result {
            cursor: pointer;
            text-align: start;
            flex-grow: 1;
        }
    }
}

.search-results.in-modal .search-results-ctn {
    position: static;
}
</style>
