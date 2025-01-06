<template>
    <div>
        <div class="project-list-header">
            <h4 class="title" v-if="label">
                {{ label }} <span>({{ allProjectCount }})</span>
            </h4>
            <SeeMoreArrow
                v-if="isPreview && allProjectCount > limit"
                @click.prevent="goToProfileProjects"
                data-test="see-more"
            />
        </div>

        <div v-if="projects">
            <CardList
                :is-preview="isPreview"
                :desktop-columns-number="numberColumn"
                :is-loading="projectsLoading"
                :limit="limit"
                :items="limit ? projects.slice(listStart, listStart + limit) : projects"
            >
                <template #default="projectListSlotProps">
                    <ProjectCard
                        v-if="projectListSlotProps.item"
                        :horizontal-display="true"
                        :project="projectListSlotProps.item"
                        @card-update="$emit('card-update')"
                    />
                </template>
                <template #empty>
                    <div class="empty-ctn" :class="gridLayout">
                        <EmptyCard class="empty-card" :label="emptyLabel" />
                    </div>
                </template>
            </CardList>
            <div
                v-if="pagination.total > 1 && !projectsLoading && !isPreview"
                class="project-list-search__footer"
            >
                <PaginationButtons
                    :current="pagination.currentPage"
                    :pagination="pagination"
                    :total="pagination.total"
                    @update-pagination="onClickPagination"
                />
            </div>
        </div>

        <SearchResults
            v-else
            :is-preview="isPreview"
            :search="{
                limit: limit,
                ordering: '-updated_at',
                member_role: memberRole,
                members: [user.id],
            }"
            mode="projects"
            :show-pagination="true"
            @number-project="setProjectCount"
        >
            <template #default="SearchResultsSlotProps">
                <CardList
                    :desktop-columns-number="numberColumn"
                    :is-loading="SearchResultsSlotProps.isLoading"
                    :limit="limit"
                    :items="SearchResultsSlotProps.items"
                >
                    <template #default="projectListSlotProps">
                        <ProjectCard
                            v-if="projectListSlotProps.item"
                            :horizontal-display="true"
                            :project="projectListSlotProps.item"
                            @navigated-away="$emit('navigated-away')"
                            @card-update="$emit('card-update')"
                        />
                    </template>
                    <template #empty>
                        <div class="empty-ctn" :class="gridLayout">
                            <EmptyCard class="empty-card" :label="emptyLabel" />
                        </div>
                    </template>
                </CardList>
            </template>
        </SearchResults>
    </div>
</template>

<script>
import SearchResults from '@/components/project/SearchResults.vue'
import CardList from '@/components/base/CardList.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import SeeMoreArrow from '@/components/base/button/SeeMoreArrow.vue'
import EmptyCard from './EmptyCard.vue'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'

export default {
    name: 'UserProjectList',

    emits: ['project-count', 'navigated-away', 'card-update'],

    components: {
        SearchResults,
        CardList,
        ProjectCard,
        SeeMoreArrow,
        EmptyCard,
        PaginationButtons,
    },

    inject: {
        selectTab: {
            from: 'tabsLayoutSelectTab',
            default: () => {},
        },
    },

    props: {
        projects: {
            // use this to pass project list (without making a request here)
            type: [Array, Boolean],
            default: false,
        },

        projectsLoading: {
            type: Boolean,
            default: false,
        },

        user: {
            type: Object,
            required: true,
        },

        memberRole: {
            type: Array,
            default: () => ['owners', 'members', 'reviewers'],
        },

        label: {
            type: String,
            default: null,
        },

        emptyLabel: {
            type: String,
            default: null,
        },

        numberColumn: {
            type: Number,
            default: 4,
        },

        isPreview: {
            type: Boolean,
            default: false,
        },

        limit: {
            type: Number,
            default: 12,
        },
    },

    data() {
        return {
            allProjectCount: 0,
            inited: false,
            currentPage: 1,
        }
    },
    computed: {
        gridLayout() {
            return `desktop-col--${this.numberColumn}`
        },
        pagination() {
            const total = Math.ceil(this.allProjectCount / this.limit)
            return {
                currentPage: this.currentPage,
                total: total,
                pageSize: this.limit,
                next: this.currentPage < total ? this.currentPage + 1 : null,
                previous: this.currentPage > 1 ? this.currentPage - 1 : null,
                first: 1,
                last: total,
            }
        },

        listStart() {
            return (this.currentPage - 1) * this.limit
        },
    },
    methods: {
        setProjectCount(number) {
            this.allProjectCount = number
            this.inited = true
            this.$emit('project-count', number)
        },

        goToProfileProjects() {
            this.selectTab(2)
        },
        onClickPagination(requestedPage) {
            this.currentPage = requestedPage
        },
    },
    watch: {
        projects: {
            handler: function (neo) {
                if (neo) this.setProjectCount(neo.length)
            },
            deep: true,
            immediate: true,
        },
    },
}
</script>

<style lang="scss" scoped>
.project-list-header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin: $space-2xl 0 $space-l 0;
}

.title {
    font-size: $font-size-l;
    font-weight: 700;
    color: $primary-dark;
    margin: 0;
}

.empty-ctn {
    display: grid;
    justify-items: center;
    justify-content: left;
    grid-template-columns: $card_width;
}

// taken from SearchResults
// TODO factorize this
.project-list-search__footer {
    padding-top: $space-l;
    padding-bottom: $space-2xl;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
