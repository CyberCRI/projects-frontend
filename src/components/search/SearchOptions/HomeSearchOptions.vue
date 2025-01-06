<template>
    <div class="search-block">
        <div class="search-container">
            <div class="search-group">
                <SearchOptionDropDown v-model:selectedSection="selectedSection" />
                <SearchInput
                    class="search-input has-sections"
                    v-model="selectedQuery"
                    full
                    :placeholder="$t('browse.placeholder')"
                    @delete-query="selectedQuery = ''"
                    @keyup.enter="search"
                />
                <LpiButton
                    class="search-button"
                    :label="$t('browse.page-title')"
                    @click="search"
                    data-test="search-input-button"
                />
            </div>
        </div>
    </div>
</template>

<script>
import SearchInput from '@/components/base/form/SearchInput.vue'
import SearchOptionDropDown from '@/components/search/SearchOptionDropDown/SearchOptionDropDown.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import { ALL_SECTION_KEY } from '@/components/search/Filters/useSectionFilters.ts'

export default {
    name: 'HomeSearchOptions',

    emits: ['search'],

    components: {
        SearchOptionDropDown,
        SearchInput,
        LpiButton,
    },

    data() {
        return {
            selectedQuery: '',
            selectedSection: ALL_SECTION_KEY,
        }
    },

    methods: {
        search() {
            this.$emit('search', {
                search: this.selectedQuery,
                section: this.selectedSection,
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.search-block {
    margin: 0;
    padding: $space-m 0;
    width: 100%;
}

.search-container {
    display: flex;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    flex-direction: unset;

    .search-group {
        display: flex;
        flex-direction: column;
        align-items: center;

        @media (min-width: $min-tablet) {
            flex-direction: row;
            width: 100%;
            justify-content: center;

            .search-button {
                margin-left: $space-l;
            }
        }
    }
}

.search-input {
    margin-bottom: $space-m;
    width: pxToRem(600px); // drop is 250px so 350 + 250 = 600

    @media (max-width: $min-tablet) {
        width: 100%;
    }

    @media (min-width: $min-tablet) {
        margin-bottom: 0;

        &.has-sections :deep(.search-input) {
            border-top-left-radius: 0 !important;
            border-bottom-left-radius: 0;
        }
    }

    &.has-sections {
        width: pxToRem(350px);
    }
}
</style>
