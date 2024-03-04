<template>
    <div class="home-announcement-item">
        <h1 class="announcement-title-mobile">{{ $filters.capitalize(announcement.title) }}</h1>
        <div class="announcement-img-container">
            <img :alt="`announcement image`" :src="announcementImage" class="announcement-img" />
        </div>
        <div class="announcement-content">
            <h1 class="announcement-title-desktop">
                {{ $filters.capitalize(announcement.title) }}
            </h1>
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
            <div class="more-info" @click="linkToAnnouncement">
                <IconImage class="arrow" name="ArrowRight" />
                <span class="read"> {{ $filters.capitalize($t('common.read')) }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'HomeAnnouncementsItem',

    components: { IconImage },

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

    methods: {
        linkToAnnouncement() {
            this.$router.push({
                name: 'projectAnnouncements',
                params: { slugOrId: this.announcement.project.slug },
                hash: '#tab',
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.home-announcement-item {
    display: flex;
    flex-direction: column;
    border: 1px solid $gray-10;
    border-radius: $border-radius-s;
    margin-bottom: $space-xl;
    padding: $space-l;

    @media screen and (min-width: $min-tablet) {
        flex-direction: row;
        height: 120px;
    }

    .announcement-img-container {
        align-self: center;
        width: fill-available;
        background-size: cover;
        background-position: top center;
        height: pxToRem(200px);
        flex: none;
        margin-bottom: $space-m;

        @media screen and (min-width: $min-tablet) {
            margin-right: $space-xl;
            margin-bottom: 0;
            width: pxToRem(120px);
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
    .announcement-title-desktop {
        display: none;

        @media screen and (min-width: $min-tablet) {
            display: block;
            font-size: $font-size-l;
            line-height: $font-size-2xl;
            margin-bottom: $space-s;
        }
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
        line-height: $font-size-xl;
        display: -webkit-box;
        -webkit-line-clamp: 1;
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
