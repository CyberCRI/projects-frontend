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
import { searchAll, searchProjects, searchGroupsAlgolia, searchUser } from '@/api/search.service'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import { axios } from '@/api/api.config'
import { searchEquals } from '@/functs/search.ts'
import { toRaw } from 'vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
    name: 'SearchResults',

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
            // global, projects, groups, people
            type: String,
            default: 'global',
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
            items: [],
            isLoading: true,
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

    methods: {
        onClickPagination(requestedPage) {
            this.loadProjects(requestedPage)
            this.$el.scrollIntoView({ behavior: 'smooth' })
        },

        initProjectLoading() {
            this.items = []
            this.isLoading = true
            this.$emit('loading', true)
        },

        async _loadProjects(specificPageIndex = null) {
            const filters = {
                ...this.search,
                organizations: [this.organizationsStore.current.code],
            }

            const query = filters.search ? encodeURIComponent(filters.search) : null
            delete filters.search

            // if we forced a page (on page load only)
            // manually compute offset
            const page = parseInt(filters.page || 1)
            if (page > 1) {
                filters['offset'] = (page - 1) * filters.limit
            }
            delete filters.page

            this.lastRequest++
            const localRequest = this.lastRequest

            this.initProjectLoading()
            // Get projects and update project list
            let response

            if (specificPageIndex) {
                response = (await axios.get(specificPageIndex)).data
            } else if (this.mode === 'projects') {
                response = await searchProjects(query, filters)
            } else if (this.mode === 'groups') {
                response = await searchGroupsAlgolia(query, filters)
            } else if (this.mode === 'people') {
                response = await searchUser(query, filters)
            } else {
                // assume mode === 'global'
                response = await searchAll(query, {
                    limit: 30,
                    organizations: this.organisation.code,
                })
            }
            if (response && localRequest === this.lastRequest) this.updateProjectList(response)
        },

        updateProjectList(response) {
            this.updatePagination(response)
            // Set new projects and end loading
            const maxResults = response.max_results || this.searchLimit

            this.$emit('number-project', response.count)

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
