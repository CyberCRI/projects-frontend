<template>
    <ProjectListSkeleton
        v-if="isLoading"
        :desktop-columns-number="desktopColumnsNumber"
        :limit="limit"
    />

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
                    </h3>
                    <LpiButton
                        v-if="displaySeeMoreButton"
                        :label="$filters.capitalize($t('common.see-more'))"
                        size="link"
                        right-icon="ArrowRight"
                        @click="goTo({ name: 'ProjectSearch', query: seeMoreQuery })"
                    />
                </div>
                <div :class="gridLayout" class="card-list">
                    <div v-for="project in projects" :key="project.id" class="card-list__content">
                        <slot name="projects" :project="project"></slot>
                    </div>
                </div>
            </div>

            <div v-if="groups.length" class="card-container">
                <div class="title-ctn" v-if="withTitle">
                    <h3 class="title">
                        {{ $t('search.group-tab', { count: totalCount.groups }) }}
                    </h3>
                    <LpiButton
                        v-if="displaySeeMoreButton"
                        :label="$filters.capitalize($t('common.see-more'))"
                        size="link"
                        right-icon="ArrowRight"
                        @click="goTo({ name: 'GroupSearch', query: seeMoreQuery })"
                    />
                </div>
                <div :class="gridLayout" class="card-list">
                    <div v-for="group in groups" :key="group.id" class="card-list__content">
                        <slot name="groups" :group="group"></slot>
                    </div>
                </div>
            </div>

            <div v-if="peoples.length" class="card-container">
                <div class="title-ctn" v-if="withTitle">
                    <h3 class="title">
                        {{ $t('search.people-tab', { count: totalCount.peoples }) }}
                    </h3>
                    <LpiButton
                        v-if="displaySeeMoreButton"
                        :label="$filters.capitalize($t('common.see-more'))"
                        size="link"
                        right-icon="ArrowRight"
                        @click="goTo({ name: 'PeopleSearch', query: seeMoreQuery })"
                    />
                </div>
                <div :class="gridLayout" class="card-list">
                    <div v-for="people in peoples" :key="people.id" class="card-list__content">
                        <slot name="peoples" :user="people"></slot>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import imageMixin from '@/mixins/imageMixin.ts'
import ProjectListSkeleton from '@/components/lpikit/Skeleton/ProjectListSkeleton.vue'
import LpiButton from '@/components/lpikit/LpiButton/LpiButton.vue'

export default {
    name: 'CardList',

    mixins: [imageMixin],

    components: {
        LpiButton,
        ProjectListSkeleton,
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

        desktopColumnsNumber: {
            type: [String, Number],
            default: 4,
            validator(value) {
                return [1, 3, 4, 6].includes(parseInt(value))
            },
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

    computed: {
        noProjects() {
            return (
                !this.isLoading &&
                !this.projects.length &&
                !this.groups.length &&
                !this.peoples.length
            )
        },

        gridLayout() {
            if (!this.noProjects) return `desktop-col--${this.desktopColumnsNumber}`
            return null
        },
    },

    methods: {
        goTo(route) {
            this.$router.push(route)
        },
    },
}
</script>

<style lang="scss" scoped>
.card-list {
    display: grid;
    gap: $space-l;
    justify-items: center;
    justify-content: center;

    @media screen and (min-width: $max-mobile) {
        justify-content: space-between;
    }

    &__empty {
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;

        &--text {
            font-weight: 400;
            font-size: 22px;
            line-height: 24px;
            color: $primary-dark;
            margin-bottom: 24px;
        }

        &--image {
            width: 200px;
        }
    }
}

.card-container {
    margin: $space-xl 0;

    .title-ctn {
        display: flex;
        align-items: center;
        margin-left: pxToRem(20px);
        margin-bottom: $space-l;

        .title {
            color: $primary-dark;
            font-size: 20px;
            line-height: 24px;
            font-weight: bold;
        }
    }
}

$grid-cell-width: $card_width;

.desktop-col--1 {
    @media screen and (min-width: $min-tablet) {
        grid-template-columns: $grid-cell-width;
    }
}

.desktop-col--3 {
    @media screen and (min-width: $max-tablet) {
        grid-template-columns: $grid-cell-width $grid-cell-width $grid-cell-width;
    }
}

.desktop-col--4 {
    @media screen and (min-width: $min-tablet) {
        grid-template-columns: $grid-cell-width $grid-cell-width $grid-cell-width;
    }

    @media screen and (min-width: $min-desktop) {
        grid-template-columns: $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width;
    }
}

.desktop-col--6 {
    grid-template-columns: $grid-cell-width;

    @media screen and (min-width: $max-mobile) and (max-width: $med-mobile) {
        grid-template-columns: $grid-cell-width $grid-cell-width;
    }

    @media screen and (min-width: $med-mobile) {
        grid-template-columns: $grid-cell-width $grid-cell-width $grid-cell-width;
    }

    @media screen and (min-width: $min-tablet) {
        grid-template-columns: $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width;
    }

    @media screen and (min-width: $med-tablet) {
        grid-template-columns: $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width;
    }

    @media screen and (min-width: $min-desktop) {
        grid-template-columns: $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width;
    }

    @media screen and (min-width: $max-desktop) {
        grid-template-columns: $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width;
    }
}

// project lists in user drawer
.drawer .card-list {
    // drawer are 90% screen width
    // so we need to adjust media query for the narrowed space
    $drawer-width: 1.11111; //  == 1 / 0.9

    gap: 0.5rem; // otherwise cards don't fit in lower desktop width
    &.desktop-col--4 {
        @media screen and (min-width: ($drawer-width * $min-tablet)) {
            grid-template-columns: $grid-cell-width $grid-cell-width $grid-cell-width;
        }

        @media screen and (min-width: ($drawer-width * $min-desktop)) {
            grid-template-columns: $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width;
        }
    }

    &.desktop-col--6 {
        grid-template-columns: $grid-cell-width;

        @media screen and (min-width: ($drawer-width * $max-mobile)) and (max-width: ($drawer-width * $med-mobile)) {
            grid-template-columns: $grid-cell-width $grid-cell-width;
        }

        @media screen and (min-width: ($drawer-width * $med-mobile)) {
            grid-template-columns: $grid-cell-width $grid-cell-width $grid-cell-width;
        }

        @media screen and (min-width: ($drawer-width * $min-tablet)) {
            grid-template-columns: $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width;
        }

        @media screen and (min-width: ($drawer-width * $max-tablet)) {
            grid-template-columns: $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width;
        }

        @media screen and (min-width: ($drawer-width * $min-desktop)) {
            grid-template-columns: $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width $grid-cell-width;
        }
    }
}
</style>
