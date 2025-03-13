<template>
  <section>
    <div v-if="selectedUsers.length" class="selected-users-grid">
      <UserCardInline
        v-for="(user, index) in filteredUsers"
        :key="user.id"
        :user="user"
        :selected="true"
        icon="Close"
        @user-clicked="removeUser(user, index)"
      />
    </div>

    <LinkButton
      v-if="selectedUsers.length > 5"
      class="see-more-btn"
      :label="$filters.capitalize($t(seeMoreLabel))"
      @click="isSeeMore = !isSeeMore"
    />

    <SearchInput
      ref="search-input-ctn"
      v-model="queryString"
      :placeholder="$filters.capitalize($t('search.search'))"
      full
      @enter="searchUser"
      @delete-query="deleteQuery"
    />

    <div v-if="queryString.length >= 3" class="user-ctn">
      <div v-if="isLoading" class="loader-wrapper">
        <LoaderSimple />
      </div>

      <TabsLayout
        v-else-if="userRequest.count || groupRequest.count"
        :align-left="true"
        :border="false"
        class="results-tabs"
        :tabs="tabs"
      />

      <p v-else>
        {{ $t('team.no-user-message') }}
      </p>
    </div>
  </section>
</template>

<script>
import debounce from 'lodash.debounce'
import SearchInput from '@/components/base/form/SearchInput.vue'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import { searchGroupsAlgolia } from '@/api/search.service.ts'
import LinkButton from '@/components/base/button/LinkButton.vue'

import TabsLayout from '@/components/base/navigation/TabsLayout.vue'
import TeamResultList from '@/components/people/ProjectTeamDrawer/TeamResultList.vue'
import UserCardInline from '@/components/people/TeamCard/UserCardInline.vue'
import { searchPeopleProject } from '@/api/people.service'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'UserSelection',

  components: {
    LinkButton,
    SearchInput,
    LoaderSimple,
    TabsLayout,
    UserCardInline,
  },

  provide() {
    return {
      userSelectionSelectUser: this.selectUser,
    }
  },

  props: {
    currentUsers: {
      type: Array,
      default: () => [],
    },
  },

  emits: ['select-user'],
  setup() {
    const organizationsStore = useOrganizationsStore()
    return {
      organizationsStore,
    }
  },

  data() {
    return {
      isLoading: true,
      queryString: '',
      selectedUsers: [],
      isSeeMore: true,
      userRequest: {},
      groupRequest: {},
      hasToSelectGroups: true,
      hasToSelectPeople: true,
    }
  },

  computed: {
    tabs() {
      return [
        {
          key: 'member-results',
          label:
            this.userRequest.count +
            ' ' +
            (this.userRequest.count > 1
              ? this.$t('result_box.people')
              : this.$t('result_box.person')),
          component: TeamResultList,
          props: {
            initialRequest: this.userRequest,
            currentUsers: this.currentUsers,
            selectedUsers: this.selectedUsers,
            type: 'users',
          },
        },
        {
          key: 'group-results',
          label:
            this.groupRequest.count +
            ' ' +
            (this.groupRequest.count > 1
              ? this.$t('result_box.groups')
              : this.$t('result_box.group')),
          component: TeamResultList,
          props: {
            initialRequest: this.groupRequest,
            currentUsers: this.currentUsers,
            selectedUsers: this.selectedUsers,
            type: 'groups',
          },
        },
      ]
    },

    filteredUsers() {
      return this.isSeeMore ? this.selectedUsers.slice(0, 5) : this.selectedUsers
    },

    seeMoreLabel() {
      return this.isSeeMore ? 'common.see-more' : 'common.see-less'
    },
  },

  watch: {
    queryString: function (val) {
      if (val.length >= 3) this.searchUser()
      if (this.queryString === '') this.results = []
    },
  },

  mounted() {
    this.$refs['search-input-ctn'].$refs['search-input'].focus()
  },

  methods: {
    searchUser: debounce(async function () {
      this.isLoading = true

      const userFilters = {
        limit: 30,
        organizations: [this.organizationsStore.current.code], // return only users from current org
      }
      this.userRequest = await searchPeopleProject({
        search: this.queryString,
        org_id: this.organizationsStore.current.id,
        params: userFilters,
      })

      const groupFilters = {
        limit: 30,
        organizations: this.organizationsStore.current.code,
      }
      this.groupRequest = await searchGroupsAlgolia(
        encodeURIComponent(this.queryString),
        groupFilters
      )

      this.isLoading = false
    }, 500),

    selectUser(user) {
      this.selectedUsers.push(user)
      if (this.$filters.isNotGroup(user)) {
        user.role = 'owners'
      }

      this.$emit('select-user', this.selectedUsers)
    },

    removeUser(user, index) {
      user.selected = false
      this.selectedUsers.splice(index, 1)
      this.$emit('select-user', this.selectedUsers)
    },

    deleteQuery() {
      this.queryString = ''
      this.results = []
    },
  },
}
</script>

<style lang="scss" scoped>
section,
.user-ctn {
  flex-grow: 1;
  display: flex;
  flex-flow: column nowrap;
}

.hide-card {
  display: none;
}

.selected-users-grid {
  display: flex;
  flex-wrap: wrap;
  overflow-y: hidden;
  gap: $space-m;
  width: 100%;
  align-content: flex-start;
  justify-self: flex-start;
  padding-bottom: $space-m;
}

.user-ctn {
  padding: $space-m;
  border-radius: $border-radius-m;
  min-height: pxToRem(300px);
  margin-top: $space-l;

  .result-boxes {
    display: flex;
    flex-direction: row;
  }
}

.loader-wrapper {
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
}

.user-ctn,
.results-tabs,
:deep(.results-tabs .content) {
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
}
</style>

<style scoped lang="scss">
.see-more-btn {
  margin-bottom: 12px;
}
</style>
