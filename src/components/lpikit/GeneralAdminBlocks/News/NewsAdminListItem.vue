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
        </div>
    </div>
</template>
<script>
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import ContextActionButton from '@/components/lpikit/LpiButton/ContextActionButton.vue'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'

export default {
    name: 'NewsAdminListItem',

    mixins: [imageMixin],

    emits: ['delete-news', 'edit-news'],

    components: {
        CroppedImage,
        ContextActionButton,
    },

    props: {
        news: {
            type: Object,
            required: true,
        },
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
}
</script>
<style scoped lang="scss">
.news-list-item {
    --news-dimension: 3rem;
    --picture-ratio: calc(4 / 3);

    display: flex;
    gap: 1rem;
    height: var(--news-dimension);
    overflow: hidden;
    padding: 1rem;
    padding-bottom: 1rem;
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

.cropped-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 1rem;
}
</style>
