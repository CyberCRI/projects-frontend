<template>
    <NuxtLink
        :to="{ name: 'pageProject', params: { slugOrId: project.slug } }"
        class="home-project-item shadow-box"
    >
        <div class="project-img-container">
            <CroppedApiImage
                :alt="`${project.title} image`"
                class="project-img"
                :ratio="1 / 1"
                :picture-data="project?.header_image"
                picture-size="medium"
                default-picture="/placeholders/header_placeholder.png"
            />
        </div>
        <h3 class="project-title">{{ $filters.capitalize(project.title) }}</h3>
        <div class="project-description">
            <p class="clamped">{{ purpose }}</p>
        </div>
        <SummaryAction class="project-action" :action-label="$t('common.read')" />
    </NuxtLink>
</template>

<script>
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import SummaryAction from '@/components/home/SummaryCards/SummaryAction.vue'

export default {
    name: 'NewsfeedProjectItem',

    components: { SummaryAction, CroppedApiImage },

    props: {
        project: {
            type: Object,
            default: () => {},
        },
    },

    computed: {
        purpose() {
            const sanitized = this.project?.purpose.replace(/<[^>]+>/g, ' ') || ''
            return sanitized.substring(0, 255) + (sanitized.length > 255 ? '...' : '')
        },
    },
}
</script>

<style lang="scss" scoped>
$dimension: 120px;

.home-project-item {
    display: grid;
    border: $border-width-s solid $lighter-gray;
    border-radius: $border-radius-s;
    padding: $space-l;
    min-height: $dimension;
    column-gap: $space-l;
    grid-template-columns: $dimension auto;
    grid-template-rows: auto 1fr auto;

    @media screen and (max-width: $min-tablet) {
        grid-template-columns: 1fr;
        grid-template-rows: repeat(4, auto);
        row-gap: $space-l;
    }

    .project-img-container {
        height: $dimension;
        width: $dimension;
        grid-column: 1;
        grid-row: 1 / 4;
        aspect-ratio: 1;
        margin: 0 auto;

        @media screen and (max-width: $min-tablet) {
            grid-column: 1;
            grid-row: 2;
            width: 200px; // see NewsfeedAnnouncementsItem.vue
            height: 200px;
        }

        .project-img {
            object-fit: cover;
            max-width: inherit;
            max-height: inherit;
            height: inherit;
            width: inherit;
            border-radius: $border-radius-s;
            border: 1px solid $lighter-gray;
        }
    }
}

.project-title {
    display: block;
    font-size: $font-size-l;
    line-height: $line-height-tight;
    margin-bottom: $space-s;
    grid-column: 2;
    grid-row: 1;

    @media screen and (max-width: $min-tablet) {
        grid-column: 1;
        grid-row: 1;
    }
}

.project-description {
    grid-column: 2;
    grid-row: 2;

    @media screen and (max-width: $min-tablet) {
        grid-column: 1;
        grid-row: 3;
    }
}

.clamped {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.project-action {
    grid-column: 2;
    grid-row: 3;

    @media screen and (max-width: $min-tablet) {
        grid-column: 1;
        grid-row: 4;
    }
}
</style>
