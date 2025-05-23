<template>
  <div class="skill-tab">
    <div class="header">
      <LinkButton
        v-if="isCurrentUser || canEditUser"
        class="edit-btn"
        btn-icon="Pen"
        :label="$t('common.edit')"
        :to="editProfileSkillLink"
        data-test="edit-skills"
      />
    </div>
    <template v-if="allSkills.length">
      <section v-if="skills?.length" class="section">
        <UserSkillsFull
          :full-list="true"
          :skills="skills"
          :title="$t('me.skills')"
          :user-mentorship="userMentorship"
          :is-self="isCurrentUser"
          :mentorship-is-loading="mentorshipIsLoading"
          @reload-mentorship="getUserMentorship"
        />
      </section>
      <section v-if="hobbies?.length" class="section">
        <UserSkillsFull
          :full-list="true"
          :skills="hobbies"
          :title="$t('me.hobbies')"
          :user-mentorship="userMentorship"
          :is-self="isCurrentUser"
          :mentorship-is-loading="mentorshipIsLoading"
          @reload-mentorship="getUserMentorship"
        />
      </section>
    </template>
    <p v-else class="empty-field">
      {{ noSkillLabel }}
    </p>
  </div>
</template>

<script>
import UserSkillsFull from '@/components/people/skill/UserSkillsFull.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import useUsersStore from '@/stores/useUsers.ts'
import useSkillTexts from '@/composables/useSkillTexts.js'
import { getUserMentorship } from '@/api/mentorship.service.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
  name: 'ProfileSkillTab',

  components: {
    UserSkillsFull,
    LinkButton,
  },

  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const usersStore = useUsersStore()
    const skillTexts = useSkillTexts()
    const organizationsStore = useOrganizationsStore()
    const { canEditUser } = usePermissions()
    return {
      usersStore,
      skillTexts,
      organizationsStore,
      canEditUser,
    }
  },

  data() {
    return {
      // mentorship of the logged user
      userMentorship: {},
      mentorshipIsLoading: false,
    }
  },

  computed: {
    editProfileSkillLink() {
      return {
        name: 'ProfileEditSkills' + (this.isCurrentUser ? '' : 'Other'),
        params: this.isCurrentUser ? {} : { userId: this.user.slug || this.user.id },
      }
    },

    allSkills() {
      return this.user.skills || []
    },

    skills() {
      return this.allSkills.filter((s) => s.type == 'skill').sort(this.skillTexts.compareTitles)
    },

    hobbies() {
      return this.allSkills.filter((s) => s.type == 'hobby').sort(this.skillTexts.compareTitles)
    },

    isCurrentUser() {
      return this.usersStore.id === this.user.id
    },

    noSkillLabel() {
      return this.isCurrentUser ? this.$t('me.no-skill') : this.$t('you.no-skill')
    },
  },

  async mounted() {
    if (this.usersStore.isConnected) this.getUserMentorship()
  },
  methods: {
    async getUserMentorship() {
      this.mentorshipIsLoading = true
      try {
        const apiData = (await getUserMentorship(this.organizationsStore.current?.code)).results

        this.userMentorship = apiData.reduce((acc, mentorship) => {
          const skillId = mentorship.skill?.id
          const mentorId = mentorship.mentor?.id
          const mentoreeId = mentorship.mentoree?.id
          if (mentorId == this.user.id) {
            acc[skillId] = 'mentoree'
          }
          if (mentoreeId == this.user.id) {
            acc[skillId] = 'mentor'
          }

          return acc
        }, {})
      } catch (error) {
        console.error(error)
      } finally {
        this.mentorshipIsLoading = false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.skill-tab {
  padding: 24px 0;
}

.title {
  font-size: $font-size-m;
  font-weight: 700;
  color: $primary-dark;
}

.empty-field {
  padding-top: $space-l;
  color: $mid-gray;
  font-weight: 700;
}

.section + .section {
  margin-top: $space-xl;
}

.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

@media screen and (max-width: $min-tablet) {
  .skill-tab {
    padding: $space-l $space-s;
  }
}
</style>
