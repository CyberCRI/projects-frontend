<script setup lang="ts">
import SkillContainer from '~/components/profile/modules/Skills/SkillContainer.vue'
import { factoryPagination, maxSkeleton } from '~/skeletons/base.skeletons'
import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { refreshUserData } from '~/composables/user/refreshUser'
import { getUserMentorship } from '~/api/v2/mentoring.service'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { skillSkeleton } from '~/skeletons/skill.skeletons'
import type { MentorShip } from '~/interfaces/mengtorship'
import { getUserSkills } from '~/api/v2/skills.service'
import { groupBy } from 'es-toolkit'

const props = withDefaults(
  defineProps<{
    user: TranslatedUserModel
    preview?: boolean
    limit?: number
    editable?: boolean
  }>(),
  {
    preview: false,
    // add max limit for non preview
    limit: null,
    editable: false,
  }
)

const userSlugOrId = computed(() => props.user.slug || props.user.id)

const limitSkeletons = computed(() => maxSkeleton(props.user.modules.skills, props.limit))
const organizationCode = useOrganizationCode()

const {
  error,
  status: statusSkill,
  data: skills,
  refresh: refreshSkills,
} = getUserSkills(organizationCode, userSlugOrId, {
  default: () => factoryPagination(skillSkeleton, limitSkeletons.value),
  paginationConfig: {
    // add 999 for non-preview page
    limit: props.preview ? props.limit : 999,
  },
})

const {
  refresh: refreshMentorship,
  status: statusMentorShip,
  data: dataMentorship,
} = getUserMentorship(organizationCode, {
  default: () => [],
})

const groupedSkills = computed(() => groupBy(skills.value, (skill) => skill.type))

const refreshAll = () => {
  return refreshUserData(props.user)
    .then(() => refreshSkills())
    .then(() => refreshMentorship())
}

const mentorShip = computed<MentorShip>(() => {
  return (dataMentorship.value || []).reduce((acc, mentorship) => {
    const skillId = mentorship.skill?.id
    const mentorId = mentorship.mentor?.id
    const mentoreeId = mentorship.mentoree?.id
    if (mentorId == props.user.id) {
      acc[skillId] = 'mentoree'
    }
    if (mentoreeId == props.user.id) {
      acc[skillId] = 'mentor'
    }
    return acc
  }, {})
})
</script>

<template>
  <FetchLoader :status="[statusSkill, statusMentorShip]" :error="error" only-error skeleton>
    <SkillContainer
      v-if="editable || (groupedSkills.skill || []).length"
      :user="user"
      :title="$t('me.skills')"
      skill-type="skills"
      :editable="editable"
      :preview="preview"
      :skills="groupedSkills.skill || []"
      :mentor-ship="mentorShip"
      @refresh="refreshAll()"
      @mentorship-send="refreshMentorship()"
    />
    <SkillContainer
      v-if="editable || (groupedSkills.hobby || []).length"
      :user="user"
      :title="$t('me.hobbies')"
      skill-type="hobbies"
      :editable="editable"
      :preview="preview"
      :skills="groupedSkills.hobby || []"
      :mentor-ship="mentorShip"
      @refresh="refreshAll()"
      @mentorship-send="refreshMentorship()"
    />
  </FetchLoader>
</template>

<style lang="scss" scoped>
.skills {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
