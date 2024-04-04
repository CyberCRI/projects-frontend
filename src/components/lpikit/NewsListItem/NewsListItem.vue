<template>
    <div class="news-list-item">
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
                <div class="news-actions" v-if="canEditNews">
                    <ContextActionButton
                        action-icon="Pen"
                        class="edit-btn small"
                        @click="$emit('edit-news', news)"
                    />
                    <ContextActionButton
                        action-icon="Close"
                        class="remove-btn small"
                        @click="$emit('delete-news', news)"
                    />
                </div>
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
                <LinkButton
                    class="read-button"
                    btn-icon="ArrowRight"
                    :to="{ name: 'NewsPage', params: { slugOrId: news.id } }"
                    :label="$t('news.list.read-more')"
                />
            </div>
        </div>
    </div>
</template>
<script>
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import ContextActionButton from '@/components/lpikit/LpiButton/ContextActionButton.vue'
import LinkButton from '@/components/lpikit/LpiButton/LinkButton.vue'
import HtmlLimiter from '@/components/lpikit/AnnouncementCard/HtmlLimiter.vue'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'

export default {
    name: 'NewsListItem',

    mixins: [imageMixin],

    emits: ['delete-news', 'edit-news'],

    components: {
        CroppedImage,
        LinkButton,
        HtmlLimiter,
        ContextActionButton,
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
        canEditNews() {
            // TODO: implement logic
            return true
        },
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
    gap: 1rem;
    height: calc(var(--news-dimension) + 3rem);
    overflow: hidden;
    padding: 1rem;
    border: $border-width-s solid $gray-10;
    border-radius: 1rem;
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

.news-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
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
    border-radius: 1rem;
}
</style>
