<template>
    <div class="home-news-item">
        <h1 class="news-title-mobile">{{ $filters.capitalize(news.title) }}</h1>

        <div class="news-img-container">
            <img
                :alt="`${news.title} image`"
                :src="
                    imageError
                        ? `${this.PUBLIC_BINARIES_PREFIX}/placeholders/header_placeholder.png`
                        : news.header_image.variations.small
                "
                @error="placeHolderImg"
                @load="onImageLoaded"
                class="news-img"
            />
        </div>
        <div class="news-content">
            <h1 class="news-title-desktop">{{ $filters.capitalize(news.title) }}</h1>
            <p class="news-description">{{ news.purpose }}</p>
            <div class="more-info" @click="readMore">
                <IconImage class="arrow" name="ArrowRight" />
                <span class="read"> {{ $filters.capitalize($t('common.read')) }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import IconImage from '@/components/svgs/IconImage.vue'

export default {
    name: 'HomeNewsItem',

    components: { IconImage },

    props: {
        news: {
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

    methods: {
        placeHolderImg() {
            this.imageError = true
            this.imageLoaded = true
        },

        onImageLoaded() {
            this.imageLoaded = true
        },

        readMore() {
            this.$router.push(`/projects/${this.news.slug}/summary`)
        },
    },
}
</script>

<style lang="scss" scoped>
.home-news-item {
    display: flex;
    flex-direction: column;
    border: 1px solid $gray-10;
    border-radius: $border-radius-s;
    margin-bottom: $space-xl;
    padding: $space-l;

    @media screen and (min-width: $min-tablet) {
        flex-direction: row;
        height: 200px;
    }

    .news-img-container {
        align-self: center;
        background-size: cover;
        background-position: top center;
        height: pxToRem(200px);
        flex: none;
        margin-bottom: $space-m;

        @media screen and (min-width: $min-tablet) {
            margin-right: $space-xl;
            margin-bottom: 0;
            width: 280px;
        }

        .news-img {
            object-fit: cover;
            max-width: inherit;
            max-height: inherit;
            height: inherit;
            width: inherit;
            border-radius: $border-radius-s;
            border: 1px solid $gray-10;
        }
    }

    .news-title-mobile {
        font-size: $font-size-l;
        line-height: $font-size-3xl;
        margin-bottom: $space-m;

        @media screen and (min-width: $min-tablet) {
            display: none;
        }
    }
}

.news-content {
    .news-title-desktop {
        display: none;

        @media screen and (min-width: $min-tablet) {
            display: block;
            font-size: $font-size-2xl;
            line-height: $font-size-3xl;
            margin-bottom: $space-m;
        }
    }

    .news-description {
        line-height: $font-size-xl;
        display: -webkit-box;
        -webkit-line-clamp: 3;
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
