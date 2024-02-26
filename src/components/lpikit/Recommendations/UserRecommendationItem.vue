<template>
    <li v-if="recommendation" class="recommendation-item">
        <div class="recommendation" @click="goTo">
            <CroppedImage
                v-if="recommendation"
                ref="userImg"
                :alt="`${recommendation.slug} image`"
                :src="
                    imageError
                        ? defaultImage
                        : recommendation?.profile_picture?.variations?.small || ''
                "
                @error="placeHolderImg"
                :class="['img-container', { 'img-container--error': imageError }]"
            />
            <div class="text-container">
                <span class="name">
                    {{ $filters.capitalize(recommendation.given_name) }}
                    {{ $filters.capitalize(recommendation.family_name) }}
                </span>
                <span v-if="recommendation.job" class="job">
                    {{ $filters.capitalize(recommendation.job) }}
                </span>
            </div>
        </div>
    </li>
</template>

<script>
import imageMixin from '@/mixins/imageMixin.ts'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'

export default {
    name: 'UserRecommendationItem',

    emits: ['go-to-user'],

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
            return `${this.PUBLIC_BINARIES_PREFIX}/placeholders/user_placeholder.svg`
        },
    },

    methods: {
        placeHolderImg() {
            this.imageError = true
        },

        goTo() {
            this.$router.push(`/profile/${this.recommendation.slug}`)
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
    border-radius: 50%;
    background-size: cover;
    background-position: top center;
    width: 50px;
    height: 50px;
    flex: none;
    margin-right: $space-s;
    line-height: $font-size-l;
}

.text-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
}

.name {
    font-weight: 700;
    font-size: $font-size-m;
    color: $primary-dark;
}

.job {
    font-size: $font-size-s;
    color: $black;
    padding-top: $space-xs;
}
</style>
