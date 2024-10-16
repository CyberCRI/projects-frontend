<template>
    <RouterLink
        class="similar-project"
        :to="{
            name: 'projectSummary',
            params: {
                slugOrId: project.slug,
            },
        }"
    >
        <CroppedImage
            v-if="project.header_image && project.header_image.variations"
            :alt="`${project.title} image`"
            :src="croppedImageSrc"
            :image-sizes="imageSizes"
            @error="placeHolderImg"
            @load="onImageLoaded"
        />

        <p>{{ project.title }}</p>
    </RouterLink>
</template>

<script>
import CroppedImage from '@/components/base/media/CroppedImage.vue'
import imageMixin from '@/mixins/imageMixin.ts'
import { pictureApiToImageSizes } from '@/functs/imageSizesUtils.ts'

export default {
    name: 'SimilarProjectsItem',

    components: { CroppedImage },

    mixins: [imageMixin],

    props: {
        project: {
            type: Object,
            default: () => ({}),
        },
    },

    data() {
        return {
            imageError: false,
            imageLoaded: false,
        }
    },

    computed: {
        croppedImageSrc() {
            return this.imageError
                ? `${this.PUBLIC_BINARIES_PREFIX}/placeholders/header_placeholder.png`
                : this.project.header_image?.variations.small
        },
        imageSizes() {
            return pictureApiToImageSizes(this.project?.header_image)
        },
    },

    methods: {
        placeHolderImg() {
            this.imageError = true
            this.imageLoaded = true
        },

        onImageLoaded() {
            this.imageLoaded = true
        },
    },
}
</script>

<style lang="scss" scoped>
.similar-project {
    display: flex;
    align-items: center;
    cursor: pointer;

    .cropped-image {
        margin-right: $space-s;
        flex: 0 0 72px;
        height: 72px;
        border-radius: $border-radius-xs;
    }

    p {
        color: $white;
        font-size: $font-size-s;
        font-weight: 400;
    }
}
</style>
