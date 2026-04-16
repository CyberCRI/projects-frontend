<template>
  <div class="team-section">
    <label>
      <span class="section-title">
        {{ $t('team.project-members') }}
        <span v-if="projectUsers.length">({{ projectUsers.length }})</span>
      </span>
      <span
        class="add-user-card"
        :class="{ disabled: unfocusable }"
        :v-disable-focus="unfocusable"
        @click="teamModalVisible = true"
      >
        <IconImage name="Plus" />
        <span>{{ $t('team.add') }}</span>
      </span>
    </label>

    <div v-if="currentUser" class="team-grid">
      <TeamCardInline
        v-for="user in projectUsers"
        :key="user?.user.id"
        :role-label="roleLabel(user.role)"
        :member="user.user"
        @click="removeUser(user)"
      />
    </div>

    <TeamDrawer
      :current-users="projectUsers"
      :is-opened="teamModalVisible"
      :selected-categories="[selectedCategory]"
      @close="teamModalVisible = false"
      @add-user="addPayloadUsers"
    />
  </div>
</template>

<script setup lang="ts">
import TeamDrawer from '@/components/people/ProjectTeamDrawer/TeamDrawer.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import TeamCardInline from '@/components/people/TeamCard/TeamCardInline.vue'
import useUsersStore from '@/stores/useUsers'
import { TEAMS_ROLE_I18N } from '@/interfaces/user'
import { ProjectCategoryModel } from '@/models/project-category.model'
import { ProjectMemberRoleType } from '@/models/types'
import { GroupMember } from '@/models/group.model'

withDefaults(
  defineProps<{
    selectedCategory?: ProjectCategoryModel
    unfocusable?: boolean
  }>(),
  {
    selectedCategory: null,
    unfocusable: false,
  }
)

const { t } = useNuxtI18n()

type ProjectMembers = { user: GroupMember; role: ProjectMemberRoleType }[]

const emit = defineEmits<{
  'update-team': [ProjectMembers]
}>()

const usersStore = useUsersStore()
const projectUsers = ref<ProjectMembers>([])
const teamModalVisible = ref(false)

const currentUser = computed(() => {
  return usersStore.userFromApi
})

const adaptedCurrentUser = computed(() => {
  /* Only selecting what we need for the card */
  return {
    id: currentUser.value.id,
    family_name: currentUser.value.family_name,
    given_name: currentUser.value.given_name,
    job: currentUser.value.job,
    people_id: currentUser.value.people_id,
    profile_picture: currentUser.value.profile_picture,
    role: 'owners',
  }
})

watch(
  adaptedCurrentUser,
  (neo) => {
    if (neo) {
      // current user is automatically added as owner
      addUser(adaptedCurrentUser.value)
    }
  },
  { immediate: true }
)

const addUser = (newUser) => {
  // don't duplicate users
  if (projectUsers.value.find(({ user }) => user.id === newUser.id)) {
    return
  }
  projectUsers.value.push({
    user: newUser,
    role: newUser.role,
  })
  emit('update-team', projectUsers.value)
}
const addPayloadUsers = (payload) => {
  payload.forEach((user) => addUser(user))
}

const removeUser = (user) => {
  const userIndexToDelete = projectUsers.value.findIndex((projectUser) => {
    return projectUser.user.id === user.user.id
  })
  projectUsers.value.splice(userIndexToDelete, 1)
  emit('update-team', projectUsers.value)
}
const roleLabel = (role) => {
  const key = TEAMS_ROLE_I18N[role]
  return role ? t(key) : null
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
