<template>
    <RouterLink
        :to="{ name: 'pageProject', params: { slugOrId: project.slug } }"
        class="home-project-item shadow-box"
    >
        <div class="project-img-container">
            <CroppedImage
                :alt="`${project.title} image`"
                :image-sizes="imageSizes"
                :src="croppedImageSrc"
                class="project-img"
                :ratio="1 / 1"
            />
        </div>
        <div class="project-content">
            <h3 class="project-title-desktop">{{ $filters.capitalize(project.title) }}</h3>
            <div class="project-description">
                <p class="clamped">{{ purpose }}</p>
            </div>
            <SummaryAction :action-label="$t('common.read')" />
        </div>
    </RouterLink>
</template>

<script>
import CroppedImage from '@/components/base/media/CroppedImage.vue'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import ImageMixin from '@/mixins/imageMixin.ts'
import SummaryAction from '@/components/home/SummaryCards/SummaryAction.vue'

export default {
    name: 'NewsfeedProjectItem',

    components: { SummaryAction, CroppedImage },

    mixins: [ImageMixin],

    props: {
        project: {
            type: Object,
            default: () => {},
        },
    },

    data() {
        return {
            imageError: false,
            imageLoaded: false,
        }
    },

    computed: {
        imageSizes() {
            return pictureApiToImageSizes(this.project?.header_image)
        },

        croppedImageSrc() {
            return this.project && this.project.header_image
                ? this.project?.header_image.variations?.small
                : `${this.PUBLIC_BINARIES_PREFIX}/patatoids-project/Patatoid-1.png`
        },

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
    display: flex;
    border: $border-width-s solid $gray-10;
    border-radius: $border-radius-s;
    padding: $space-l;
    gap: $space-l;
    flex-direction: row;
    min-height: $dimension;
    align-items: stretch;

    .project-img-container {
        align-self: flex-start;
        background-size: cover;
        background-position: top center;
        height: $dimension;
        flex: none;
        width: 100%;
        margin-bottom: 0;
        flex-basis: $dimension;

        .project-img {
            object-fit: cover;
            max-width: inherit;
            max-height: inherit;
            height: inherit;
            width: inherit;
            border-radius: $border-radius-s;
            border: 1px solid $gray-10;
        }
    }
}

.project-content {
    flex-flow: column nowrap;
    display: block;
    line-height: 1.5;
    margin-bottom: $space-m;

    .project-description {
        flex-grow: 1;
    }

    .clamped {
        line-height: $font-size-xl;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
}
</style>
