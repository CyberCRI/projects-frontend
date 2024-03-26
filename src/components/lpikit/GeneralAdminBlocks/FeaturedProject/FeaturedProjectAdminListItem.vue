<template>
    <div class="featured-project-admin-list-item">
        <div class="project-image">
            <CroppedImage
                :alt="`${project.title} image`"
                :image-sizes="imageSizes"
                :src="croppedImageSrc"
                class="picture"
            />
        </div>
        <div project-text>
            <h4 class="title">{{ project.title }}</h4>
        </div>
    </div>
</template>

<script>
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'
import imageMixin from '@/mixins/imageMixin.ts'

export default {
    name: 'FeaturedProjectAdminListItem',

    components: {
        CroppedImage,
    },

    mixins: [imageMixin],

    props: {
        project: {
            type: Object,
            required: true,
        },
    },

    computed: {
        imageSizes() {
            if (
                this.project &&
                this.project.header_image &&
                this.project.header_image.scale_x &&
                this.project.header_image.scale_y &&
                this.project.header_image.natural_ratio
            ) {
                return {
                    scaleX: this.project.header_image.scale_x,
                    scaleY: this.project.header_image.scale_y,
                    naturalRatio: this.project.header_image.natural_ratio,
                    left: this.project.header_image.left || 0,
                    top: this.project.header_image.top || 0,
                }
            }
            return null
        },

        croppedImageSrc() {
            return this.project && this.project.header_image
                ? this.project.header_image.variations.small
                : `${this.PUBLIC_BINARIES_PREFIX}/patatoids-project/Patatoid-1.png`
        },
    },
}
</script>
<style scoped lang="scss">
.featured-project-admin-list-item {
    display: flex;
    gap: $space-unit;
    justify-content: flex-start;
    align-items: center;

    .project-image {
        width: 4rem;
        height: 4rem;
    }

    .title {
        color: $primary-dark;
        font-weight: 700;
        text-overflow: ellipsis;

        /* Required for text-overflow to do anything */
        white-space: nowrap;
        overflow: hidden;
        max-width: 32rem;

        @media screen and (max-width: $min-tablet) {
            max-width: 15rem;
        }
    }

    & + .featured-project-admin-list-item {
        margin-top: $space-unit;
    }
}
</style>
