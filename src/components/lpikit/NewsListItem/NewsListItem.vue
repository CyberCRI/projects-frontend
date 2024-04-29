<template>
    <RouterLink
        :to="{ name: 'NewsPage', params: { slugOrId: news.id } }"
        class="news-list-item shadow-box"
    >
        <div class="news-img-ctn">
            <CroppedImage
                :alt="`${news.title} image`"
                :image-sizes="imageSizes"
                :src="croppedImageSrc"
                class="picture"
                :ratio="4 / 3"
            />
        </div>
        <div class="news-texts">
            <div class="news-title-ctn">
                <h3 class="news-title">{{ news.title }}</h3>

                <ContextActionMenu
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
    </RouterLink>
</template>
<script>
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import ContextActionMenu from '@/components/lpikit/ContextActionMenu/ContextActionMenu.vue'
import SummaryAction from '@/components/lpikit/SummaryCards/SummaryAction.vue'
import HtmlLimiter from '@/components/lpikit/AnnouncementCard/HtmlLimiter.vue'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'NewsListItem',

    mixins: [imageMixin, permissions],

    emits: ['delete-news', 'edit-news'],

    components: {
        CroppedImage,
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
        }
    },

    computed: {
        imageSizes() {
            return pictureApiToImageSizes(this.news?.header_image)
        },

        croppedImageSrc() {
            return this.news && this.news.header_image
                ? this.news.header_image.variations.small
                : `${this.PUBLIC_BINARIES_PREFIX}/patatoids-project/Patatoid-1.png`
        },
    },

    methods: {
        computeLayout() {
            this.style = {}
        },
        layoutComputed(event) {
            this.style = { height: event.height + 'px' }
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
    height: var(--news-dimension);
    overflow: hidden;
    padding: $space-l;
    border: $border-width-s solid $gray-10;
    border-radius: $border-radius-s;
}

.news-img-ctn {
    flex-basis: calc(var(--news-dimension) * var(--picture-ratio, 1));
    height: var(--news-dimension);
    flex-shrink: 0;
}

.news-texts {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;
}

.news-title-ctn {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
}

.news-title {
    font-size: $font-size-xl;
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
    padding: 1rem 0;

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
