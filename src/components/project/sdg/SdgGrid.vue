<template>
    <SdgsFilter v-model="selection" ref="sdg-modal" />
</template>

<script>
import analytics from '@/analytics'
import SdgsFilter from '@/components/search/Filters/SdgsFilter.vue'

export default {
    name: 'SdgGrid',

    emits: ['close-drawer'],

    components: { SdgsFilter },

    props: {
        currentSdgs: {
            type: Array,
            default: () => [],
        },
    },

    data() {
        return {
            selection: [...this.currentSdgs],
        }
    },

    computed: {
        project() {
            return this.$store.getters['projects/project']
        },
    },

    inject: ['projectLayoutToggleAddModal'],

    methods: {
        // submit function is used in SdgRecap.vue
        // eslint-disable-next-line
        async submitSdgs() {
            const sdgs = this.selection
            try {
                await this.$store.dispatch('projects/updateProject', {
                    id: this.project.id,
                    project: { sdgs },
                })
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('toasts.sdgs-update.success'),
                    type: 'success',
                })
                analytics.goal.updateSDG(this.project.id, sdgs)
                this.$emit('close-drawer')
            } catch (error) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('toasts.sdgs-update.error')} (${error})`,
                    type: 'error',
                })
                console.error(error)
            } finally {
                this.projectLayoutToggleAddModal('sdg')
            }
        },
    },
}
</script>
