<template>
    <div class="category-card-image">
        <CategoryCardDefaultBackground
            v-if="!url"
            :image-height="imageHeight"
            :image-width="imageWidth"
            :shapes-color="shapesColor"
            :background-color="backgroundColor"
        />
        <div
            v-else
            :style="`background-image: url(${url}); height: ${imageHeight}; width: ${imageWidth};background-size: cover;`"
            class="image"
        />
    </div>
</template>

<script>
import CategoryCardDefaultBackground from '@/components/category/CategoryCardDefaultBackground.vue'

export default {
    name: 'CategoryCardImage',

    components: {
        CategoryCardDefaultBackground,
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
    },
}
</script>

<style lang="scss" scoped>
.image {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
</style>
