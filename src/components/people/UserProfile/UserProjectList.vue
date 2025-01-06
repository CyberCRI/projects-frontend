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

        <div>
            <CardList
                :is-preview="isPreview"
                :desktop-columns-number="numberColumn"
                :is-loading="projectsLoading"
                :limit="limit"
                :items="croppedProjects"
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
                    @update-pagination="$emit('pagination-changed', $event)"
                />
            </div>
        </div>
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

    emits: ['project-count', 'navigated-away', 'card-update', 'pagination-changed'],

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
            required: true,
        },

        allProjectCount: {
            type: Number,
            default: 0,
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
        pagination: {
            type: Object,
            default: () => ({
                // to check
                currentPage: 1,
                total: 1,
                pageSize: 12,
                next: null,
                previous: null,
                first: null,
                last: null,
            }),
        },
    },

    data() {
        return {
            currentPage: 1,
        }
    },
    computed: {
        gridLayout() {
            return `desktop-col--${this.numberColumn}`
        },
        // pagination() {
        //     const total = Math.ceil(this.allProjectCount / this.limit)
        //     return {
        //         currentPage: this.currentPage,
        //         total: total,
        //         pageSize: this.limit,
        //         next: this.currentPage < total ? this.currentPage + 1 : null,
        //         previous: this.currentPage > 1 ? this.currentPage - 1 : null,
        //         first: 1,
        //         last: total,
        //     }
        // },

        // listStart() {
        //     return (this.currentPage - 1) * this.limit
        // },

        croppedProjects() {
            const safeProjects = this.projects || []
            // return this.limit
            //     ? safeProjects.slice(this.listStart, this.listStart + this.limit)
            //     : safeProjects

            return safeProjects
        },
    },
    methods: {
        goToProfileProjects() {
            this.selectTab(2)
        },
        // onClickPagination(requestedPage) {
        //     this.currentPage = requestedPage
        // },
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
