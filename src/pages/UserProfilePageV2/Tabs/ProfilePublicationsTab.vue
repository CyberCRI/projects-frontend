<template>
  <div class="profile-publications">
    <div>
      <h4 class="title">
        {{ title }}
        <span>({{ publications.length }})</span>
      </h4>
    </div>
  </div>
</template>

<script>
import useUsersStore from '@/stores/useUsers.ts'

export default {
  name: 'ProfilePublicationsTab',

  props: {
    user: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const usersStore = useUsersStore()
    const { canEditUser } = usePermissions()
    return {
      usersStore,
      canEditUser,
    }
  },

  computed: {
    isCurrentUser() {
      return this.usersStore.id === this.user.id
    },

    publications() {
      return []
    },

    title() {
      return this.isCurrentUser ? this.$t('me.publications') : this.$t('you.publications')
    },
  },
}
</script>

<style lang="scss" scoped></style>
