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
        <SdgsFilter ref="sdg-grid" v-model="selection" />
    </BaseDrawer>
</template>

<script>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import SdgsFilter from '@/components/search/Filters/SdgsFilter.vue'
import { patchProject } from '@/api/projects.service'
import analytics from '@/analytics'

export default {
    name: 'SdgsDrawer',

    emits: ['close', 'reload-sdgs'],

    components: { BaseDrawer, SdgsFilter },

    props: {
        project: {
            type: Object,
            default: () => ({}),
        },
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
            selection: [...this.sdgs],
        }
    },

    watch: {
        isOpened(isOpened) {
            if (isOpened) {
                this.selection = [...this.sdgs]
            }
        },
    },

    methods: {
        async saveSdgs() {
            this.asyncing = true
            const sdgs = this.selection
            try {
                await patchProject(this.project.id, { sdgs })

                analytics.goal.updateSDG(this.project.id, sdgs)

                this.$emit('reload-sdgs')

                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.sdgs-update.success'),
                    type: 'success',
                })
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.sdgs-update.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.$emit('close')
                this.asyncing = false
            }
        },

        close() {
            if (this.asyncing) return
            this.$emit('close')
        },
    },
}
</script>
