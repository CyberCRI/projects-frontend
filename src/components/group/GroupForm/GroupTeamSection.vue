<template>
  <div class="team-section">
    <label>
      <span class="section-title">
        {{ $t('team.group-members') }}
        <span v-if="model.length">({{ model.length }})</span>
      </span>
      <LpiButton
        v-if="!model.length"
        class="add-user-card"
        btn-icon="Plus"
        :label="$t('group.form.add')"
        data-test="add-members"
        @click="openDrawer('select')"
      />

      <template v-else>
        <LpiButton
          class="add-user-card"
          btn-icon="Pen"
          :label="$t('group.form.edit-members')"
          data-test="add-members"
          @click="openDrawer('select')"
        />
        <LpiButton
          class="add-user-card"
          btn-icon="Pen"
          :label="$t('role.edit')"
          data-test="edit-roles"
          @click="openDrawer('roles')"
        />
      </template>
    </label>

    <div class="team-grid">
      <TeamCardInline
        v-for="user in showFullList ? model : shortList"
        :key="user.id"
        icon="Close"
        :member="user"
        @click="onConfirmRemoveUser(user)"
      />
      <ConfirmModal
        v-if="stateModal"
        :title="$t('common.remove-user')"
        @cancel="closeModal"
        @confirm="onRemoveUser"
      >
        <TeamCardInline :member="removeUser" :icon="null" class="pointer-events-none" />
      </ConfirmModal>
    </div>
    <div class="show-more">
      <LinkButton
        v-if="shortList?.length < model?.length"
        class="see-more-btn"
        :label="$t(seeMoreLabel)"
        @click="showFullList = !showFullList"
      />
      <empty-label v-if="(showFullList ? model : shortList).length === 0" />
    </div>

    <GroupTeamDrawer
      v-if="teamModalVisible"
      :current-users="model"
      :is-opened="teamModalVisible"
      :mode="teamModalMode"
      @close="teamModalVisible = false"
      @add-user="addUsers"
      @set-mode="teamModalMode = $event"
    />
  </div>
</template>

<script setup lang="ts">
import type { GroupMember } from '~/models/group.model'
import type { GroupDataRole } from '~/models/types'
import useUsersStore from '~/stores/useUsers'

type TeamModel = {
  role: GroupDataRole
  user: {
    family_name: string
    given_name: string
    job: string
    people_id: number
  }
}

const model = defineModel<GroupMember[]>({ default: [] })

const emit = defineEmits<{
  'update-team': [TeamModel[]]
  'remove-user': []
}>()

const usersStore = useUsersStore()
const { stateModal, closeModal, openModal } = useModal()
const teamModalVisible = ref(false)
const teamModalMode = ref<'select' | 'roles'>('select')
const showFullList = ref(false)
const removeUser = ref(null)

const currentUser = computed(() => usersStore.userFromApi)

const shortList = computed(() => model.value.slice(0, 8))

const adaptedCurrentUser = computed<TeamModel['user']>(() => {
  /* Only selecting what we need for the card and also not selecting
   * the keycloak_id, so we don't add this user to the API call
   */
  return {
    family_name: currentUser.value.family_name,
    given_name: currentUser.value.given_name,
    job: currentUser.value.job,
    people_id: currentUser.value.people_id,
  }
})
const seeMoreLabel = computed(() => (showFullList.value ? 'common.see-less' : 'common.see-more'))

watch(
  adaptedCurrentUser,
  (neo) => {
    if (neo) {
      emit('update-team', [{ user: adaptedCurrentUser.value, role: 'owners' }])
    }
  },
  {
    immediate: true,
  }
)

const addUsers = (team) => {
  model.value = team
}

const onRemoveUser = () => {
  model.value = model.value.filter((member) => removeUser.value.id !== member.id)
  removeUser.value = null
  closeModal()
}
const openDrawer = (mode) => {
  teamModalMode.value = mode
  teamModalVisible.value = true
}

const onConfirmRemoveUser = (user) => {
  removeUser.value = user
  openModal()
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

  .disabled {
    color: $almost-white;

    svg {
      width: 18px;
      fill: $almost-white;
    }
  }

  .show-more {
    display: flex;
    justify-content: center;
    margin-top: $space-l;
  }
}
</style>
