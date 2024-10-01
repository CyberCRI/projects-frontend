<template>
    <div class="announcement-wrapper">
        <div class="announcement-card shadow-box" @click="$emit('know-more-clicked', announcement)">
            <div class="announcement-header horizontal-padding top-padding">
                <span class="date-ctn">
                    {{ $d(new Date(announcement.updated_at)) }}
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

            <div class="main-content horizontal-padding bottom-padding">
                <h3 class="announcement-title bottom-padding">
                    {{ $filters.capitalize(announcement.title) }}
                </h3>

                <div class="description" v-html="announcement.description"></div>
            </div>
            <div class="announcement-link horizontal-padding bottom-padding">
                <span class="read">
                    <span class="icon"><IconImage name="ArrowRight" /></span>
                    {{ $filters.capitalize($t('common.read')) }}
                </span>
            </div>
            <div class="announcement-project horizontal-padding top-padding bottom-padding">
                <div
                    :style="{
                        'background-image': projectImage,
                    }"
                    class="picto"
                ></div>
                <div class="text">
                    <h5 class="project-label">{{ $t('common.the-project') }}</h5>
                    <h4 class="project-title">{{ announcement.project.title }}</h4>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import IconImage from '@/components/base/media/IconImage.vue'
import { stripTags } from '@/filters/index.ts'

export default {
    name: 'AnnouncementCard',

    emits: ['know-more-clicked'],

    components: { IconImage },

    filters: { stripTags },

    props: {
        announcement: {
            type: Object,
            required: true,
        },
    },

    computed: {
        projectImage() {
            return `url(${this.announcement.project?.header_image?.variations?.small}), url(${
                import.meta.env.VITE_APP_PUBLIC_BINARIES_PREFIX
            }/patatoids-project/Patatoid-1.png)`
        },
    },
}
</script>

<style lang="scss" scoped>
$annoucement-picto-size: 72px;
$annoucement-padding: pxToRem(20px);

.announcement-wrapper {
    width: min-content;

    .announcement-card {
        position: relative;
        border: $border-width-s solid $primary;
        border-radius: $border-radius-m;
        width: 356px;
        height: 462px;
        background: $white;
        color: $black;
        display: flex;
        flex-flow: column nowrap;

        .horizontal-padding {
            padding-left: $annoucement-padding;
            padding-right: $annoucement-padding;
        }

        .top-padding {
            padding-top: $annoucement-padding;
        }

        .bottom-padding {
            padding-bottom: $annoucement-padding;
        }

        .announcement-header {
            color: $primary-dark;
            font-size: $font-size-s;
            font-weight: 700;
            text-transform: uppercase;
            flex-shrink: 0;
            flex-grow: 0;

            .dot {
                position: relative;
                top: -2px;
                padding: 0 $space-s;
            }
        }

        .main-content {
            display: flex;
            flex-flow: column nowrap;
            justify-content: flex-start;
            padding-top: $space-l;

            .announcement-title,
            .description {
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-word;
                display: -webkit-box;
                -webkit-box-orient: vertical;
            }

            .announcement-title {
                font-size: $font-size-l;
                font-weight: 500;
                -webkit-line-clamp: 3;
            }

            .description {
                font-size: $font-size-m;
                -webkit-line-clamp: 6;
            }
        }

        .announcement-link {
            flex-shrink: 0;
            flex-grow: 1;
        }

        .read {
            border: 0 none;
            outline: none;
            background-color: transparent;
            color: $primary-dark;
            font-weight: 700;
            font-size: $font-size-m;
            text-transform: capitalize;
            padding: 0;
            display: flex;
            align-items: flex-start;

            .icon {
                width: $font-size-l;
                padding-right: $space-xs;
                display: inline-block;

                svg {
                    fill: $primary-dark;
                }
            }
        }

        .announcement-project {
            flex: 0 0 0;
            display: flex;
            background-color: $primary-lighter;
            border-bottom-left-radius: $border-radius-m;
            border-bottom-right-radius: $border-radius-m;

            .project-label {
                text-transform: uppercase;
                color: $primary-dark;
                font-size: $font-size-2xs;
                font-weight: bold;
                margin: 0;
                padding-bottom: $space-s;
            }

            .picto {
                width: pxToRem($annoucement-picto-size);
                flex-basis: pxToRem($annoucement-picto-size);
                flex-shrink: 0;
                height: pxToRem($annoucement-picto-size);
                background-position: center center;
                background-size: cover;
                border-radius: $border-radius-xs;
            }

            .text {
                padding-left: $annoucement-padding;
                display: flex;
                flex-flow: column nowrap;
                justify-content: flex-start;
                flex-grow: 1;

                .project-label,
                .spacer {
                    flex-shrink: 0;
                    flex-grow: 0;
                }
            }

            .project-title {
                -webkit-line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-word;
                display: -webkit-box;
                -webkit-box-orient: vertical;
            }
        }
    }
}

:deep(.description) {
    strong {
        font-weight: 700;
    }

    em {
        font-style: italic;
    }

    u {
        text-decoration: underline;
    }

    a:hover {
        text-decoration: underline;
    }
}
</style>
