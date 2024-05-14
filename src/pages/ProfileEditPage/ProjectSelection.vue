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
                v-if="searchDone"
                class="select-btn"
                :secondary="true"
                :label="$filters.capitalize($t('drawer.select-all'))"
                @click="selectAll"
            />
        </section>

        <section v-if="searchDone" class="results-section">
            <div
                v-if="matchingProjectsFiltered && matchingProjectsFiltered.length"
                class="results-ctn"
            >
                <ProjectCard
                    v-for="matchingProject in matchingProjectsFiltered"
                    :key="matchingProject.id"
                    :has-add-icon="true"
                    :project="matchingProject"
                    @add="selectProject(matchingProject)"
                />
            </div>

            <div v-else class="no-result-message">
                {{ $t('search.nothing-found') }}
                {{ $t('common.for') }}
                &quot;{{ queryString }}&quot;
            </div>
        </section>
    </div>
</template>

<script>
import { getAllProjects, searchProjects } from '@/api/projects.service'
import LpiButton from '@/components/base/button/LpiButton.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import SearchInput from '@/components/base/form/SearchInput.vue'

export default {
    name: 'ProjectSelection',

    emits: ['select-project', 'batch-project', 'search-done'],

    components: {
        ProjectCard,
        LpiButton,
        SearchInput,
    },

    data() {
        return {
            queryString: '',
            isLoading: false,
            matchingProjects: [],
            searchDone: false,
        }
    },

    props: {
        selectedProjects: {
            type: Array,
            default: () => [],
        },
        followedProjects: {
            type: Array,
            default: () => [],
        },
    },

    computed: {
        matchingProjectsFiltered() {
            // Don't propose already followed projects
            let filteredProjects = this.matchingProjects.filter(
                (matchingProject) =>
                    !this.followedProjects.some((project) => project.id === matchingProject.id)
            )
            if (this.selectedProjects.length) {
                filteredProjects = filteredProjects.filter(
                    (project) =>
                        !this.selectedProjects.some((selProject) => selProject.id === project.id)
                )
            }
            return filteredProjects
        },
    },

    methods: {
        async launchSearch() {
            this.isLoading = true

            const filters = {
                limit: 24,
                organizations: this.$store.getters['organizations/current'].code,
            }
            let projects
            if (this.queryString) {
                projects = await searchProjects(encodeURIComponent(this.queryString), filters)
            } else {
                projects = await getAllProjects(filters)
            }

            this.matchingProjects = projects.results
            if (!this.searchDone) this.searchDone = true
            this.isLoading = false
            this.$emit('search-done', true)
        },

        selectProject(project) {
            this.$emit('select-project', project)
            const projectIndexToDelete = this.matchingProjectsFiltered.indexOf(project)
            if (projectIndexToDelete > -1)
                this.matchingProjectsFiltered.splice(projectIndexToDelete, 1)
            this.$forceUpdate()
        },

        selectAll() {
            this.$emit('batch-project', this.matchingProjectsFiltered)
            this.$forceUpdate()
        },

        deleteQuery() {
            this.queryString = ''
            this.searchDone = false
            this.$emit('search-done', false)
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
    width: 50%;

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
</style>
