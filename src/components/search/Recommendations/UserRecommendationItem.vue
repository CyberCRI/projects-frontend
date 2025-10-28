<template>
  <li v-if="recommendation" class="recommendation-item">
    <NuxtLink
      class="recommendation"
      :to="{ name: 'ProfileOtherUser', params: { userId: recommendation.slug } }"
    >
      <CroppedApiImage
        ref="userImg"
        :alt="`${recommendation.slug} image`"
        class="img-container"
        :picture-data="recommendation?.profile_picture"
        picture-size="small"
        default-picture="/placeholders/user_placeholder.svg"
      />
      <div class="text-container">
        <span class="name">
          {{ capitalize(recommendation.given_name) }}
          {{ capitalize(recommendation.family_name) }}
        </span>
        <span v-if="recommendation.job" class="job">
          {{ capitalize(recommendation?.$t?.job) }}
        </span>
        <div class="skills">
          <BadgeItem
            v-for="(skill, index) in displayedSkills"
            :key="index"
            :label="skillTexts.title(skill)"
            size="small"
            colors="primary-light"
            class="skill-badge"
          />

          <ToolTip v-if="hasMoreTags" hover interactive :is-text-content="false" secondary>
            <template #custom-content>
              <div class="extra-skills-list">
                <BadgeItem
                  v-for="(skill, index) in moreSkills"
                  :key="index"
                  :label="skillTexts.title(skill)"
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
    </NuxtLink>
  </li>
</template>

<script>
import { capitalize } from '@/functs/string'

import BadgeItem from '@/components/base/BadgeItem.vue'
import ToolTip from '@/components/base/ToolTip.vue'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import useSkillTexts from '@/composables/useSkillTexts.js'

export default {
  name: 'UserRecommendationItem',

  components: { CroppedApiImage, BadgeItem, ToolTip },

  props: {
    recommendation: {
      type: Object,
      required: true,
    },
  },

  emits: ['go-to-user'],

  setup() {
    const skillTexts = useSkillTexts()
    return {
      skillTexts,
      capitalize,
    }
  },

  data() {
    return {
      skillsLimit: 3,
    }
  },

  computed: {
    skills() {
      return (this.recommendation.skills || []).filter((s) => s.type == 'skill')
    },

    displayedSkills() {
      if (this.skills.length > this.skillsLimit) {
        return this.skills.slice(0, this.skillsLimit)
      } else {
        return this.skills
      }
    },

    moreSkills() {
      if (this.skills.length > this.skillsLimit) {
        return this.skills.slice(this.skillsLimit)
      } else {
        return []
      }
    },

    hasMoreTags() {
      return this.moreSkills.length > 0
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
  line-height: $layout-size-l;
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
