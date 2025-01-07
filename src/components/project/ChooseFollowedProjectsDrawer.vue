<template>
    <BaseDrawer
        :is-opened="isOpened"
        :title="$t('profile.edit.projects.followed.drawer-title')"
        @close="close"
        @confirm="close"
        :asyncing="asyncing"
    >
        <div>
            <div class="search-container">
                <div class="search-group">
                    <SearchInput
                        class="search-input"
                        v-model="search"
                        full
                        :placeholder="$t('browse.placeholder')"
                        @delete-query="search = ''"
                    />
                </div>
            </div>
            <div>
                <SearchResults :search="query" mode="projects">
                    <template #default="SearchResultsSlotProps">
                        <CardList
                            :desktop-columns-number="6"
                            :is-loading="SearchResultsSlotProps.isLoading"
                            :limit="SearchResultsSlotProps.limit"
                            :items="SearchResultsSlotProps.items"
                            class="list-container"
                        >
                            <template #default="projectListSlotProps">
                                <ProjectCard
                                    :project="projectListSlotProps.item.project"
                                    follow-on-click
                                />
                            </template>
                        </CardList>
                    </template>
                </SearchResults>
            </div>
        </div>

        <template #footer>
            <LpiButton
                :label="$t('header.close')"
                class="footer__right-button"
                @click="close"
                data-test="close-button"
            />
        </template>
    </BaseDrawer>
</template>

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import SearchInput from '@/components/base/form/SearchInput.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import CardList from '@/components/base/CardList.vue'
import SearchResults from '@/components/project/SearchResults.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
    name: 'ChooseFollowedProjectsDrawer',

    emits: ['close'],

    components: { BaseDrawer, ProjectCard, CardList, SearchResults, SearchInput, LpiButton },

    props: {
        isOpened: {
            type: Boolean,
            default: false,
        },
    },

    setup() {
        const organizationsStore = useOrganizationsStore()
        return { organizationsStore }
    },

    data() {
        return {
            search: '',
        }
    },

    watch: {
        isOpened: function () {
            this.search = ''
        },
    },

    computed: {
        query() {
            return {
                search: this.search,
                categories: [],
                tags: [],
                members: [],
                sdgs: [],
                languages: [],
                organizations: [this.organizationsStore.current.code],
                ordering: '-updated_at',
                limit: 30,
                page: 1,
                section: 'projects',
            }
        },
    },

    methods: {
        close() {
            this.$emit('close')
        },
    },
}
</script>

<style lang="scss" scoped>
.clear {
    font-size: $font-size-s;
    color: $primary-dark;
    font-weight: 700;
    text-decoration: underline;
    margin-left: $space-l;
    cursor: pointer;
}

.results-ctn {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: $space-m;
    padding-inline: $space-l;
    padding-bottom: $space-l;

    .selected-card {
        background-color: $primary-lighter;
    }
}

.show-more {
    display: flex;
    justify-content: center;
    margin: $space-l 0;
}

.project-placeholder {
    height: $card_height;
    width: $card_width;
    border: $border-width-s solid $lighter-gray;
    border-radius: $border-radius-m;

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: $space-m $space-m 0 $space-m;
        height: 100%;
    }

    .picture {
        display: inline-block;

        $picture-width: 86px;

        width: pxToRem($picture-width);
        height: pxToRem($picture-width);
        border-radius: $border-radius-xs;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        background-color: $lighter-gray;
        box-shadow: 0 0 2px rgb(0 0 0 / 15%);
    }
}
</style>
