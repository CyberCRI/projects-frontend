<template>
  <div>
    {{ subtitle }}
  </div>
  <section class="search-section">
    <SearchInput
      ref="search-input"
      v-model="queryString"
      :full="true"
      :placeholder="$filters.capitalize($t('search.search-group'))"
      class="input"
      @enter="launchSearch"
      @delete-query="deleteQuery"
    />
  </section>
  <div class="group-list custom-scrollbar">
    <ul>
      <GroupsElementRadio
        v-for="group in rooted ? rootedGroups : groups"
        :key="group.id"
        v-model="childGroup"
        :group="group"
        :parents="rooted ? [undefined, ...parents] : parents"
        :list-groups-ids="listGroupsIds"
        :initial-group="initialGroup"
        :forbidden-ids="forbiddenIds"
        @set-group="setGroup"
      />
    </ul>
  </div>
</template>
<script>
import GroupsElementRadio from '@/components/group/GroupsElement/GroupsElementRadio.vue'
import SearchInput from '@/components/base/form/SearchInput.vue'
import { searchGroupsAlgolia } from '@/api/search.service.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'PickGroup',
  components: {
    GroupsElementRadio,
    SearchInput,
  },
  props: {
    subtitle: {
      type: String,
      default: null,
    },
    groups: {
      type: Array,
      default: () => [],
    },

    initialGroup: {
      type: Object,
      required: false,
      default: () => null,
    },
    forbiddenIds: {
      type: Array,
      required: false,
      default: () => [],
    },
    rooted: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['select-group'],
  setup() {
    const organizationsStore = useOrganizationsStore()
    return {
      organizationsStore,
    }
  },
  data() {
    return {
      childGroup: null,
      listGroups: [],
      queryString: '',
      isLoading: false,
      parents: [], // array of pre-opened groups ids
      listGroupsIds: [], // array of groups ids that are searched (highlighted)
      adaptedGroups: [],
    }
  },

  computed: {
    rootedGroups() {
      return [
        {
          id: undefined, // id must be null to match null initialGroup, see in GroupsElementRadio.vue ":checked" line 13
          name: this.$t('group.root'),
          children: this.groups,
        },
      ]
    },
  },

  watch: {
    listGroups: {
      handler: function (neo) {
        this.listGroupsIds = neo.map((group) => group.id)

        for (const id of this.listGroupsIds) {
          let found = false
          let parents = []
          let ret = this.searchParents(id, this.groups, parents, found)
          parents = ret[0]
          if (this.parents.length > 0) {
            this.parents = [...new Set(this.parents.concat(parents))]
          } else {
            this.parents = parents
          }
        }
      },
      immediate: true,
      deep: true,
    },

    initialGroup: {
      handler: function (neo) {
        if (neo) {
          let found = false
          let parents = []
          let ret = this.searchParents(neo.id, this.groups, parents, found)
          parents = ret[0]
          if (this.parents.length > 0) {
            this.parents = [...new Set(this.parents.concat(parents))]
          } else {
            this.parents = parents
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    setGroup(group) {
      // if group id is undefined it is in fact the (null) root group
      this.$emit('select-group', group.id ? group : null)
    },
    async launchSearch() {
      if (this.queryString) {
        this.isLoading = true

        const filters = {
          limit: 12,
          organizations: this.organizationsStore.current.code,
        }
        let listGroups = (await searchGroupsAlgolia(encodeURIComponent(this.queryString), filters))
          .results

        this.listGroups = listGroups ? listGroups.map((result) => result.people_group) : []
        this.isLoading = false
      }
    },
    deleteQuery() {
      this.queryString = ''
      this.listGroups = []
      this.listGroupsIds = []
      this.parents = []
    },
    searchParents(id, groups, parents, found) {
      for (const group of groups) {
        if (group.id == id) {
          found = true
          return [parents, found]
        } else if (group.children && group.children.length > 0) {
          parents.push(group.id)
          let ret = this.searchParents(id, group.children, parents, found)
          parents = ret[0]
          found = ret[1]
          if (found) {
            return [parents, found]
          }
        }
      }
      parents.pop()
      return [parents, found]
    },
  },
}
</script>
<style lang="scss" scoped>
.search-section {
  margin-block: 1rem;
  flex-shrink: 0;
}

.group-list {
  overflow: auto;
}
</style>
