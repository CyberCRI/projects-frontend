<template>
    <BaseDrawer
        :is-opened="isOpened"
        :title="drawerTitleWithLimit"
        :padding="true"
        @close="close"
        @confirm="confirm"
        :asyncing="asyncing"
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
            <template v-if="maxPick">
                <div class="project-placeholder" v-for="i in remainingPicks" :key="i">
                    <div class="content">
                        <div class="picture"></div>
                    </div>
                </div>
            </template>
        </div>
        <div class="show-more" v-if="listProjects?.length > listLimit">
            <LinkButton
                class="see-more-btn"
                :label="$filters.capitalize($t(seeMoreLabel))"
                @click="isSeeMore = !isSeeMore"
            />
        </div>
        <PickProjectSelection
            :selected-projects="listProjects"
            @select-project="addProject"
            @batch-project="addBatch"
            :can-pick-more="canPickMore"
        />
    </BaseDrawer>
</template>

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import PickProjectSelection from '@/components/project/PickProjectSelection.vue'
import ProjectCard from '@/components/project/ProjectCard.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import { toRaw } from 'vue'
import useToasterStore from '@/stores/useToaster.ts'

export default {
    name: 'PickProjectsDrawer',

    emits: ['close', 'picked-projects'],

    components: { BaseDrawer, PickProjectSelection, ProjectCard, LinkButton },
    setup() {
        const toaster = useToasterStore()
        return {
            toaster,
        }
    },

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
        maxPick: {
            type: [Number, null],
            default: null,
        },
        asyncing: {
            type: Boolean,
            default: false,
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
        remainingPicks() {
            return this.maxPick
                ? new Array(Math.max(this.maxPick - this.listProjects.length, 0))
                : []
        },

        drawerTitleWithLimit() {
            return (
                this.drawerTitle +
                (this.maxPick ? ` (${this.listProjects.length}/${this.maxPick})` : '')
            )
        },
        canPickMore() {
            return this.maxPick ? this.listProjects.length < this.maxPick : true
        },
    },
    methods: {
        async addProject(project) {
            if (!this.canPickMore) {
                this.toaster.pushWarning(this.$t('featured-projects.drawer.max-pick-reached'))

                return
            }
            this.listProjects.push(project)
        },

        async addBatch(projects) {
            const projectsToAdd = (projects || [])
                .slice(0)
                .filter((p) => !(this.listProjects || []).some((lp) => lp.id === p.id))
            if (this.maxPick && this.listProjects.length + projectsToAdd.length >= this.maxPick) {
                this.toaster.pushWarning(this.$t('featured-projects.drawer.max-pick-reached'))

                return
            }

            this.listProjects = this.listProjects.concat(projects)
        },

        async confirm() {
            this.$emit('picked-projects', toRaw(this.listProjects))
            // Note: this is now the responsability of host component to close the drawer
            // so it can update asyncing state as needed
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

.project-placeholder {
    height: $card_height;
    width: $card_width;
    border: $border-width-s solid $lighter-gray;
    border-radius: $border-radius-m;

    .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: $space-m $space-m 0 $space-m;
        height: 100%;
    }

    .picture {
        display: inline-block;

        $picture-width: 86px;

        width: pxToRem($picture-width);
        height: pxToRem($picture-width);
        border-radius: $border-radius-xs;
        background-repeat: no-repeat;
        background-position: center center;
        background-size: cover;
        background-color: $lighter-gray;
        box-shadow: 0 0 2px rgb(0 0 0 / 15%);
    }
}
</style>
