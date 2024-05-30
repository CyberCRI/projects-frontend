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
                <div class="title-ctn" v-if="withTitle">
                    <h3 class="title">
                        {{ $t('search.projects-tab', { count: totalCount.projects }) }}

                        <SeeMoreArrow
                            class="see-more-arrow"
                            v-if="displaySeeMoreButton"
                            :to="{ name: 'ProjectSearch', query: seeMoreQuery }"
                        />
                    </h3>
                </div>
                <DynamicGrid :min-gap="gridGap" class="card-list">
                    <div v-for="project in projects" :key="project.id" class="card-list__content">
                        <slot name="projects" :project="project"></slot>
                    </div>
                </DynamicGrid>
            </div>

            <div v-if="groups.length" class="card-container">
                <div class="title-ctn" v-if="withTitle">
                    <h3 class="title">
                        {{ $t('search.group-tab', { count: totalCount.groups }) }}
                    </h3>
                    <SeeMoreArrow
                        v-if="displaySeeMoreButton"
                        :to="{ name: 'GroupSearch', query: seeMoreQuery }"
                    />
                </div>
                <DynamicGrid :min-gap="gridGap" class="card-list">
                    <div v-for="group in groups" :key="group.id" class="card-list__content">
                        <slot name="groups" :group="group"></slot>
                    </div>
                </DynamicGrid>
            </div>

            <div v-if="peoples.length" class="card-container">
                <div class="title-ctn" v-if="withTitle">
                    <h3 class="title">
                        {{ $t('search.people-tab', { count: totalCount.peoples }) }}
                    </h3>
                    <SeeMoreArrow
                        v-if="displaySeeMoreButton"
                        :to="{ name: 'PeopleSearch', query: seeMoreQuery }"
                    />
                </div>
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
import SeeMoreArrow from '@/components/base/button/SeeMoreArrow.vue'

import DynamicGrid from '@/components/base/DynamicGrid.vue'

export default {
    name: 'CardList',

    mixins: [imageMixin],

    components: {
        SeeMoreArrow,
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

        totalCount: {
            type: Object,
            default: () => ({
                projects: 0,
                groups: 0,
                peoples: 0,
            }),
        },

        isLoading: {
            type: Boolean,
            default: false,
        },

        limit: {
            type: Number,
            default: 12,
        },

        displaySeeMoreButton: {
            type: Boolean,
            default: false,
        },

        seeMoreQuery: {
            type: Object,
            default: null,
        },

        withTitle: {
            type: Boolean,
            default: false,
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

    .title-ctn {
        display: flex;
        align-items: center;
        margin-bottom: $space-l;

        .title {
            color: $primary-dark;
            font-size: 20px;
            font-weight: bold;
        }
    }
}
</style>
