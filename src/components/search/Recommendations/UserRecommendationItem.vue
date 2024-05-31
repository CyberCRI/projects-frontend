<template>
    <li v-if="recommendation" class="recommendation-item">
        <router-link
            class="recommendation"
            :to="{ name: 'ProfileOtherUser', params: { userId: recommendation.slug } }"
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
                class="img-container"
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

                    <ToolTip
                        v-if="hasMoreTags"
                        hover
                        interactive
                        :is-text-content="false"
                        secondary
                    >
                        <template #custom-content>
                            <div class="extra-skills-list">
                                <BadgeItem
                                    v-for="(skill, index) in moreSkills"
                                    :key="index"
                                    :label="skill.wikipedia_tag.name"
                                    size="small"
                                    colors="primary-light"
                                    class="skill-badge"
                                />
                            </div>
                        </template>
                        <span class="tag-elt-show-more">
                            <BadgeItem
                                :label="`+${moreSkills.length}`"
                                size="small"
                                colors="primary-dark"
                                class="skill-badge"
                            />
                        </span>
                    </ToolTip>
                </div>
            </div>
        </router-link>
    </li>
</template>

<script>
import imageMixin from '@/mixins/imageMixin.ts'
import CroppedImage from '@/components/base/media/CroppedImage.vue'
import BadgeItem from '@/components/base/BadgeItem.vue'
import ToolTip from '@/components/base/ToolTip.vue'

export default {
    name: 'UserRecommendationItem',

    emits: ['go-to-user'],

    mixins: [imageMixin],

    components: { CroppedImage, BadgeItem, ToolTip },

    props: {
        recommendation: {
            type: Object,
            required: true,
        },
    },

    data() {
        return {
            imageError: false,
            skillsLimit: 3,
        }
    },

    computed: {
        defaultImage() {
            return `${this.PUBLIC_BINARIES_PREFIX}/placeholders/user_placeholder.svg`
        },

        displayedSkills() {
            if (
                this.recommendation.skills &&
                this.recommendation.skills.length > this.skillsLimit
            ) {
                return this.recommendation.skills.slice(0, this.skillsLimit)
            } else {
                return this.recommendation.skills
            }
        },

        moreSkills() {
            if (
                this.recommendation.skills &&
                this.recommendation.skills.length > this.skillsLimit
            ) {
                return this.recommendation.skills.slice(this.skillsLimit)
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
    align-items: flex-start;
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
}

.extra-skills-list {
    max-width: 20rem;
    padding: $space-s;
}

.skills,
.extra-skills-list {
    display: flex;
    gap: $space-xs;
    flex-wrap: wrap;
}
</style>
