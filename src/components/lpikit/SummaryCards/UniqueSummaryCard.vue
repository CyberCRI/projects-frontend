<template>
    <div v-if="content.length > 2" class="unique-card-wrapper-three-col">
        <h1 class="top-title">
            {{ $filters.capitalize($t(`home.short-title.${title}`)) }}
        </h1>
        <div class="three-column-wrapper">
            <div v-if="title == 'projects'" class="project-line">
                <ProjectLine
                    v-for="(project, index) in content"
                    :key="index"
                    :project="project"
                    cols="three-col"
                />
            </div>
            <div class="project-more-info" @click="seeAll">
                <IconImage class="arrow" name="ArrowRight" />
                <span class="read"> {{ $filters.capitalize($t('feed.see-all')) }}</span>
            </div>
        </div>
    </div>
    <div v-else class="unique-card-wrapper-two-one-col">
        <h1 class="uppercase-title">
            {{ $t(`home.long-title.${title}`) }}
        </h1>
        <div class="column-wrapper" :class="[nbColsText]">
            <div class="project-line" :class="[nbColsText]">
                <ProjectLine
                    v-for="(project, index) in content"
                    :key="index"
                    :project="project"
                    cols="two-col"
                />
            </div>
            <div class="project-more-info" :class="nbColsText" @click="newProject">
                <IconImage class="arrow" name="ArrowRight" />
                <span class="read"> {{ $filters.capitalize($t('home.create-project')) }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import ProjectLine from '@/components/lpikit/SummaryCards/ProjectLine.vue'
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'UniqueSummaryCard',

    components: { ProjectLine, IconImage },

    props: {
        title: {
            type: String,
            default: '',
        },
        content: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {}
    },

    computed: {
        nbCols() {
            return this.content.length
        },

        nbColsText() {
            if (this.nbCols === 1) {
                return 'one-col-wrapper'
            } else if (this.nbCols === 2) {
                return 'two-col-wrapper'
            } else {
                return 'three-col-wrapper'
            }
        },
    },

    methods: {
        seeAll() {
            this.$router.push({ name: 'Search' })
        },

        newProject() {
            this.$router.push({ name: 'createProject' })
        },
    },
}
</script>

<style lang="scss" scoped>
.unique-card-wrapper-three-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-inline: $space-xs;

    @media screen and (min-width: $min-tablet) {
        padding-inline: $space-xl;
    }
}

.top-title {
    font-size: $font-size-xs;
    font-weight: 400;
    text-transform: uppercase;
    padding-top: $space-m;
}

.three-column-wrapper {
    width: 100%;
    margin-bottom: $space-l;
    margin-top: $space-m;
    background-color: $white;
    border: 1px solid $primary-dark;
    display: flex;
    flex-direction: column;
    padding-top: 5px;

    @media screen and (min-width: $min-tablet) {
        flex-direction: row;
        margin-top: $space-m;
        padding-top: 0;
    }
}

.project-line {
    display: flex;
    flex-direction: column;
    width: auto;

    @media screen and (min-width: $min-tablet) {
        flex-direction: row;
        width: 80%;
    }

    &.one-col-wrapper {
        @media screen and (min-width: $min-tablet) {
            width: 60%;
        }
    }
}

.project-more-info {
    display: flex;
    align-items: center;
    width: auto;
    cursor: pointer;
    margin-inline: $space-m;
    margin-block: $space-m;

    .arrow {
        fill: $primary-dark;
        height: $font-size-2xl;
        width: $font-size-2xl;
    }

    .read {
        color: $primary-dark;
        font-weight: 700;
        margin-left: $space-xs;
    }

    &:hover {
        .read {
            transform: scaleX(1.1);
        }

        .arrow {
            transform: scale(1.35);
        }
    }

    &.one-col-wrapper {
        @media screen and (min-width: $min-tablet) {
            width: 40%;
        }
    }

    @media screen and (min-width: $min-tablet) {
        width: 20%;
        justify-content: flex-end;
        margin-left: 0;
        margin-block: 0;
    }
}

.unique-card-wrapper-two-one-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-inline: $space-xs;

    @media screen and (min-width: $min-tablet) {
        flex-direction: row;
        padding-inline: $space-xl;
    }
}

.uppercase-title {
    font-size: $font-size-l;
    font-weight: 700;
    text-transform: uppercase;
    color: $primary-dark;
    margin-top: $space-l;

    @media screen and (min-width: $min-tablet) {
        margin-top: 0;
    }
}

.column-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-block: $space-l;
    background-color: $white;
    border: 1px solid $primary-dark;
    padding-top: $space-xs;

    @media screen and (min-width: $min-tablet) {
        flex-direction: row;
        padding-top: 0;
    }

    &.one-col-wrapper {
        @media screen and (min-width: $min-tablet) {
            width: 40%;
        }
    }

    &.two-col-wrapper {
        @media screen and (min-width: $min-tablet) {
            width: 70%;
        }
    }
}
</style>
