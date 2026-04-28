<template>
  <li class="recommendation-item">
    <NuxtLink
      class="recommendation"
      :to="{ name: 'ProfileOtherUser', params: { userId: user.slug } }"
    >
      <CroppedApiImage
        ref="userImg"
        :alt="`${user.slug} image`"
        class="img-container skeletons-background"
        :picture-data="user.profile_picture"
        picture-size="small"
        :default-picture="DEFAULT_USER_PATATOID"
      />
      <div class="text-container">
        <span class="name skeletons-text">
          {{ capitalize(user.given_name) }}
          {{ capitalize(user.family_name) }}
        </span>
        <span v-if="user.job" class="job skeletons-text">
          {{ capitalize(user.$t.job) }}
        </span>
        <div class="skills">
          <BadgeItem
            v-for="(skill, index) in displayedSkills"
            :key="index"
            :label="skillTexts.title(skill)"
            size="small"
            colors="primary-light"
            class="skill-badge skeletons-background"
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
                  class="skill-badge skeletons-background"
                />
              </div>
            </template>
            <span class="tag-elt-show-more">
              <BadgeItem
                :label="`+${moreSkills.length}`"
                size="small"
                colors="primary-dark"
                class="skill-badge skeletons-background"
              />
            </span>
          </ToolTip>
        </div>
      </div>
    </NuxtLink>
  </li>
</template>

<script setup lang="ts">
import { capitalize } from '@/functs/string'

import BadgeItem from '@/components/base/BadgeItem.vue'
import ToolTip from '@/components/base/ToolTip.vue'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import { DEFAULT_USER_PATATOID } from '@/composables/usePatatoids'
import useSkillTexts from '@/composables/useSkillTexts'
import { TranslatedUserModel } from '@/models/user.model'

const props = defineProps<{
  user: TranslatedUserModel
}>()

defineEmits<{
  'go-to-user': []
}>()

const skillTexts = useSkillTexts()
const SKILLS_LIMITS = 3

const skills = computed(() => {
  return (props.user.skills || []).filter((s) => s.type == 'skill')
})
const displayedSkills = computed(() => skills.value.slice(0, SKILLS_LIMITS))
const moreSkills = computed(() => skills.value.slice(SKILLS_LIMITS))
const hasMoreTags = computed(() => moreSkills.value.length > 0)
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
