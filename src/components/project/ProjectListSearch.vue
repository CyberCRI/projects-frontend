<template>
    <div :id="projectListId">
        <slot
            :is-loading="isLoading"
            :limit="searchLimit"
            :items="items"
            :total-count="totalCount"
        ></slot>

        <div
            v-if="showPagination && pagination.total > 1 && !isLoading && !isPreview"
            class="project-list-search__footer"
        >
            <PaginationButtons
                v-if="paginationButtonsIsVisible"
                :current="pagination.currentPage"
                :pagination="pagination"
                :total="pagination.total"
                @update-pagination="onClickPagination"
            />
        </div>
    </div>
</template>

<script>
import debounce from 'lodash.debounce'
import funct from '@/functs/functions.ts'
import {
    getAllProjects,
    getAllRandomProjects,
    getAllRecommendedProjects,
} from '@/api/projects.service'
import { searchAll, searchProjects, searchGroupsAlgolia, searchUser } from '@/api/search.service'

import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import { axios } from '@/api/api.config'
import { searchEquals } from '@/functs/search.ts'
import { toRaw } from 'vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
    name: 'ProjectListSearch',

    emits: ['number-project', 'list-updated', 'pagination-changed', 'loading'],

    components: {
        PaginationButtons,
    },
    setup() {
        const organizationsStore = useOrganizationsStore()
        return {
            organizationsStore,
        }
    },

    props: {
        showPagination: {
            type: Boolean,
            default: false,
        },
        search: {
            type: Object,
            default: () => {},
        },
        isPreview: {
            // used to prevent pagination from showing
            type: Boolean,
            default: false,
        },
        mode: {
            // global, projects, groups, peoples
            type: String,
            default: 'projects',
        },
        paginationButtonsIsVisible: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            projectListId: funct.newSID(true),
            pagination: {
                currentPage: this.search && this.search.page ? this.search.page : 1,
                total: 1,
                previous: undefined,
                next: undefined,
                first: undefined,
                last: undefined,
            },
            // projects: [],
            // groups: [],
            // peoples: [],
            items: [],
            isLoading: true,
            projectListTotal: 0,
            loadProjects: debounce(this._loadProjects, 40, { leading: false, trailing: true }),
            lastRequest: 0,
            totalCount: 0,
        }
    },

    computed: {
        searchLimit() {
            return this.search && this.search.limit ? this.search.limit : 12
        },

        organisation() {
            return this.organizationsStore.current
        },
    },

    watch: {
        search: {
            handler(neo, old) {
                // avoid call to api if search has not changed
                let proceed = false
                if (neo && old) {
                    proceed = !searchEquals(toRaw(neo), toRaw(old))
                } else {
                    // don't proceed if search is null
                    proceed = !!neo
                }
                if (proceed) this.loadProjects()
            },
            immediate: true,
        },
    },

    inject: {
        browseLayoutUpdateProjectQuantity: {
            from: 'browseLayoutUpdateProjectQuantity',
            default: () => {},
        },
    },

    methods: {
        onClickPagination(requestedPage) {
            this.loadProjects(requestedPage)
            this.$el.scrollIntoView({ behavior: 'smooth' })
        },

        initProjectLoading() {
            // this.projects = []
            // this.groups = []
            // this.peoples = []
            this.items = []
            this.isLoading = true
            this.$emit('loading', true)
        },

        async _loadProjects(specificPageIndex) {
            const filters = {
                ...this.search,
                organizations: [this.organizationsStore.current.code],
            }
            const query = encodeURIComponent(filters.search)
            delete filters.search

            // if we forced a page (on page load only)
            // manually compute offset
            if (this.search.page && this.search.page > 1) {
                filters['offset'] = (this.search.page - 1) * filters.limit
            }
            delete filters.page

            this.lastRequest++
            const localRequest = this.lastRequest

            this.initProjectLoading()
            // Get projects and update project list
            let response

            if (specificPageIndex) {
                response = (await axios.get(specificPageIndex)).data
            } else if (filters.ordering === 'recommended') {
                response = await getAllRecommendedProjects(filters)
            } else if (filters.ordering === 'random') {
                response = await getAllRandomProjects(filters)
            } else if (this.search.search) {
                if (this.mode === 'global')
                    response = await searchAll(query, {
                        limit: 30,
                        organizations: this.organisation.code,
                    })
                else if (this.mode === 'projects') response = await searchProjects(query, filters)
                else if (this.mode === 'groups')
                    response = await searchGroupsAlgolia(query, filters)
                else if (this.mode === 'peoples') response = await searchUser(query, filters)
                // if this.search.search is undefined, query will be string "undefined"
                // that's why we check on this.search.search and not query
                else response = await searchProjects(query, filters)
            } else {
                /* This is else when the page / tabs loads project with no particular search */
                if (this.mode === 'global')
                    response = await searchAll(null, {
                        ...filters,
                        limit: 30,
                        organizations: this.organisation.code,
                    })
                else if (this.mode === 'projects')
                    if (filters.member_role) {
                        // search by role is not implemented in algolia
                        // so fallback to old API for now
                        // (used in user profile page)
                        response = await getAllProjects(filters)
                    } else {
                        response = await searchProjects(null, filters)
                    }
                else if (this.mode === 'groups') response = await searchGroupsAlgolia(null, filters)
                else if (this.mode === 'peoples') response = await searchUser(null, filters)
                else
                    response = await getAllProjects(
                        {
                            ...filters,
                            ordering: '-updated_at',
                        },
                        { limit: this.searchLimit }
                    )
            }

            if (response && localRequest === this.lastRequest) this.updateProjectList(response)
        },

        updateProjectList(response) {
            this.projectListTotal = response.count
            /*
                update results quantity in search page only
                BUT on this page, this component also appear in user profile drawer (through UserProfileList)
                in this case we don't update the search projects count
                luckily drawer is not a descendant of BrowseLayout so the quantity update method is not injected...
            */
            if (this.$route.name === 'search' && this.browseLayoutUpdateProjectQuantity) {
                this.browseLayoutUpdateProjectQuantity(response.count)
            }

            this.updatePagination(response)
            // Set new projects and end loading
            const maxResults = response.max_results || this.searchLimit

            this.$emit('number-project', response.count)

            // if (this.mode === 'global') {
            //     this.projects.push(...response[0].results.slice(0, maxResults))
            //     this.peoples.push(...response[1].results.slice(0, maxResults))
            //     this.groups.push(...response[2].results.slice(0, maxResults))
            //     this.totalCount.projects = response[0].count
            //     this.totalCount.peoples = response[1].count
            //     this.totalCount.groups = response[2].count
            // } else if (this.mode === 'projects') {
            //     this.totalCount.projects = response.count
            //     this.projects.push(...response.results.slice(0, maxResults))
            // } else if (this.mode === 'groups') {
            //     this.totalCount.groups = response.count
            //     this.groups.push(...response.results.slice(0, maxResults))
            // } else if (this.mode === 'peoples') {
            //     this.totalCount.peoples = response.count
            //     this.peoples.push(...response.results.slice(0, maxResults))
            // }

            this.totalCount = response.count
            this.items.push(...response.results.slice(0, maxResults))
            this.isLoading = false
            this.$emit('loading', false)

            // Make Home.vue show/hide my-projects section depending on new projects length
            this.$emit('list-updated', response.count)
        },

        updatePagination(response) {
            this.pagination.currentPage = response.current_page
            const maxResults = response.max_results || 12
            this.pagination.total = response.total_page || Math.ceil(response.count / maxResults)
            this.pagination.previous = response.previous
            this.pagination.next = response.next
            this.pagination.first = response.first
            this.pagination.last = response.last

            this.$emit('pagination-changed', this.pagination)
        },
    },
}
</script>

<style lang="scss" scoped>
.project-list-search__footer {
    padding-top: $space-l;
    padding-bottom: $space-2xl;
    display: flex;
    justify-content: center;
    align-items: center;
}

.additional-projects {
    border: $border-width-l solid $primary-dark;
    border-radius: $border-radius-l;
    color: $primary-dark;
    cursor: pointer;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    &__counter {
        font-weight: 700;
    }
}
</style>
