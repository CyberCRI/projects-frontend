<template>
    <NuxtLink
        :to="{ name: 'NewsPage', params: { slugOrId: news.id } }"
        class="news-list-item shadow-box"
    >
        <div class="news-title-ctn mobile">
            <h3 class="news-title">{{ news.title }}</h3>
            <ContextActionMenu
                v-if="canEditNews || canDeleteNews"
                class="news-actions"
                @edit="$emit('edit-news', news)"
                :can-edit="canEditNews"
                @delete="$emit('delete-news', news)"
                :can-delete="canDeleteNews"
            />
        </div>
        <div class="news-img-ctn">
            <CroppedApiImage
                :alt="`${news.title} image`"
                class="picture"
                :ratio="4 / 3"
                :picture-data="news?.header_image"
                picture-size="small"
                default-picture="/patatoids-project/Patatoid-1.png"
            />
        </div>
        <div class="news-texts" :style="textsStyle">
            <div class="news-title-ctn desktop">
                <h3 class="news-title">{{ news.title }}</h3>

                <ContextActionMenu
                    v-if="canEditNews || canDeleteNews"
                    class="news-actions"
                    @edit="$emit('edit-news', news)"
                    :can-edit="canEditNews"
                    @delete="$emit('delete-news', news)"
                    :can-delete="canDeleteNews"
                />
            </div>
            <div class="news-excerpt" :style="style">
                <HtmlLimiter
                    :html="news.content"
                    :striped-tags="['table']"
                    class="description-content"
                    @computed="layoutComputed"
                    @computing="computeLayout"
                />
            </div>
            <div class="read-more-ctn">
                <SummaryAction class="read-button" :action-label="$t('news.list.read-more')" />
            </div>
        </div>
    </NuxtLink>
</template>
<script>
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import ContextActionMenu from '@/components/base/button/ContextActionMenu.vue'
import SummaryAction from '@/components/home/SummaryCards/SummaryAction.vue'
import HtmlLimiter from '@/components/base/HtmlLimiter.vue'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'NewsListItem',

    mixins: [permissions],

    emits: ['delete-news', 'edit-news'],

    components: {
        CroppedApiImage,
        SummaryAction,
        HtmlLimiter,
        ContextActionMenu,
    },

    props: {
        news: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            style: {},
            textsStyle: {},
        }
    },

    methods: {
        computeLayout() {
            this.style = {}
            this.textsStyle = {}
        },
        layoutComputed(event) {
            this.style = { height: event.height + 'px' }
            this.textsStyle = { height: 'auto' }
        },
    },
}
</script>
<style scoped lang="scss">
.news-list-item {
    --news-dimension: 13rem;
    --picture-ratio: calc(4 / 3);

    display: flex;
    align-items: stretch;
    gap: $space-l;
    overflow: hidden;
    padding: $space-l;
    border: $border-width-s solid $lighter-gray;
    border-radius: $border-radius-s;
    flex-direction: column;

    @media screen and (min-width: $min-tablet) {
        flex-direction: row;
        height: var(--news-dimension);
    }
}

.news-img-ctn {
    flex-shrink: 0;
    aspect-ratio: calc(4 / 3);
    width: 100%;

    @media screen and (min-width: $min-tablet) {
        flex-basis: calc(var(--news-dimension) * var(--picture-ratio, 1));
        width: auto;
    }
}

.news-texts {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;

    @media screen and (max-width: $min-tablet) {
        height: 12rem;
    }
}

.news-title-ctn {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.news-title {
    font-size: $font-size-xl;
    line-height: $line-height-tight;
}

@media screen and (min-width: $min-tablet) {
    .mobile {
        display: none;
    }
}

@media screen and (max-width: $min-tablet) {
    .desktop {
        display: none;
    }
}

.news-excerpt {
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-flow: column;

    h1 {
        font-size: $font-size-2xl;
        font-weight: 700;
    }

    h2 {
        font-size: $font-size-xl;
        font-weight: 500;
    }

    h3 {
        font-size: $font-size-l;
        font-weight: 500;
    }

    h4 {
        font-size: $font-size-m;
        font-weight: 500;
    }
}

.read-more-ctn {
    flex-shrink: 0;
    padding-top: 1rem;

    .read-button {
        width: min-content;
        padding-left: 0;
    }
}

.cropped-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: $border-radius-s;
}
</style>
