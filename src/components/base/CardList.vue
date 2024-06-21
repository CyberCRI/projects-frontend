<template>
    <ProjectListSkeleton class="card-list" v-if="isLoading" :min-gap="gridGap" :limit="limit" />

    <div v-else>
        <template v-if="noProjects">
            <slot name="empty">
                <div class="card-list__empty">
                    <p class="card-list__empty--text">{{ $t('project.nothing') }}</p>
                    <img
                        :src="`${PUBLIC_BINARIES_PREFIX}/empties/emptyBox.svg`"
                        alt="No projects"
                    />
                </div>
            </slot>
        </template>

        <template v-else>
            <div v-if="projects.length" class="card-container">
                <DynamicGrid :min-gap="gridGap" class="card-list">
                    <div v-for="project in projects" :key="project.id" class="card-list__content">
                        <slot name="projects" :project="project"></slot>
                    </div>
                </DynamicGrid>
            </div>

            <div v-if="groups.length" class="card-container">
                <DynamicGrid :min-gap="gridGap" class="card-list">
                    <div v-for="group in groups" :key="group.id" class="card-list__content">
                        <slot name="groups" :group="group"></slot>
                    </div>
                </DynamicGrid>
            </div>

            <div v-if="peoples.length" class="card-container">
                <DynamicGrid :min-gap="gridGap" class="card-list">
                    <div v-for="people in peoples" :key="people.id" class="card-list__content">
                        <slot name="peoples" :user="people"></slot>
                    </div>
                </DynamicGrid>
            </div>
        </template>
    </div>
</template>

<script>
import imageMixin from '@/mixins/imageMixin.ts'
import ProjectListSkeleton from '@/components/project/ProjectListSkeleton.vue'
import DynamicGrid from '@/components/base/DynamicGrid.vue'

export default {
    name: 'CardList',

    mixins: [imageMixin],

    components: {
        ProjectListSkeleton,
        DynamicGrid,
    },

    props: {
        projects: {
            type: Array,
            default: () => [],
        },

        groups: {
            type: Array,
            default: () => [],
        },

        peoples: {
            type: Array,
            default: () => [],
        },

        isLoading: {
            type: Boolean,
            default: false,
        },

        limit: {
            type: Number,
            default: 12,
        },
    },

    data() {
        return {
            gridGap: 24,
        }
    },

    computed: {
        noProjects() {
            return (
                !this.isLoading &&
                !this.projects.length &&
                !this.groups.length &&
                !this.peoples.length
            )
        },
    },
}
</script>

<style lang="scss" scoped>
.card-list {
    justify-content: space-between;
}

.card-list__empty {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
}

.card-list__empty--text {
    font-weight: 400;
    font-size: 22px;
    color: $primary-dark;
    margin-bottom: 24px;
}

.card-list__empty--image {
    width: 200px;
}

.card-list__content {
    width: min-content;
}

.see-more-arrow {
    font-size: $font-size-m;
}

.card-container {
    margin: $space-xl 0;
}
</style>
