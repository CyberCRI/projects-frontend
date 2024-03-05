<template>
    <div class="line" :class="[cols]" @click="seeProject">
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
    </div>
</template>

<script>
import imageMixin from '@/mixins/imageMixin.ts'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'

export default {
    name: 'ProjectLine',

    mixins: [imageMixin],

    components: { CroppedImage },

    props: {
        project: {
            type: Object,
            required: true,
        },

        cols: {
            type: String,
            default: 'three-col',
            validator(value) {
                return ['one-col', 'two-col', 'three-col'].includes(value)
            },
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

        seeProject() {
            this.$router.push(`/projects/${this.project.slug}/summary`)
        },
    },
}
</script>

<style lang="scss" scoped>
.line {
    display: flex;
    align-items: center;
    margin-block: $space-2xs;
    margin-left: $space-m;
    cursor: pointer;
}

.three-col {
    width: auto;

    @media screen and (min-width: $min-tablet) {
        width: calc(100% / 3);
    }
}

.two-col {
    width: auto;
    margin-right: $space-m;

    @media screen and (min-width: $min-tablet) {
        width: calc(100% / 2);
        margin-right: 0;
    }
}

@media screen and (min-width: $min-tablet) {
    .line {
        margin-block: $space-m;
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
