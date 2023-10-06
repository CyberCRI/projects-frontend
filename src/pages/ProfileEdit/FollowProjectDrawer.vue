<template>
    <DrawerLayout
        :is-opened="isOpened"
        :has-footer="hasFooter"
        :title="
            listProjects.length
                ? $t('project.add-project-follow') + ' (' + listProjects.length + ')'
                : $t('project.add-project-follow')
        "
        :selected-projects="listProjects"
        :padding="true"
        @unselect="unselectProject"
        @close="closeModal"
        @confirm="addFollowedProject"
    >
        <template v-if="listProjects.length" #header_clear>
            <div class="clear" @click="clearSelection">
                {{ $t('drawer.clear') }}
            </div>
        </template>

        <div v-if="listProjects.length" class="results-ctn">
            <ProjectCard
                v-for="project in listProjects"
                :key="project.id"
                :has-close-icon="true"
                :project="project"
                class="selected-card"
                @unselect="unselectProject"
            />
        </div>
        <ProjectSelection
            :selected-projects="listProjects"
            :followed-projects="followedProjects"
            @select-project="addProject"
            @batch-project="addBatch"
            @search-done="search"
        />
    </DrawerLayout>
</template>

<script>
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import ProjectCard from '@/components/peopleKit/ProjectCard.vue'
import ProjectSelection from '@/pages/ProfileEdit/ProjectSelection.vue'

export default {
    name: 'FollowProjectDrawer',

    emits: ['close', 'clear', 'unselect'],

    components: { DrawerLayout, ProjectCard, ProjectSelection },

    data() {
        return {
            step: 'projectSelection',
            selectedProject: null,
            selectedReason: undefined,
            listProjects: [],
            hasFooter: false,
            searchDone: false,
        }
    },

    props: {
        isOpened: {
            type: Boolean,
            default: false,
        },
        followedProjects: {
            type: Array,
            default: () => [],
        },
        user: {
            type: Object,
            required: true,
        },
    },

    watch: {
        isOpened: {
            handler: function () {
                this.step = 'projectSelection'
                this.selectedProject = null
                this.selectedReason = undefined
            },
            immediate: true,
        },
        searchDone: {
            handler: function () {
                if (!this.searchDone && this.listProjects.length < 1) {
                    this.hasFooter = false
                } else this.hasFooter = true
            },
            immediate: true,
        },
        listProjects: {
            handler: function () {
                if (!this.searchDone && this.listProjects.length < 1) {
                    this.hasFooter = false
                } else this.hasFooter = true
            },
            immediate: true,
            deep: true,
        },
    },

    methods: {
        async addProject(project) {
            this.listProjects.push(project)
        },

        async addBatch(projects) {
            this.listProjects = this.listProjects.concat(projects)
        },

        async addFollowedProject() {
            try {
                let listFollowedProjects = []
                for (let i = 0; i < this.listProjects.length; i++) {
                    listFollowedProjects.push({
                        project_id: this.listProjects[i].id,
                    })
                }
                let body = { follows: listFollowedProjects }
                await this.$store.dispatch('follows/addFollowMany', {
                    id: this.user.keycloak_id,
                    body: body,
                })
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.add-followed-project.success'),
                    type: 'success',
                })

                if (this.$route.name !== 'ProfileEdit') {
                    this.$router.push(`/projects//profile/edit`)
                }
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.add-followed-project.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.listProjects.splice(0)
                this.closeModal()
            }
        },

        closeModal() {
            this.hasFooter = false
            this.listProjects.splice(0)
            this.$emit('close', true)
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
        search(done) {
            this.searchDone = done
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
</style>
