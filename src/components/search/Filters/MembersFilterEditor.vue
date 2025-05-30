<template>
  <div>
    <div class="filter-members-selected">
      <FilterValue
        v-for="(member, index) in selection"
        :key="member.id"
        :label="member.given_name + ' ' + member.family_name"
        icon="Close"
        class="actionable"
        @click="removeFilter(index)"
      />
    </div>

    <div class="filter-members-search">
      <FilterSearchInput
        ref="search-input-component"
        v-model="memberSearch"
        :placeholder="$t('search.search-user')"
        class="search-input-ctn"
      />
    </div>

    <div class="filter-members-suggestions">
      <FilterValue
        v-for="user in usersList"
        :key="user.id"
        :label="user.given_name + ' ' + user.family_name"
        class="actionable suggested"
        @click="addMember(user)"
      />
    </div>
  </div>
</template>

<script>
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import FilterSearchInput from '@/components/search/Filters/FilterSearchInput.vue'
import { searchPeopleProject } from '@/api/people.service'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'MembersFilterEditor',

  components: {
    FilterSearchInput,
    FilterValue,
  },
  props: {
    modelValue: {
      type: Array,
      required: true,
    },
  },

  emits: ['update:model-value'],
  setup() {
    const organizationsStore = useOrganizationsStore()
    return {
      organizationsStore,
    }
  },

  data() {
    return {
      selection: [],
      memberSearch: '',
      usersList: [],
    }
  },

  watch: {
    modelValue: {
      handler: function (neo, old) {
        if (neo && neo != old) {
          this.selection = [...neo]
        }
      },
      immediate: true,
      deep: true,
    },

    memberSearch(neo, old) {
      if (neo && neo != old) {
        if (neo.length < 3) {
          this.usersList = []
        } else {
          this.getPeople(neo)
        }
      }
    },
  },
  mounted() {
    this.focusInput()
  },
  methods: {
    removeFilter(index) {
      this.selection.splice(index, 1)
      this.$emit('update:model-value', this.selection)
    },

    addMember(member) {
      this.selection.push(member)
      this.$emit('update:model-value', this.selection)
      this.focusInput()
    },

    async getPeople(searchString) {
      const results = await searchPeopleProject({
        search: searchString,
        org_id: this.organizationsStore.current.id,
      })
      const filteredResults = results.filter(
        (result) => !this.selection.some((member) => member.id == result.id)
      )
      this.usersList = filteredResults
    },
    focusInput() {
      const searchInput = this.$refs['search-input-component'].$refs['search-input']
      this.$nextTick(() => {
        searchInput.focus()
      })
    },
  },
}
</script>

<style scoped lang="scss">
.filter-members-selected,
.filter-members-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2xs;
}

.filter-members-selected {
  margin-bottom: $space-m;
}

.filter-members-suggestions {
  margin-top: $space-m;
}
</style>
