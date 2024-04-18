<template>
    <div class="home-announcement-item">
        <div class="announcement-img-container">
            <img :alt="`announcement image`" :src="announcementImage" class="announcement-img" />
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
            <div class="announcement-description" v-html="announcement.description"></div>

            <SummaryAction
                :to="{
                    name: 'projectAnnouncements',
                    params: { slugOrId: this.announcement.project.slug },
                    hash: '#tab',
                }"
                :action-label="$t('common.read')"
            />
        </div>
    </div>
</template>

<script>
import SummaryAction from '@/components/lpikit/SummaryCards/SummaryAction.vue'

export default {
    name: 'NewsfeedAnnouncementsItem',

    components: { SummaryAction },

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
        announcementImage() {
            return `${
                import.meta.env.VITE_APP_PUBLIC_BINARIES_PREFIX
            }/placeholders/announcement_placeholder.png`
        },
    },
}
</script>

<style lang="scss" scoped>
.home-announcement-item {
    display: flex;
    border: $border-width-s solid $gray-10;
    border-radius: $border-radius-s;
    padding: $space-l;
    gap: $space-l;

    @media screen and (min-width: $min-tablet) {
        min-height: 120px;
    }

    .announcement-img-container {
        align-self: center;
        background-size: cover;
        background-position: top center;
        flex: none;

        @media screen and (min-width: $min-tablet) {
            margin-right: $space-xl;
            flex-basis: pxToRem(120px);
            flex-shrink: 1;
            height: pxToRem(120px);
        }

        .announcement-img {
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
        line-height: $font-size-xl;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
}
</style>
