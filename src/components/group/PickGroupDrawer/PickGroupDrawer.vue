<template>
    <BaseDrawer
        :title="drawerTitle"
        :footer="true"
        :is-opened="isOpened"
        class="small"
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="!rooted && selectedGroup === null"
        @close="$emit('close')"
        @confirm="$emit('confirm', selectedGroup)"
    >
        <PickGroup
            :subtitle="subtitle"
            :groups="groups"
            :initial-group="initialGroup"
            @select-group="selectGroup"
            :forbidden-ids="forbiddenIds"
            :rooted="rooted"
        >
        </PickGroup>
    </BaseDrawer>
</template>
<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import PickGroup from '@/pages/AdminPortalPage/Tabs/PickGroup.vue'

export default {
    name: 'PickGroupDrawer',
    emits: ['close', 'confirm'],
    components: {
        BaseDrawer,
        PickGroup,
    },
    props: {
        drawerTitle: {
            // title of the drawer
            type: String,
            default: '',
        },
        subtitle: {
            // text before the serach input
            type: String,
            default: '',
        },
        groups: {
            // groups hierarchy
            type: Array,
            default: () => [],
        },
        initialGroup: {
            // initially selected group
            type: Object,
            default: null,
        },
        isOpened: {
            // drawer visibility
            type: Boolean,
            default: false,
        },
        forbiddenIds: {
            // array of unselectable group ids
            type: Array,
            default: () => [],
        },
        rooted: {
            // allow to show and pick a (null) root group
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            selectedGroup: null,
        }
    },

    watch: {
        isOpened: {
            handler: function (val) {
                if (val) {
                    this.selectedGroup = this.initialGroup
                }
            },
            immediate: true,
        },
    },
    methods: {
        selectGroup(group) {
            this.selectedGroup = group
        },
    },
}
</script>
