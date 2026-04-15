<template>
  <div class="skill-tab">
    <FetchLoader :status="status">
      <template v-if="allSkills.length">
        <section v-if="skills.length" class="section">
          <UserSkillsFull
            :full-list="true"
            :skills="skills"
            :title="$t('me.skills')"
            :user-mentorship="userMentorship"
            :is-self="isCurrentUser"
            orship-is-loading="mentorshipIsLoading.value"
            @reload-mentorship="refresh"
          />
        </section>
        <section v-if="hobbies.length" class="section">
          <UserSkillsFull
            :full-list="true"
            :skills="hobbies"
            :title="$t('me.hobbies')"
            :user-mentorship="userMentorship"
            :is-self="isCurrentUser"
            orship-is-loading="mentorshipIsLoading.value"
            @reload-mentorship="refresh"
          />
        </section>
      </template>
      <EmptyLabel v-else :labe="noSkillLabel" />
    </FetchLoader>
  </div>
</template>

<script setup lang="ts">
import useUsersStore from '@/stores/useUsers'
import useSkillTexts from '@/composables/useSkillTexts'
import { TranslatedUserModel } from '@/models/user.model'
import { getUserMentorship } from '@/api/v2/mentoring.service'

const props = defineProps<{
  user: TranslatedUserModel
}>()

const organizationCode = useOrganizationCode()

const { t } = useNuxtI18n()
const usersStore = useUsersStore()
const skillTexts = useSkillTexts()

const { refresh, status, data } = getUserMentorship(organizationCode, {
  default: () => [],
  immediate: false,
})

watch(
  () => usersStore.isConnected,
  () => refresh()
)

const userMentorship = computed(() => {
  return (data.value || []).reduce((acc, mentorship) => {
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

const allSkills = computed(() => props.user.skills || [])

const skills = computed(() => {
  return allSkills.value.filter((s) => s.type == 'skill').sort(skillTexts.compareTitles)
})

const hobbies = computed(() => {
  return allSkills.value.filter((s) => s.type == 'hobby').sort(skillTexts.compareTitles)
})

const isCurrentUser = computed(() => usersStore.id === props.user.id)

const noSkillLabel = computed(() => {
  return isCurrentUser.value ? t('me.no-skill') : t('you.no-skill')
})
</script>

<style lang="scss" scoped>
.section + .section {
  margin-top: $space-xl;
}
</style>
