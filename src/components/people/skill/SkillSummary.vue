<template>
  <div v-if="allSkills?.length" class="skill-summary">
    <div class="skill-header">
      <h4 class="title">{{ $t('profile.skills') }} ({{ allSkills?.length || '' }})</h4>
      <SeeMoreArrow
        v-if="allSkills?.length > maxSkills"
        data-test="see-more-skills"
        @click.prevent="goToSkillTab"
      />
    </div>

    <div class="skills">
      <SkillItem
        v-for="skill in visibleSkills"
        :key="skill.id"
        :label="skillTexts.title(skill)"
        :description="skillTexts.description(skill)"
        :level="Number(skill.level)"
      />
    </div>
  </div>
</template>

<script>
import SeeMoreArrow from '~/components/base/button/SeeMoreArrow.vue'
import SkillItem from '~/components/people/skill/SkillItem.vue'

import useUsersStore from '~/stores/useUsers'

import useSkillTexts from '~/composables/useSkillTexts'

export default {
  name: 'SkillSummary',

  components: {
    SeeMoreArrow,
    SkillItem,
  },
  inject: {
    selectTab: {
      from: 'tabsLayoutSelectTab',
      default: () => {},
    },
  },

  props: {
    user: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    const usersStore = useUsersStore()
    const skillTexts = useSkillTexts()
    return {
      usersStore,
      skillTexts,
    }
  },

  data() {
    return {
      maxSkills: 9,
    }
  },

  computed: {
    allStepsVisible() {
      return this.allSkills?.length <= this.maxSkills
    },

    allSkills() {
      return this.user.skills
    },

    visibleSkills() {
      let skills = [...(this.allSkills || [])].sort(
        (a, b) => b.level - a.level || this.skillTexts.compareTitles(a, b)
      )
      if (!this.allStepsVisible) skills = skills.slice(0, this.maxSkills)
      return skills
    },
  },

  methods: {
    goToSkillTab() {
      this.selectTab('skills')
    },
  },
}
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.skill-summary {
  display: flex;
  flex-direction: column;
  background: variables.$primary-lighter;
  padding: 24px;
  border-radius: variables.$border-radius-l;

  .skill-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: variables.$space-l;
  }

  .title {
    font-size: variables.$font-size-l;
    font-weight: 700;
    color: variables.$primary-dark;
  }

  .skills {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
}

.empty-field {
  color: variables.$mid-gray;
  font-weight: 700;
}
</style>
