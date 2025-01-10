<template>
    <div
        class="category-card-image"
        :key="url"
        :style="`height: ${imageHeight}; width: ${imageWidth};background-size: cover;`"
    >
        <CroppedImage
            v-if="url"
            :ratio="16 / 9"
            :src="url"
            from-center
            :image-sizes="imageSizes"
            class="image"
        />
        <CategoryCardDefaultBackground
            v-else
            :image-height="imageHeight"
            :image-width="imageWidth"
            :shapes-color="shapesColor"
            :background-color="backgroundColor"
        />
    </div>
</template>

<script>
import CategoryCardDefaultBackground from '@/components/category/CategoryCardDefaultBackground.vue'
import CroppedImage from '@/components/base/media/CroppedImage.vue'

export default {
    name: 'CategoryCardImage',

    components: {
        CategoryCardDefaultBackground,
        CroppedImage,
    },

    props: {
        // eslint-disable-next-line
        backgroundColor: {
            type: String,
            required: true,
        },
        // eslint-disable-next-line
        shapesColor: {
            type: String,
            default: '#FFF',
        },
        // eslint-disable-next-line
        imageHeight: {
            type: String,
            required: true,
        },
        // eslint-disable-next-line
        imageWidth: {
            type: String,
            required: true,
        },
        // eslint-disable-next-line
        url: {
            type: String,
            default: null,
        },
        imageSizes: {
            type: Object,
            required: false,
            default: null,
        },
    },
}
</script>

<style lang="scss" scoped>
.category-card-image {
    overflow: hidden;
    position: relative;
}

.image {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 0;
    padding-bottom: 9/16 * 100%;
    transform: translate(-50%, -50%);
}
</style>
