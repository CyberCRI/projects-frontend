<template>
  <div v-if="isLoading" class="loader">
    <LoaderSimple />
  </div>
  <template v-else>
    <AccountSection
      ref="groups"
      :section-title="$t('account.form.groups')"
      :section-notice="$t('account.form.groups-description')"
    >
      <div class="current-groups-ctn">
        <template v-for="(role, groupId) in modelValue">
          <FilterValue
            v-if="role && peopleGroupsIndex[groupId]"
            :key="groupId"
            :label="peopleGroupsIndex[groupId].name"
            class="actionable"
            icon="Close"
            @click="addRemovePeopleGroup(groupId)"
          />
        </template>
        <span v-if="noGroupSelected" class="no-group-selected">
          {{ $t('account.form.no-group-selected') }}
        </span>
      </div>

      <div class="groups-tree custom-scrollbar">
        <ul>
          <GroupHierarchyList
            v-for="peopleGroup in peopleGroupsTree"
            :key="peopleGroup.id"
            :parent="peopleGroup"
            :selected-groups="modelValue"
            @add-group="addRemovePeopleGroup"
          >
            <LpiCheckbox
              :class="{
                'list-label--has-children': peopleGroup.children.length > 0,
              }"
              :label="peopleGroup.name"
              :model-value="!!modelValue['#' + peopleGroup.id]"
              @update:model-value="addRemovePeopleGroup(peopleGroup.id)"
            />
          </GroupHierarchyList>
        </ul>
      </div>
    </AccountSection>

    <AccountSection
      v-if="!noGroupSelected"
      :section-title="$t('account.form.groups-roles')"
      :section-notice="$t('account.form.groups-roles-description')"
    >
      <div class="group-rights">
        <template v-for="(role, groupId) in modelValue">
          <div v-if="role && peopleGroupsIndex[groupId]" :key="groupId" class="group-item">
            <p class="group-name">
              {{ peopleGroupsIndex[groupId].name }}
            </p>
            <div class="check-box-items">
              <template v-for="roleOption in roleOptions" :key="roleOption.value">
                <div class="item">
                  <LpiCheckbox
                    :label="roleOption.label"
                    :model-value="modelValue[groupId] === roleOption.value"
                    @update:model-value="setRole(groupId, roleOption.value)"
                  />
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </AccountSection>
  </template>
</template>
<script>
import { capitalize } from '@/functs/string'

