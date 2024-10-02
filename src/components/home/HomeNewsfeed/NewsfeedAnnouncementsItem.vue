<template>
    <RouterLink
        class="home-announcement-item shadow-box"
        :to="{
            name: 'projectAnnouncements',
            params: { slugOrId: this.announcement.project.slug },
            hash: '#tab',
        }"
    >
        <div class="announcement-img-container">
            <CroppedImage
                :alt="`${announcement?.project?.title} image`"
                :image-sizes="imageSizes"
                :src="croppedImageSrc"
                class="project-img"
                :ratio="1 / 1"
            />
            <div :style="announcementStyle" class="announcement-overlay"></div>
        </div>
        <h3 class="announcement-title">
            {{ $filters.capitalize(announcement.title) }}
        </h3>
        <div class="announcement-infos">
            <span class="date-ctn">
                {{ $d(new Date(announcement.updated_at)) }}
            </span>
            <span v-if="announcement.type && announcement.type !== 'na'" class="dot">
                &#9679;
            </span>
            <span v-if="announcement.type && announcement.type !== 'na'" class="announcement-type">
                {{ $t(`recruit.${announcement.type}`) }}
            </span>
        </div>
        <div class="announcement-description">
            <HtmlLimiter :html="description" />
        </div>

        <SummaryAction class="announcement-action" :action-label="$t('common.read')" />
    </RouterLink>
</template>

<script>
import SummaryAction from '@/components/home/SummaryCards/SummaryAction.vue'
import CroppedImage from '@/components/base/media/CroppedImage.vue'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import ImageMixin from '@/mixins/imageMixin.ts'
import HtmlLimiter from '@/components/base/HtmlLimiter.vue'
export default {
    name: 'NewsfeedAnnouncementsItem',

    mixins: [ImageMixin],

    components: { SummaryAction, CroppedImage, HtmlLimiter },

    props: {
        announcement: {
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
        announcementStyle() {
            return {
                'background-image': `url(${
                    import.meta.env.VITE_APP_PUBLIC_BINARIES_PREFIX
                }/placeholders/announcement_placeholder.png)`,
            }
        },

        description() {
            return this.announcement?.description || ''
        },

        imageSizes() {
            return pictureApiToImageSizes(this.announcement.project?.header_image)
        },

        croppedImageSrc() {
            return this.announcement?.project && this.announcement.project?.header_image
                ? this.announcement?.project?.header_image.variations?.small
                : `${this.PUBLIC_BINARIES_PREFIX}/patatoids-project/Patatoid-1.png`
        },
    },
}
</script>

<style lang="scss" scoped>
$dimension: 200px;

.home-announcement-item {
    display: grid;
    border: $border-width-s solid $lighter-gray;
    border-radius: $border-radius-s;
    padding: $space-l;
    align-items: center;
    column-gap: $space-l;
    grid-template-columns: $dimension auto;
    grid-template-rows: auto auto 1fr auto;

    @media screen and (max-width: $min-tablet) {
        grid-template-columns: 1fr;
        grid-template-rows: repeat(5, auto);
        row-gap: $space-l;
    }

    @media screen and (min-width: $min-tablet) {
        align-items: flex-start;
        min-height: $dimension;
    }

    .announcement-img-container {
        position: relative;
        height: $dimension;
        width: $dimension;
        aspect-ratio: 1;
        margin: 0 auto;
        grid-column: 1;
        grid-row: 1 / 5;

        @media screen and (max-width: $min-tablet) {
            grid-column: 1;
            grid-row: 2;
        }

        .announcement-overlay {
            position: absolute;
            inset: 0;
            border-radius: $dimension;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            transform-origin: center center;
            transform: scale(0.5);
            opacity: 0.9;
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

.announcement-title {
    display: block;
    font-size: $font-size-l;
    margin-bottom: $space-s;
    grid-column: 2;
    grid-row: 1;

    @media screen and (max-width: $min-tablet) {
        grid-column: 1;
        grid-row: 1;
    }
}

.announcement-infos {
    font-size: $font-size-s;
    color: $primary-dark;
    font-weight: 700;
    margin-bottom: $space-s;
    grid-column: 2;
    grid-row: 2;

    @media screen and (max-width: $min-tablet) {
        grid-column: 1;
        grid-row: 3;
    }
}

.dot {
    position: relative;
    top: -1px;
    padding: 0 $space-2xs;
}

.announcement-type {
    text-transform: uppercase;
}

.announcement-description {
    flex-grow: 1;
    grid-column: 2;
    grid-row: 3;
    display: flex;
    place-self: stretch stretch;

    :deep(.outer) {
        flex-grow: 1;

        strong {
            font-weight: 700 !important;
        }

        em {
            font-style: italic;
        }

        u {
            text-decoration: underline;
        }

        a {
            color: $primary-dark;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    @media screen and (max-width: $min-tablet) {
        grid-column: 1;
        grid-row: 4;
    }
}

.announcement-action {
    grid-column: 2;
    grid-row: 4;

    @media screen and (max-width: $min-tablet) {
        grid-column: 1;
        grid-row: 5;
    }
}
</style>
