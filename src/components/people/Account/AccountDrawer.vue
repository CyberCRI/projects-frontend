<template>
  <BaseDrawer :is-opened="isOpened" title="" class="full" no-footer @close="$emit('close')">
    <ExistingAccountChecker
      v-if="isAddMode && !targetUser"
      @check-done="onCheckDone"
      @cancel="$emit('close')"
    />
    <AccountLayout
      v-else
      ref="account"
      :is-add-mode="isAddMode"
      :is-invite-mode="isInviteMode"
      :selected-user="targetUser || selectedUser"
      @close="$emit('close')"
    />
  </BaseDrawer>
</template>
<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import AccountLayout from '@/components/people/Account/AccountLayout.vue'
import ExistingAccountChecker from '@/components/people/Account/ExistingAccountChecker.vue'

import useToasterStore from '@/stores/useToaster.ts'
export default {
  name: 'AccountDrawer',

  components: { AccountLayout, BaseDrawer, ExistingAccountChecker },

  props: {
    isOpened: {
      type: Boolean,
      required: true,
    },

    selectedUser: {
      type: Object,
      default: null,
    },
  },

  emits: ['close'],
  setup() {
    const toaster = useToasterStore()
    return {
      toaster,
    }
  },

  data() {
    return {
      targetUser: null,
    }
  },

  computed: {
    isAddMode() {
      return !this.selectedUser && !this.targetUser?.id
    },

    isInviteMode() {
      const user = this.targetUser || this.selectedUser
      return !this.isAddMode && !user?.current_org_role // null if not in current org
    },
  },

  methods: {
    onCheckDone(targetUser) {
      this.targetUser = targetUser
      this.$nextTick(() => {
        if (!this.isAddMode) {
          this.toaster.pushWarning(
            this.isInviteMode
              ? this.$t('account.switch-to-invite')
              : this.$t('account.switch-to-edit')
          )
        }
      })
    },
  },
}
</script>
