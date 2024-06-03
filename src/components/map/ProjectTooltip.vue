<template>
    <div class="project-tooltip">
        <div class="project-tooltip__header">
            <div :class="location.type" class="project-tooltip__header--dot" />
            <h2 class="project-tooltip__header--title">
                {{ $filters.capitalize(typeLabel) }}
            </h2>
        </div>

        <div class="project-tooltip__location">
            <h3 class="project-tooltip__location--title">
                {{ $filters.capitalize(location.title) }}
            </h3>
            <p class="project-tooltip__location--description">
                {{ $filters.capitalize(location.description) }}
            </p>

            <LinkButton
                :label="$filters.capitalize($t('project.view'))"
                class="project-tooltip__button"
                btn-icon="ArrowRight"
                :to="{ name: 'pageProject', params: { slugOrId: project.id } }"
            />
        </div>

        <div class="project-tooltip__content">
            <img
                :alt="project.header_image?.name"
                loading="lazy"
                :src="project.header_image?.variations?.small"
                class="project-tooltip__image"
            />
            <div>
                <h3 class="project-title">{{ title }}</h3>
                <p class="project-purpose">{{ purpose }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import LinkButton from '@/components/base/button/LinkButton.vue'

export default {
    name: 'ProjectTooltip',

    props: {
        location: {
            type: Object,
            default: () => {},
        },
    },

    components: {
        LinkButton,
    },

    computed: {
        title() {
            return this.cropIfTooLong(this.project.title, 45)
        },
        purpose() {
            return this.cropIfTooLong(this.project.purpose, 85)
        },

        project() {
            return this.location.project
        },
        typeLabel() {
            return this.location.type === 'impact'
                ? this.$t('project.impact')
                : this.$t('team.team')
        },
    },

    methods: {
        cropIfTooLong(text, length) {
            if (text) return text.length > length ? text.substring(0, length) + '...' : text
            return ''
        },
    },
}
</script>

<style lang="scss" scoped>
.project-tooltip {
    overflow: hidden;
    display: flex;
    width: 100%;
    height: 100%;
    transition: opacity 0.15s ease-in-out;
    flex-direction: column;

    &__header {
        display: flex;
        justify-content: flex-start;
        padding: $space-s;

        &--title {
            color: $primary-dark;
            font-weight: 700;
            font-size: $font-size-s;
        }

        &--dot {
            width: pxToRem(16px);
            height: pxToRem(16px);
            border-radius: 50%;
            margin-right: $space-s;

            &.impact {
                background: $violet;
            }

            &.team {
                background: $primary;
            }
        }
    }

    &__location {
        padding: $space-s;

        &--title {
            font-weight: 500;
            font-size: $font-size-xl;
        }

        &--description {
            font-weight: 400;
            font-size: $font-size-m;
        }
    }

    &__button {
        padding: initial;
        margin-top: $space-m;
    }

    &__image {
        width: pxToRem(72px);
        flex-basis: pxToRem(72px);
        flex-shrink: 0;
        height: pxToRem(72px);
        background-position: center center;
        background-size: cover;
        border-radius: $border-radius-xs;
        object-fit: cover;
        object-position: 50% 50%;
        margin-right: $space-m;
    }

    &__content {
        flex-basis: 60%;
        padding: $space-s;
        background: $primary-lighter;
        display: flex;
        justify-content: space-between;

        .project-title {
            font-size: $font-size-m;
            font-weight: 700;
        }

        .project-purpose {
            font-size: $font-size-s;
            margin: $space-s 0;
        }
    }
}

.icon {
    width: pxToRem(18px);
    height: pxToRem(18px);

    &--close {
        background: $primary-dark;
        fill: $white;
        border-radius: 50%;
    }
}
</style>
