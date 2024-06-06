<template>
    <GroupPageInner :key="groupId" :group-id="groupId" />
</template>

<script>
import GroupPageInner from './GroupPageInner.vue'

export default {
    name: 'GroupPage',
    components: {
        GroupPageInner,
    },
    props: {
        groupId: {
            type: String,
            required: true,
        },
    },
}
</script>
