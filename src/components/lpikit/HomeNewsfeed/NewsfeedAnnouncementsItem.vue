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
        <div class="announcement-content">
            <h3 class="announcement-title">
                {{ $filters.capitalize(announcement.title) }}
            </h3>
            <div class="announcement-infos">
                <span class="date-ctn">
                    {{ new Date(announcement.updated_at).toLocaleDateString() }}
                </span>
                <span v-if="announcement.type && announcement.type !== 'na'" class="dot">
                    &#9679;
                </span>
                <span
                    v-if="announcement.type && announcement.type !== 'na'"
                    class="announcement-type"
                >
                    {{ $t(`recruit.${announcement.type}`) }}
                </span>
            </div>
            <div class="announcement-description">
                <p class="clamped">{{ description }}</p>
            </div>

            <SummaryAction :action-label="$t('common.read')" />
        </div>
    </RouterLink>
</template>

<script>
import SummaryAction from '@/components/lpikit/SummaryCards/SummaryAction.vue'
import CroppedImage from '@/components/base/media/CroppedImage.vue'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import ImageMixin from '@/mixins/imageMixin.ts'
export default {
    name: 'NewsfeedAnnouncementsItem',

    mixins: [ImageMixin],

    components: { SummaryAction, CroppedImage },

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
            const sanitized = this.announcement?.description.replace(/<[^>]+>/g, ' ') || ''
            return sanitized.substring(0, 255) + (sanitized.length > 255 ? '...' : '')
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
    display: flex;
    border: $border-width-s solid $gray-10;
    border-radius: $border-radius-s;
    padding: $space-l;
    gap: $space-l;
    align-items: center;

    @media screen and (min-width: $min-tablet) {
        align-items: flex-start;
        min-height: $dimension;
    }

    .announcement-img-container {
        background-size: cover;
        background-position: top center;
        flex: none;
        position: relative;
        flex-basis: $dimension;
        flex-shrink: 0;
        height: $dimension;

        .announcement-overlay {
            position: absolute;
            inset: 0;
            border-radius: $dimension;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: cover;
            transform-origin: center center;
            transform: scale(0.5);
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

    .announcement-title-mobile {
        font-size: $font-size-l;
        line-height: $font-size-3xl;
        margin-bottom: $space-m;

        @media screen and (min-width: $min-tablet) {
            display: none;
        }
    }
}

.announcement-content {
    display: flex;
    flex-direction: column;
    align-self: stretch;

    .announcement-title {
        display: block;
        font-size: $font-size-l;
        line-height: $font-size-2xl;
        margin-bottom: $space-s;
    }

    .announcement-infos {
        font-size: $font-size-s;
        color: $primary-dark;
        font-weight: 700;
        margin-bottom: $space-s;
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
    }

    .clamped {
        line-height: $font-size-xl;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
}
</style>
