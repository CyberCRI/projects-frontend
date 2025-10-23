<template>
  <div class="team-section">
    <label>
      <span class="section-title">
        {{ capitalize($t('team.project-members')) }}
        <span v-if="projectUsers.length">({{ projectUsers.length }})</span>
      </span>
      <span
        class="add-user-card"
        :class="{ disabled: unfocusable }"
        :v-disable-focus="unfocusable"
        @click="teamModalVisible = true"
      >
        <IconImage name="Plus" />
        <span>{{ capitalize($t('team.add')) }}</span>
      </span>
    </label>

    <div v-if="currentUser" class="team-grid">
      <TeamCardInline
        v-for="user in projectUsers"
        :key="user?.user.id"
        :role-label="roleLabel(user.role)"
        :user="user.user"
        @user-clicked="removeUser(user)"
      />
    </div>

    <TeamDrawer
      :current-users="projectUsers"
      :is-opened="teamModalVisible"
      :selected-categories="[selectedCategory]"
      @close="teamModalVisible = false"
      @add-user="addUser"
    />
  </div>
</template>

<script>
import { capitalize } from '@/functs/string'

import TeamDrawer from '@/components/people/ProjectTeamDrawer/TeamDrawer.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import TeamCardInline from '@/components/people/TeamCard/TeamCardInline.vue'
import useUsersStore from '@/stores/useUsers'
import { isGroup } from '@/functs/users'

export default {
  name: 'TeamSection',

  components: {
    TeamCardInline,
    TeamDrawer,
    IconImage,
  },

  props: {
    selectedCategory: {
      type: Object,
      default: () => {},
    },
    unfocusable: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update-team'],
  setup() {
    const usersStore = useUsersStore()
    return {
      usersStore,
      capitalize,
    }
  },

  data() {
    return {
      projectUsers: [],
      teamModalVisible: false,
    }
  },
  computed: {
    currentUser() {
      return this.usersStore.userFromApi
    },

    adaptedCurrentUser() {
      /* Only selecting what we need for the card */
      return {
        id: this.currentUser.id,
        family_name: this.currentUser.family_name,
        given_name: this.currentUser.given_name,
        job: this.currentUser.job,
        people_id: this.currentUser.people_id,
        profile_picture: this.currentUser.profile_picture,
      }
    },
  },

  watch: {
    currentUser: {
      handler: function (neo) {
        if (neo) {
          this.projectUsers.push({ user: this.adaptedCurrentUser, role: 'owners' })
          this.$emit('update-team', this.projectUsers)
        }
      },
      immediate: true,
    },
  },

  methods: {
    addUser(payload) {
      payload.forEach((user) => {
        // current user is automatically added as owner
        // so dont duplicate him
        if (isGroup(user) || user.id !== this.currentUser.id) {
          this.projectUsers.push({
            user: user,
            role: user.role,
          })
        }
      })

      this.$emit('update-team', this.projectUsers)
    },

    removeUser(user) {
      const userIndexToDelete = this.projectUsers.findIndex((projectUser) => {
        return projectUser.user.id === user.user.id
      })
      this.projectUsers.splice(userIndexToDelete, 1)
      this.$emit('update-team', this.projectUsers)
    },

    roleLabel(role) {
      if (role) {
        if (role === 'owners') return 'role.editor'
        else if (role === 'members') return 'role.teammate'
        else if (role === 'reviewers') return 'role.reviewer'
        else if (role === 'owner_groups') return 'role.editor-groups'
        else if (role === 'reviewer_groups') return 'role.reviewer-groups'
        else if (role === 'member_groups') return 'role.teammate-groups'
      }
      return null
    },
  },
}
</script>

<style lang="scss" scoped>
.team-section {
  label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    width: 100%;
    font-size: $font-size-m;
    margin-bottom: $space-l;

    .section-title {
      color: $black;
      font-weight: bold;
      display: block;
    }
  }

  .team-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-items: stretch;
    gap: $space-l;
  }

  .add-user-card {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background: $white;
    color: $primary-dark;
    cursor: pointer;
    font-weight: 700;
    font-size: $font-size-m;

    svg {
      width: 18px;
      fill: $primary-dark;
    }
  }

  .disabled {
    color: $almost-white;

    svg {
      width: 18px;
      fill: $almost-white;
    }
  }
}
</style>
