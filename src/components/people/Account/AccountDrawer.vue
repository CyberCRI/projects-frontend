<template>
    <BaseDrawer
        :is-opened="isOpened"
        title=""
        @close="$emit('close')"
        class="full"
        :has-footer="false"
    >
        <AccountLayout
            ref="account"
            :is-add-mode="isAddMode"
            :selected-user="selectedUser"
            @close="$emit('close')"
        ></AccountLayout>
    </BaseDrawer>
</template>
<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import AccountLayout from '@/components/people/Account/AccountLayout.vue'

export default {
    name: 'AccountDrawer',

    emits: ['close'],

    components: { AccountLayout, BaseDrawer },

    props: {
        isOpened: {
            type: Boolean,
            required: true,
        },

        isAddMode: {
            type: Boolean,
            default: true,
        },

        selectedUser: {
            type: Object,
            default: null,
        },
    },
}
</script>
