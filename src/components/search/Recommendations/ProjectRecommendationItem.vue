<template>
    <li v-if="recommendation" class="recommendation-item">
        <router-link
            class="recommendation"
            :to="{
                name: 'projectSummary',
                params: { slugOrId: recommendation.slug },
            }"
        >
            <CroppedImage
                v-if="
                    recommendation &&
                    recommendation.header_image &&
                    recommendation.header_image.variations
                "
                ref="projectImg"
                :alt="`${recommendation.title} image`"
                :src="imageError ? defaultImage : recommendation.header_image.variations.small"
                @error="placeHolderImg"
                class="img-container"
            />
            <div class="text-container">
                <span class="project-title">
                    {{ recommendation.title }}
                </span>
                <span class="is-featured" v-if="recommendation.isFeatured">
                    {{ $t('recommendations.is-featured') }}
                </span>
            </div>
        </router-link>
    </li>
</template>

<script>
import imageMixin from '@/mixins/imageMixin.ts'
import CroppedImage from '@/components/base/media/CroppedImage.vue'

export default {
    name: 'ProjectRecommendationItem',

    mixins: [imageMixin],

    components: { CroppedImage },

    props: {
        recommendation: {
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
.recommendation-item {
    padding-inline: $space-m;
    cursor: pointer;

    &:hover {
        background: $primary-lighter;
    }
}

.recommendation {
    margin: $space-m 0;
    display: flex;
    align-items: center;
    padding: $space-s;

    &--spacer {
        padding: $space-s 16px;
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
}

.text-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
}

.project-title {
    font-weight: 700;
    font-size: $font-size-m;
    color: $primary-dark;
    line-height: $line-height-tight;
}

.is-featured {
    font-size: $font-size-s;
    color: $primary-dark;
}
</style>
