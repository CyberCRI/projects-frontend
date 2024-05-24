<template>
    <BaseDrawer
        :confirm-action-name="$t('common.confirm')"
        :is-opened="isOpened"
        :title="$t('sdg.sdg-fulltext')"
        class="small"
        @close="close"
        @confirm="saveSdgs"
        :asyncing="asyncing"
    >
        <SdgGrid ref="sdg-grid" :current-sdgs="sdgs" />
    </BaseDrawer>
</template>

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import SdgGrid from '@/components/project/sdg/SdgGrid.vue'

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
        return {
            asyncing: false,
        }
    },

    methods: {
        async saveSdgs() {
            this.asyncing = true
            await this.$refs['sdg-grid'].submitSdgs()
            this.asyncing = false
        },

        close() {
            if (this.asyncing) return
            this.$emit('close')
        },
    },
}
</script>
