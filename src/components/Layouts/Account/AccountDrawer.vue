<template>
    <DrawerLayout
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
    </DrawerLayout>
</template>
<script>
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import AccountLayout from '@/components/Layouts/Account/AccountLayout.vue'

export default {
    name: 'AccountDrawer',

    emits: ['close'],

    components: { AccountLayout, DrawerLayout },

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
