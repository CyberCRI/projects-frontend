<template>
    <div :id="projectListId">
        <slot
            :is-loading="isLoading"
            :limit="limit"
            :items="items"
            :total-count="totalCount"
            :pagination="pagination"
            :paginationAction="onClickPagination"
        ></slot>
    </div>
</template>

<script>
import debounce from 'lodash.debounce'
import funct from '@/functs/functions.ts'
import { getAllProjects } from '@/api/projects.service'
import { getUserFollows } from '@/api/follows.service'

import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import { axios } from '@/api/api.config'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
    name: 'UserProjectSearch',

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
        follow: {
            // if true, show followed projects
            type: Boolean,
            default: false,
        },

        memberRoles: {
            type: Array,
            default: () => [],
        },

        user: { type: Object, required: true },

        limit: {
            // limit of projects to show
            type: Number,
            default: 12,
        },

        ///////////////////

        isPreview: {
            // used to prevent pagination from showing
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            projectListId: funct.newSID(true),
            items: [],
            isLoading: true,
            loadProjects: debounce(this._loadProjects, 40, { leading: false, trailing: true }),
            lastRequest: 0,
            totalCount: 0,
            pagination: {
                currentPage: 1,
                total: 1,
                previous: undefined,
                next: undefined,
                first: undefined,
                last: undefined,
            },
        }
    },

    computed: {
        organisation() {
            return this.organizationsStore.current
        },
        search() {
            return {
                limit: this.limit,
                ordering: '-updated_at',
                member_role: this.memberRoles,
                members: [this.user.id],
                organizations: [this.organizationsStore.current.code],
                // page: this.pagination.currentPage,
            }
        },
    },

    watch: {
        search: {
            handler() {
                this.loadProjects()
            },
            immediate: true,
            deep: true,
        },
    },

    methods: {
        initProjectLoading() {
            this.items = []
            this.isLoading = true
            this.$emit('loading', true)
        },

        async _loadProjects(specificPageIndex = null) {
            this.lastRequest++
            const localRequest = this.lastRequest

            this.initProjectLoading()
            // Get projects and update project list
            let response

            if (specificPageIndex) {
                response = (await axios.get(specificPageIndex)).data
            } else if (this.follow) {
                response = await getUserFollows(
                    {
                        follower_id: this.user.id,
                    },
                    { limit: this.limit }
                )
            } else {
                response = await getAllProjects(this.search)
            }

            /*if (response && localRequest === this.lastRequest)*/ this.updateProjectList(response)
        },

        updateProjectList(response) {
            this.updatePagination(response)
            // Set new projects and end loading
            const maxResults = response.max_results || this.limit

            this.$emit('number-project', response.count)

            this.totalCount = response.count
            if (this.follow) {
                let results = response.results?.map((follow) => follow.project) || []
                this.items.push(...results.slice(0, maxResults))
            } else {
                this.items.push(...response.results.slice(0, maxResults))
            }
            this.isLoading = false
            this.$emit('loading', false)

            // Make Home.vue show/hide my-projects section depending on new projects length
            this.$emit('list-updated', response.count)
        },

        onClickPagination(requestedPage) {
            console.log('pagination clicked', requestedPage)
            // this.pagination.currentPage = requestedPage
            this.loadProjects(requestedPage)
            this.$el.scrollIntoView({ behavior: 'smooth' })
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
