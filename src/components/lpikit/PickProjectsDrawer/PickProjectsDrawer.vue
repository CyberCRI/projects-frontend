<template>
    <DrawerLayout
        :is-opened="isOpened"
        :title="drawerTitle"
        :padding="true"
        @close="close"
        @confirm="confirm"
    >
        <template v-if="listProjects.length" #header_clear>
            <div class="clear" @click="clearSelection">
                {{ $t('drawer.clear') }}
            </div>
        </template>

        <div v-if="listProjects.length" class="results-ctn">
            <ProjectCard
                v-for="project in filteredProjects"
                :key="project.id"
                :has-close-icon="true"
                :project="project"
                class="selected-card"
                @unselect="unselectProject"
            />
        </div>
        <div class="show-more" v-if="listProjects?.length > listLimit">
            <LpiButton
                class="see-more-btn"
                :label="$filters.capitalize($t(seeMoreLabel))"
                size="link"
                @click="isSeeMore = !isSeeMore"
            />
        </div>
        <PickProjectSelection
            :selected-projects="listProjects"
            @select-project="addProject"
            @batch-project="addBatch"
        />
    </DrawerLayout>
</template>

<script>
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import PickProjectSelection from './PickProjectSelection.vue'
import ProjectCard from '@/components/peopleKit/ProjectCard.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'PickProjectsDrawer',

    emits: ['close', 'picked-projects'],

    components: { DrawerLayout, PickProjectSelection, ProjectCard, LpiButton },

    props: {
        drawerTitle: {
            type: String,
            default: '',
        },

        preSelectedProjects: {
            type: Array,
            default: () => [],
        },
        isOpened: {
            type: Boolean,
            default: false,
        },
        listLimit: {
            type: Number,
            default: 5,
        },
    },

    data() {
        return {
            selectedProject: null,
            listProjects: [],
            isSeeMore: false,
        }
    },

    watch: {
        isOpened: {
            handler: function (neo) {
                if (neo) {
                    this.listProjects = [...this.preSelectedProjects]
                }
            },
            immediate: true,
        },
    },

    computed: {
        filteredProjects() {
            return this.isSeeMore ? this.listProjects : this.listProjects.slice(0, this.listLimit)
        },
        seeMoreLabel() {
            return this.isSeeMore ? 'common.see-less' : 'common.see-more'
        },
    },
    methods: {
        async addProject(project) {
            this.listProjects.push(project)
        },

        async addBatch(projects) {
            this.listProjects = this.listProjects.concat(projects)
        },

        async confirm() {
            this.$emit('picked-projects', this.listProjects)
            this.close()
        },

        close() {
            this.listProjects.splice(0)
            this.$emit('close')
        },

        clearSelection() {
            this.listProjects.splice(0)
        },
        unselectProject(project) {
            let index = this.listProjects.indexOf(project)
            if (index > -1) {
                this.listProjects.splice(index, 1)
            }
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
</style>
