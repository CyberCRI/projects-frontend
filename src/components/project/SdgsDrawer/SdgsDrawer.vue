<template>
    <BaseDrawer
        :confirm-action-name="$t('common.confirm')"
        :is-opened="isOpened"
        :title="$t('sdg.sdg-fulltext')"
        class="small"
        @close="close"
        @confirm="saveSdgs"
    >
        <SdgGrid ref="sdg-grid" :current-sdgs="sdgs" @close-drawer="close" />
    </BaseDrawer>
</template>

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import SdgGrid from '@/pages/ProjectPage/Tabs/ProjectGoals/SdgGrid.vue'

export default {
    name: 'SdgsDrawer',

    emits: ['close'],

    components: { BaseDrawer, SdgGrid },

    props: {
        isOpened: {
            type: Boolean,
            default: false,
        },
        sdgs: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {}
    },

    methods: {
        async saveSdgs() {
            await this.$refs['sdg-grid'].submitSdgs()
            this.close()
        },

        close() {
            this.$emit('close')
        },
    },
}
</script>
