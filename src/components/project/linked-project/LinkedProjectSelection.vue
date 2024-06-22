<template>
    <div class="project-selection">
        <section class="search-section">
            <SearchInput
                v-model="queryString"
                :full="true"
                :placeholder="$filters.capitalize($t('search.projects'))"
                class="input"
                @enter="immediateSearch"
                @delete-query="deleteQuery"
            />
            <LpiButton
                v-if="!isLoading"
                class="select-btn"
                :secondary="true"
                :label="$filters.capitalize($t('drawer.select-all'))"
                @click="selectAll"
            />
        </section>

        <section class="loader" v-if="isLoading"><LoaderSimple /></section>

        <section v-else class="results-section">
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
        </section>
        <div v-if="!isLoading && pagination.total > 1" class="pagination-container">
            <PaginationButtons
                :current="pagination.currentPage"
                :pagination="pagination"
                :total="pagination.total"
                @update-pagination="onClickPagination"
            />
        </div>
    </div>
</template>

<script>
import { searchProjects } from '@/api/search.service'
import LpiButton from '@/components/base/button/LpiButton.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import SearchInput from '@/components/base/form/SearchInput.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import debounce from 'lodash.debounce'
import PaginationButtons from '@/components/base/navigation/PaginationButtons.vue'
import { axios } from '@/api/api.config'
export default {
    name: 'LinkedProjectSelection',

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
            isLoading: true,
            request: {},
        }
    },

    props: {
        selectedProjects: {
            type: Array,
            default: () => [],
        },
    },

    mounted() {
        this.immediateSearch()
    },

    computed: {
        project() {
            return this.$store.getters['projects/project']
        },

        matchingProjectsFiltered() {
            // mark already linked projects as such
            return this.matchingProjects.map((matchingProject) => {
                const selected =
                    // is the current prohect ?
                    matchingProject.id == this.$store.getters['projects/currentProjectId'] ||
                    // or an already linked project ?
                    (this.project.linked_projects || []).some(
                        (project) => project.project.id === matchingProject.id
                    ) ||
                    // or a currently selected project ?
                    (this.selectedProjects || []).some(
                        (selProject) => selProject.id === matchingProject.id
                    )

                return {
                    ...matchingProject,
                    selected: selected,
                }
            })
        },

        matchingProjects() {
            return this.request && this.request.results
                ? this.request.results.map((result) => result.project)
                : []
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

    methods: {
        async onClickPagination(requestedPage) {
            this.isLoading = true
            this.request = (await axios.get(requestedPage)).data
            this.isLoading = false
            const el = document.querySelector('.project-selection .search-section')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        },

        async immediateSearch() {
            this.isLoading = true

            const filters = {
                limit: 24,
                organizations: this.$store.getters['organizations/current'].code,
            }

            if (this.queryString) {
                this.request = await searchProjects(encodeURIComponent(this.queryString), filters)
            } else {
                this.request = await searchProjects('', filters)
            }

            this.isLoading = false
            this.$emit('search-done', true)
        },

        launchSearch: debounce(async function () {
            await this.immediateSearch()
        }, 500),

        selectProject(project) {
            this.$emit('select-project', project)
            project.selected = true
            this.$forceUpdate()
        },

        selectAll() {
            this.$emit('batch-project', this.matchingProjectsFiltered)
            this.$forceUpdate()
        },
        deleteQuery() {
            this.queryString = ''
            this.launchSearch()
        },
    },

    watch: {
        queryString() {
            if (this.queryString.length >= 3) {
                this.launchSearch()
            }
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

    .input {
        width: 65%;
    }

    button {
        margin-left: $space-m;
        width: 30%;
    }
}

.loader {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
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
