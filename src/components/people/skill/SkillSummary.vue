<template>
  <div class="skill-summary">
    <div class="skill-header">
      <h4 class="title">{{ $t('profile.skills') }} ({{ allSkills.length }})</h4>
      <SeeMoreArrow
        v-if="allSkills.length > maxSkills"
        data-test="see-more-skills"
        @click.prevent="goToSkillTab"
      />
    </div>

    <div class="skills">
      <template v-if="allSkills.length">
        <SkillItem
          v-for="skill in visibleSkills"
          :key="skill.id"
          :label="skillTexts.title(skill)"
          :description="skillTexts.description(skill)"
          :level="Number(skill.level)"
        />
      </template>
      <p v-else class="empty-field">
        {{ noSkillLabel }}
      </p>
    </div>
  </div>
</template>

<script>
import SkillItem from '@/components/people/skill/SkillItem.vue'
import SeeMoreArrow from '@/components/base/button/SeeMoreArrow.vue'
import useUsersStore from '@/stores/useUsers.ts'
import useSkillTexts from '@/composables/useSkillTexts.js'

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
      return this.allSkills.length <= this.maxSkills
    },

    allSkills() {
      return this.user.skills
    },

    visibleSkills() {
      let skills = [...this.allSkills].sort(
        (a, b) => b.level - a.level || this.skillTexts.compareTitles(a, b)
      )
      if (!this.allStepsVisible) skills = skills.slice(0, this.maxSkills)
      return skills
    },

    isCurrentUser() {
      return this.usersStore.id === this.user.id
    },

    noSkillLabel() {
      return this.isCurrentUser ? this.$t('me.no-skill') : this.$t('you.no-skill')
    },
  },

  methods: {
    goToSkillTab() {
      this.selectTab(4)
    },
  },
}
</script>

<style lang="scss" scoped>
.skill-summary {
  display: flex;
  flex-direction: column;
  background: $primary-lighter;
  padding: 24px;
  border-radius: $border-radius-l;

  .skill-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: $space-l;
  }

  .title {
    font-size: $font-size-l;
    font-weight: 700;
    color: $primary-dark;
  }

  .skills {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
}

.empty-field {
  color: $mid-gray;
  font-weight: 700;
}
</style>
