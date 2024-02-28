<template>
    <li v-if="recommendation" class="recommendation-item">
        <div
            class="recommendation"
            @click="goTo"
            @mouseover="showExtraTags = true"
            @mouseout="showExtraTags = false"
        >
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
                <div class="skills">
                    <BadgeItem
                        v-for="(skill, index) in displayedSkills"
                        :key="index"
                        :label="skill.wikipedia_tag.name"
                        size="small"
                        colors="primary-light"
                        class="skill-badge"
                    />
                    <span
                        class="tag-elt-show-more"
                        @click="showExtraTags = !showExtraTags"
                        :class="{ hidden: !hasMoreTags || showExtraTags }"
                    >
                        <BadgeItem
                            v-if="moreSkills && !showExtraTags"
                            :label="`+${moreSkills.length}`"
                            size="small"
                            colors="primary-dark"
                            class="skill-badge"
                            @mouseover="showExtraTags = true"
                            @mouseout="showExtraTags = false"
                        />
                    </span>
                </div>
                <div v-if="showExtraTags">
                    <BadgeItem
                        v-for="(skill, index) in moreSkills"
                        :key="index"
                        :label="skill.wikipedia_tag.name"
                        size="small"
                        colors="primary-light"
                        class="skill-badge"
                    />
                </div>
            </div>
        </div>
    </li>
</template>

<script>
import imageMixin from '@/mixins/imageMixin.ts'
import CroppedImage from '@/components/lpikit/CroppedImage/CroppedImage.vue'
import BadgeItem from '@/components/lpikit/Badge/BadgeItem.vue'

export default {
    name: 'UserRecommendationItem',

    emits: ['go-to-user'],

    mixins: [imageMixin],

    components: { CroppedImage, BadgeItem },

    props: {
        recommendation: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            imageError: false,
            showExtraTags: false,
        }
    },

    computed: {
        defaultImage() {
            return `${this.PUBLIC_BINARIES_PREFIX}/placeholders/user_placeholder.svg`
        },

        displayedSkills() {
            if (this.recommendation.skills && this.recommendation.skills.length > 3) {
                return this.recommendation.skills.slice(0, 3)
            } else {
                return this.recommendation.skills
            }
        },

        moreSkills() {
            if (this.recommendation.skills && this.recommendation.skills.length > 3) {
                return this.recommendation.skills.slice(3)
            } else {
                return []
            }
        },

        hasMoreTags() {
            return this.moreSkills.length > 0
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
    padding-block: $space-xs;
}

.skill-badge {
    margin-right: $space-3xs;
    margin-bottom: $space-3xs;
}

.tag-elt-show-more {
    cursor: pointer;

    &.hidden {
        visibility: hidden;
        pointer-events: none;
    }
}

.is-showing-more {
    position: relative;
    z-index: 2;
}
</style>
