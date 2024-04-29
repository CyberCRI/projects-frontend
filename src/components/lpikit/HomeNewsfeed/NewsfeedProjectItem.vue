<template>
    <RouterLink
        :to="{ name: 'pageProject', params: { slugOrId: project.slug } }"
        class="home-project-item shadow-box"
    >
        <h3 class="project-title-mobile">{{ $filters.capitalize(project.title) }}</h3>

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
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import ImageMixin from '@/mixins/imageMixin.ts'
import SummaryAction from '@/components/lpikit/SummaryCards/SummaryAction.vue'

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
.home-project-item {
    display: flex;
    flex-direction: column;
    border: $border-width-s solid $gray-10;
    border-radius: $border-radius-s;
    padding: $space-l;
    gap: $space-l;

    @media screen and (min-width: $min-tablet) {
        flex-direction: row;
        min-height: 200px;
        align-items: stretch;
    }

    .project-img-container {
        align-self: center;
        background-size: cover;
        background-position: top center;
        height: pxToRem(200px);
        flex: none;
        width: 100%;

        @media screen and (min-width: $min-tablet) {
            margin-bottom: 0;
            flex-basis: 200px;
        }

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

    .project-title-mobile {
        font-size: $font-size-l;
        line-height: $font-size-3xl;
        margin-bottom: $space-m;

        @media screen and (min-width: $min-tablet) {
            display: none;
        }
    }
}

.project-content {
    display: flex;
    flex-flow: column nowrap;

    .project-title-desktop {
        display: none;

        @media screen and (min-width: $min-tablet) {
            display: block;
            font-size: $font-size-2xl;
            line-height: $font-size-3xl;
            margin-bottom: $space-m;
        }
    }

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

    .more-info {
        display: flex;
        align-items: center;
        margin-top: $space-l;
        cursor: pointer;

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
    }
}
</style>
