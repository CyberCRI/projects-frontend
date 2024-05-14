<template>
    <RouterLink
        :to="{ name: 'pageProject', params: { slugOrId: project.slug || project.id } }"
        class="line"
    >
        <CroppedImage
            v-if="project && project.header_image && project.header_image.variations"
            ref="projectImg"
            :alt="`${project.title} image`"
            :src="imageError ? defaultImage : project.header_image.variations.small"
            @error="placeHolderImg"
            class="img-container"
        />
        <div class="project-title">
            {{ $filters.capitalize(project.title) }}
        </div>
    </RouterLink>
</template>

<script>
import imageMixin from '@/mixins/imageMixin.ts'
import CroppedImage from '@/components/base/media/CroppedImage.vue'

export default {
    name: 'ProjectLine',

    mixins: [imageMixin],

    components: { CroppedImage },

    props: {
        project: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            imageError: false,
        }
    },

    computed: {
        defaultImage() {
            return `${this.PUBLIC_BINARIES_PREFIX}/placeholders/header_placeholder.png`
        },
    },

    methods: {
        placeHolderImg() {
            this.imageError = true
        },
    },
}
</script>

<style lang="scss" scoped>
.line {
    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
        background-color: $primary-lighter;
    }
}

.img-container {
    border-radius: $border-radius-s;
    background-size: cover;
    background-position: top center;
    width: 50px;
    height: 50px;
    flex: none;
    margin-right: $space-s;
    line-height: $font-size-l;
}

.project-title {
    font-weight: 700;
    color: $primary-dark;
    -webkit-line-clamp: 1;
}
</style>
