<template>
  <section class="role-section">
    <LpiButton
      v-if="!isEditMode"
      :border="false"
      :label="$t('common.back')"
      :secondary="true"
      class="back-btn"
      btn-icon="ArrowLeft"
      @click="$emit('back-to-user-selection')"
    />
    <div class="tooltip-ctn">
      {{ $t('role.select') }}

      <ToolTip arrow class="color-tip" :hover="true" :interactive="false">
        <button type="button" class="question-mark tooltip">
          <IconImage name="HelpCircle" />
        </button>
        <template #custom-content>
          <div class="tooltip-div">
            <ul class="list-ctn">
              <!-- TODO only on certain portal -->
              <li class="item">
                <span class="item-bold">{{ $t('role.editor') }}:</span>
                {{ $t('role.role-editor') }}
              </li>
              <li v-if="isReviewable" class="item">
                <span class="item-bold">{{ $t('role.reviewer') }}:</span>
                {{ $t('role.role-reviewer') }}
              </li>
              <li class="item">
                <span class="item-bold">{{ $t('role.teammate') }}:</span>
                {{ $t('role.role-teammate') }}
              </li>
            </ul>
          </div>
        </template>
      </ToolTip>
    </div>
    <!-- users -->
    <div v-if="userList?.length" class="role-option-list">
      <h4>
        {{ userList?.length > 1 ? $t('result_box.people') : $t('result_box.person') }}
      </h4>
      <div v-for="user in userList" :key="user.id" class="role-options-item">
        <div>{{ user.given_name }} {{ user.family_name }}</div>
        <div class="role-block">
          <div v-for="roleOption in userRoleOptions" :key="roleOption.value" class="role-item">
            <div v-if="roleOption.condition" class="radio-block">
              <label class="form-control">
                <input
                  v-model="user.role"
                  :value="roleOption.value"
                  :data-test="roleOption.dataTest"
                  type="radio"
                  @change="selectUserRole(user, roleOption.value)"
                />
                {{ roleOption.label }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- groups -->
    <div v-if="groupList?.length" class="role-option-list">
      <h4>
        {{ groupList?.length > 1 ? $t('result_box.groups') : $t('result_box.group') }}
      </h4>
      <div v-for="group in groupList" :key="group.id" class="role-options-item">
        <div>{{ group.name }}</div>
        <div class="role-block">
          <div v-for="roleOption in groupRoleOptions" :key="roleOption.value" class="role-item">
            <div v-if="roleOption.condition" class="radio-block">
              <label class="form-control">
                <input
                  v-model="group.role"
                  :value="roleOption.value"
                  :data-test="roleOption.dataTest"
                  type="radio"
                  @change="selectGroupRole(group, roleOption.value)"
                />
                {{ roleOption.label }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { isNotGroup, isGroup } from '@/functs/users'

import LpiButton from '@/components/base/button/LpiButton.vue'
import IconImage from '@/components/base/media/IconImage.vue'
import ToolTip from '@/components/base/ToolTip.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export default {
  name: 'RoleSelection',

  components: { LpiButton, IconImage, ToolTip },

  props: {
    selectedCategories: {
      type: Object,
      default: () => {},
    },

    selectedUsers: {
      type: Object,
      default: () => {},
    },

    selectedUserRole: {
      type: String,
      default: null,
    },

    selectedGroupRole: {
      type: String,
      default: null,
    },

    isEditMode: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['select-role', 'back-to-user-selection'],
  setup() {
    const organizationsStore = useOrganizationsStore()
    return {
      organizationsStore,
    }
  },

  data() {
    return {
      // userRole: 'owners',
      // groupRole: 'member_groups',
      userList: [],
      groupList: [],
    }
  },

  computed: {
    isReviewable() {
      // if it is a project edition, use current  project categories, else (project creation) use  selected category
      const categories = this.selectedCategories || []
      // keep only categroies from current organization
      let orgCategories = categories.filter(
        (cat) => !!cat && this.organizationsStore.current.code === cat.organization
      )

      // reviewable by default (ie if there is no category)
      if (orgCategories.length === 0) {
        return true
      } else {
        return orgCategories.some((category) => category.is_reviewable)
      }
    },
    userRoleOptions() {
      return [
        {
          value: 'owners',
          label: this.$t('role.editor'),
          condition: true,
          dataTest: 'button-role-editor',
          tip: this.$t('role.role-editor'),
        },
        {
          value: 'reviewers',
          label: this.$t('role.reviewer'),
          condition: this.isReviewable,
          dataTest: 'button-role-reviewer',
          tip: this.$t('role.role-reviewer'),
        },
        {
          value: 'members',
          label: this.$t('role.teammate'),
          condition: true,
          dataTest: 'button-role-teammate',
          tip: this.$t('role.role-teammate'),
        },
      ].filter((option) => option.condition)
    },

    groupRoleOptions() {
      return [
        {
          value: 'owner_groups',
          label: this.$t('role.editor'),
          condition: true,
          dataTest: 'button-group-role-editor',
          tip: this.$t('role.role-editor'),
        },
        {
          value: 'reviewer_groups',
          label: this.$t('role.reviewer'),
          condition: this.isReviewable,
          dataTest: 'button-group-role-reviewer',
          tip: this.$t('role.role-reviewer'),
        },
        {
          value: 'member_groups',
          label: this.$t('role.teammate'),
          condition: true,
          dataTest: 'button-group-role-teammate',
          tip: this.$t('role.role-teammate'),
        },
      ].filter((option) => option.condition)
    },
  },

  mounted() {
    // if (this.selectedUserRole && this.isEditMode) this.userRole = this.selectedUerRole
    // if (this.selectedGroupRole && this.isEditMode) this.groupRole = this.selectedGroupRole

    this.userList = this.selectedUsers.filter(isNotGroup).map((user) => ({
      ...user,
      role: this.selectedUserRole || 'owners',
    }))
    this.groupList = this.selectedUsers.filter(isGroup).map((user) => ({
      ...user,
      role: this.selectedGroupRole || 'member_groups',
    }))
    /* This is call is here to set up and update the user status on all parents */
    /* Also this used to be a watcher */
    this.$emit('select-role', this.userList.concat(this.groupList))
  },

  methods: {
    selectUserRole(user, role) {
      const index = this.userList.findIndex((usr) => usr.id === user.id)

      this.userList[index].role = role
      this.$emit('select-role', this.userList.concat(this.groupList))
    },
    selectGroupRole(group, role) {
      const index = this.groupList.findIndex((grp) => grp.id === group.id)

      this.groupList[index].role = role
      this.$emit('select-role', this.userList.concat(this.groupList))
    },
  },
}
</script>

<style lang="scss" scoped>
.role-section {
  display: flex;
  flex-direction: column;
  align-items: center;

  .tooltip-ctn {
    padding: 24px 0;
  }

  .back-btn {
    align-self: flex-end;
  }

  label {
    font-size: $font-size-m;
    display: flex;
    align-items: center;
    flex-grow: 1;
  }
}

.color-tip {
  color: $black !important;
}

.tooltip-div {
  max-width: 20rem;
  white-space: break-spaces;
  padding: $space-m;
  text-align: center;
  color: $black;

  .list-ctn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .item {
      text-align: start;
      padding: $space-2xs 0;

      &-bold {
        font-weight: 700;
      }
    }
  }
}

.question-mark {
  display: inline-block;
  position: relative;
  width: $layout-size-m;
  height: $layout-size-m;
  background-color: transparent;
  border: 0 none;
  vertical-align: text-top;
  margin-left: $space-m;

  svg {
    width: $layout-size-m;
    fill: $primary-dark;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.role-option-list {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .role-options-item {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: $space-l $space-m;
    border-top: $border-width-s solid $lighter-gray;
  }

  .role-block {
    display: inline-flex;

    .role-item {
      margin-right: $space-l;
    }
  }
}

.form-control {
  font-size: $font-size-m;
  color: $primary-dark;
  line-height: $line-height-squashed;
  display: grid;
  grid-template-columns: 1em auto;
  gap: $space-m;
  font-weight: bold;
}

.form-control + .form-control {
  margin-top: 1em;
}

input[type='radio'] {
  appearance: none;
  background-color: $white;
  margin: 0;
  font: inherit;
  width: pxToRem(20px);
  height: pxToRem(20px);
  border: $border-width-s solid $primary-dark;
  border-radius: 50%;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
  cursor: pointer;
}

input[type='radio']::before {
  content: '';
  width: pxToRem(12px);
  height: pxToRem(12px);
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em $primary-dark;
  border-radius: 50%;
}

input[type='radio']:checked::before {
  transform: scale(1);
}

input[type='radio']:disabled {
  border: $border-width-s solid $mid-gray;
  color: $mid-gray;
  cursor: not-allowed;
}

.form-control--disabled {
  color: $mid-gray;
  cursor: not-allowed;
}

.checkbox-item {
  border: 1px solid $primary-dark;
  padding: $space-m;
  margin: $space-s pxToRem(16px) $space-s 0;
  border-radius: $border-radius-xs;
  display: flex;
  align-items: center;
  text-align: right;

  > label {
    font-weight: 700;
    font-size: $font-size-m;
    line-height: $line-height-compact;
    color: $primary-dark;
    margin: 0;
    cursor: pointer;
    margin-left: $space-s;
  }
}
</style>