import GroupHierarchyList from '@/components/people/Account/GroupHierarchyList.vue'
import FilterValue from '@/components/search/Filters/FilterValue.vue'
import LpiCheckbox from '@/components/base/form/LpiCheckbox.vue'
import { getPeopleGroupsHierarchy } from '@/api/groups.service'
import LoaderSimple from '@/components/base/loader/LoaderSimple.vue'
import AccountSection from '@/components/people/Account/AccountSection.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'AccountGroupsForm',

  components: { GroupHierarchyList, FilterValue, LpiCheckbox, LoaderSimple, AccountSection },
  props: {
    modelValue: {
      // can contain also groups from other orgs
      type: Object, // map {[groupid]: 'members'|'leaders'|'managers'|false}
      required: true,
    },
  },

  emits: ['update:modelValue'],
  setup() {
    const organizationsStore = useOrganizationsStore()
    return {
      organizationsStore,
    }
  },

  data() {
    return {
      peopleGroupsTree: [],
      peopleGroupsIndex: {},
      isLoading: false,
    }
  },

  computed: {
    noGroupSelected() {
      return (
        // we can have "falsy" role and group from other orgs that should not be taken in account
        Object.entries(this.modelValue).filter(
          ([groupId, role]) => role && this.peopleGroupsIndex[groupId]
        ).length === 0
      )
    },

    roleOptions() {
      return [
        {
          value: 'leaders',
          label: capitalize(this.$t('group.role.leaders.label')),
          dataTest: 'button-role-leader',
          tip: this.$t('group.role.leaders.help'),
        },
        {
          value: 'managers',
          label: capitalize(this.$t('group.role.managers.label')),
          dataTest: 'button-role-editor',
          tip: this.$t('group.role.managers.help'),
        },
        // keeping for future use
        // {
        //     value: 'members',
        //     label: capitalize(this.$t('group.role.members.label')),
        //     tip: this.$t('group.role.members.help'),
        //     dataTest: 'button-role-members',
        // },
      ]
    },
  },

  async mounted() {
    await this.setSelectedHierarchyGroups()
  },

  methods: {
    async setSelectedHierarchyGroups() {
      // We get the current org group hierarchy and we selected the groups already added to the user.
      this.isLoading = true
      try {
        await getPeopleGroupsHierarchy(this.organizationsStore.current.code, {
          organizations: this.organizationsStore.current.code,
        }).then((peopleGroupsHierarchy) => {
          this.peopleGroupsTree = this.setGroupHierarchy(peopleGroupsHierarchy.children)
        })
      } finally {
        this.isLoading = false
      }
    },

    setGroupHierarchy(children) {
      // this is a recursive call, as the groups have children, that have children, ...
      if (children && children.length > 0) {
        children.forEach((child) => {
          this.peopleGroupsIndex['#' + child.id] = child
        })
        return children.map((child) => ({
          ...child,
          children: this.setGroupHierarchy(child.children),
        }))
      }

      return []
    },

    addRemovePeopleGroup(groupId) {
      const prefixedGroupId =
        typeof groupId == 'string' && groupId[0] == '#' ? groupId : '#' + groupId

      if (this.modelValue[prefixedGroupId])
        this.$emit('update:modelValue', { ...this.modelValue, [prefixedGroupId]: false })
      else
        this.$emit('update:modelValue', {
          ...this.modelValue,
          [prefixedGroupId]: 'members',
        })
    },

    setRole(groupId, role) {
      const prefixedGroupId =
        typeof groupId == 'string' && groupId[0] == '#' ? groupId : '#' + groupId
      if (this.modelValue[prefixedGroupId] === role)
        this.$emit('update:modelValue', {
          ...this.modelValue,
          [prefixedGroupId]: 'members',
        })
      else this.$emit('update:modelValue', { ...this.modelValue, [prefixedGroupId]: role })
    },
  },
}
</script>
<style lang="scss" scoped>
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: $space-2xl 0;
}

.current-groups-ctn {
  display: flex;
  flex-wrap: wrap;
  gap: $space-s;
  margin-bottom: $space-l;
}

.title {
  font-weight: 700;
  font-size: $font-size-l;
  color: $black;
  line-height: $line-height-tight;
}

.sub-section {
  padding-top: $space-xl;

  .title {
    font-weight: 700;
    font-size: $font-size-l;
    color: $black;
  }

  .sub-title {
    margin: pxToRem(16px) 0;
  }
}

.list-label {
  font-size: $font-size-s;

  &--has-children {
    font-weight: 700;
    color: $primary-dark;
  }
}

.label {
  font-weight: 500;
  font-size: $font-size-m;
  padding-bottom: $space-m;
}

.current-groups-ctn {
  display: flex;
  flex-wrap: wrap;
  gap: $space-s;
  margin-bottom: $space-l;
}

.group-rights {
  .group-item {
    display: inline-flex;
    width: 100%;
    justify-content: space-between;
    padding: 1rem 0;
  }

  .group-item + .group-item {
    border-top: $border-width-s solid $lighter-gray;
  }

  .group-name {
    flex: 33%;
  }

  .check-box-items {
    display: inline-flex;
    width: 100%;
    flex: 66%;
    justify-content: space-around;

    .item {
      color: $primary-dark;
      font-weight: bold;
      display: inline-flex;
      align-items: center;
    }
  }
}

.no-group-selected {
  background-color: $almost-white;
  color: $mid-gray;
  border: $border-width-s solid $mid-gray;
  border-radius: $border-radius-30;
  padding: $space-s $space-m;
  text-transform: uppercase;
}

.groups-tree {
  max-height: 22rem;
  overflow-y: auto;
}
</style>
