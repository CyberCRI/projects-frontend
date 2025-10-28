<template>
  <div>
    <div class="skill-columns-header">
      <div class="skill-name">
        <span v-if="title" class="column-label">{{ title }}</span>
      </div>
      <div class="skill-level">
        <span class="column-label">{{ t(`profile.edit.skills.skills.levels-help`) }}</span>
        <SkillLevelTip>
          <LinkButton
            label=""
            btn-icon="HelpCircle"
            data-test="skill-levels-help-button"
            secondary
            icon-only
          />
        </SkillLevelTip>
      </div>
      <div class="mentorship">
        <span class="column-label">{{ t(`profile.edit.skills.mentorship.mentorship`) }}</span>
      </div>
    </div>
    <div class="columns-wrapper">
      <SkillItemFull
        v-for="skill in skills"
        :key="skill.id"
        :skill="skill"
        :is-self="isSelf"
        :has-asked-mentorship="userMentorship[skill.id] === 'mentoree'"
        :has-offered-mentorship="userMentorship[skill.id] === 'mentor'"
        :mentorship-is-loading="mentorshipIsLoading"
        @mentorship-send="emit('reload-mentorship')"
      />
    </div>
  </div>
</template>

<script setup>
import SkillItemFull from '@/components/people/skill/SkillItemFull.vue'
import SkillLevelTip from '@/components/people/skill/SkillLevelTip.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'

defineOptions({ name: 'UserSkillsFull' })

defineProps({
  skills: {
    type: Array,
    required: true,
  },

  title: {
    type: String,
    default: '',
  },
  userMentorship: {
    type: Object, // {skillId: "mentor"| "mentoree"}
    default: () => ({}),
  },
  isSelf: {
    type: Boolean,
    default: false,
  },
  mentorshipIsLoading: {
    type: Boolean,
    default: false,
  },
})
const { t } = useNuxtI18n()
const emit = defineEmits(['reload-mentorship'])
</script>

<style lang="scss" scoped>
.skill-columns-header {
  display: flex;
  justify-content: stretch;
  gap: $space-unit;
  align-items: center;
  padding-bottom: $space-l;
  border-bottom: $border-width-s solid $primary;

  .column-label {
    font-weight: 700;
    text-transform: uppercase;
    color: $primary-dark;
  }

  .skill-name {
    flex-basis: 30%;

    @media screen and (max-width: $min-tablet) {
      flex-basis: 100%;
      text-align: center;
    }
  }

  .skill-level {
    flex-basis: 45%;
    display: flex;
    align-items: center;
    justify-content: center;

    @media screen and (max-width: $min-tablet) {
      display: none;
    }
  }

  .mentorship {
    display: flex;
    justify-content: center;
    flex-basis: 25%;

    @media screen and (max-width: $min-tablet) {
      display: none;
    }
  }
}
</style>
