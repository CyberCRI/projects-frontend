<template>
    <div class="project-selection">
        <section class="search-section">
            <SearchInput
                v-model="queryString"
                :full="true"
                :placeholder="$filters.capitalize($t('search.projects'))"
                class="input"
                @enter="launchSearch"
                @delete-query="deleteQuery"
            />
            <LpiButton
                v-if="!isLoading && matchingProjectsFiltered.length"
                class="select-btn"
                :secondary="true"
                :label="$filters.capitalize($t('drawer.select-all'))"
                @click="selectAll"
            />
        </section>

        <section v-if="queryString.length >= 3" class="results-section">
            <LoaderSimple class="loader" v-if="isLoading" />
            <template v-else>
                <div v-if="matchingProjectsFiltered.length" class="results-ctn">
                    <ProjectCard
                        v-for="matchingProject in matchingProjectsFiltered"
                        :key="matchingProject.id"
                        :has-add-icon="!matchingProject.selected"
                        :custom-icon="matchingProject.selected ? 'Check' : ''"
                        :project="matchingProject"
                        @add="selectProject(matchingProject)"
                        :class="{ 'selected-card': matchingProject.selected }"
                    />
                </div>

                <div v-else class="no-result-message">
                    {{ $t('search.nothing-found') }}
                    {{ $t('common.for') }}
                    &quot;{{ queryString }}&quot;
                </div>
            </template>
            <div v-if="!isLoading && pagination.total > 1" class="pagination-container">
                <PaginationButtons
                    :current="pagination.currentPage"
                    :pagination="pagination"
                    :total="pagination.total"
                    @update-pagination="onClickPagination"
                />
            </div>
        </section>
    </div>
</template>

<script>
import debounce from 'lodash.debounce'
import { getAllProjects, searchProjects } from '@/api/projects.service'
import LpiButton from '@/components/base/button/LpiButton.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import SearchInput from '@/components/base/form/SearchInput.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import { axios } from '@/api/api.config'

export default {
    name: 'PickProjectSelection',

    emits: ['select-project', 'batch-project', 'search-done'],

    components: {
        ProjectCard,
        LpiButton,
        SearchInput,
        LoaderSimple,
        PaginationButtons,
    },

    data() {
        return {
            queryString: '',
            isLoading: false,
            request: {},
        }
    },

    props: {
        selectedProjects: {
            type: Array,
            default: () => [],
        },
        canPickMore: {
            type: Boolean,
            default: true,
        },
    },

    computed: {
        matchingProjects() {
            return this.request ? this.request.results : []
        },
        matchingProjectsFiltered() {
            // mark already selected project as such
            return (this.matchingProjects || []).map((project) => ({
                ...project,
                selected: this.selectedProjects.some((selProject) => selProject.id === project.id),
            }))
        },
        pagination() {
            if (!this.request) return { total: 0 }
            return {
                currentPage: this.request.current_page,
                total: this.request.total_page,
                previous: this.request.previous,
                next: this.request.next,
                first: this.request.first,
                last: this.request.last,
            }
        },
    },

    watch: {
        queryString: function (val) {
            if (val.length >= 3) this.launchSearch()
            if (this.queryString === '') this.request = {}
        },
    },

    methods: {
        launchSearch: debounce(async function () {
            this.isLoading = true

            const filters = {
                limit: 24,
                organizations: this.$store.getters['organizations/current'].code,
            }

            if (this.queryString) {
                this.request = await searchProjects(encodeURIComponent(this.queryString), filters)
            } else {
                this.request = await getAllProjects(filters)
            }

            this.isLoading = false
            this.$emit('search-done', true)
        }, 500),

        async onClickPagination(requestedPage) {
            this.isLoading = true
            this.request = (await axios.get(requestedPage)).data
            this.isLoading = false
            const el = document.querySelector('.project-selection .search-section')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        },

        selectProject(project) {
            this.$emit('select-project', project)
            if (!this.canPickMore) return
            project.selected = true
            this.$forceUpdate()
        },

        selectAll() {
            this.$emit('batch-project', this.matchingProjectsFiltered)
            this.$forceUpdate()
        },

        deleteQuery() {
            this.queryString = ''
        },
    },
}
</script>

<style lang="scss" scoped>
.project-selection {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
}

.search-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .input-ctn {
        flex-grow: 1;
    }

    button {
        margin-left: $space-m;
        width: 30%;
    }
}

.results-section {
    border-radius: $border-radius-m;

    .results-ctn {
        display: flex;
        flex-wrap: wrap;
        place-content: flex-start space-between;
        gap: $space-m;
        overflow: hidden;
        padding-top: 40px;
        padding-bottom: $space-l;
        padding-inline: 1px;
    }

    .no-result-message {
        text-align: center;
        margin-top: 20px;
    }
}

.loader {
    margin: 0 auto;
    margin-top: $space-2xl;
}

.selected-card {
    background-color: $primary-lighter;
    pointer-events: none;
    cursor: default;
}

.pagination-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: $space-xl;
}
</style>
