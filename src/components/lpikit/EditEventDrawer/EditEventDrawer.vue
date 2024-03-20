<template>
    <DrawerLayout
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="$refs?.eventForm?.v$?.$invalid"
        :is-opened="isOpened"
        :title="form.id ? $t('event.drawer.edit') : $t('event.drawer.create')"
        class="small"
        @close="closeDrawer"
        @confirm="saveEvent"
    >
        <EventForm ref="eventForm" v-model="form" v-if="form" />
    </DrawerLayout>
</template>
<script>
import DrawerLayout from '@/components/lpikit/Drawer/DrawerLayout.vue'
import EventForm, { defaultForm } from '@/components/lpikit/EventForm/EventForm.vue'

export default {
    name: 'EditEventDrawer',

    emits: ['close'],

    components: {
        EventForm,
        DrawerLayout,
    },

    props: {
        isOpened: {
            type: Boolean,
            default: false,
        },

        event: {
            type: [Object, null],
            default: null,
        },
    },

    data() {
        return {
            form: defaultForm(),
        }
    },

    watch: {
        event: {
            handler(event) {
                if (event) {
                    this.form = {
                        ...event,
                        date: new Date(event.date),
                        groups: event.groups.reduce((acc, group) => {
                            acc[group.id] = true
                            return acc
                        }, {}),
                    }
                } else {
                    this.form = defaultForm()
                }
            },
            immediate: true,
        },
    },

    methods: {
        async saveEvent() {
            const isValid = await this.$refs.eventForm.v$.$validate()
            if (!isValid) {
                return
            }

            const formData = {
                ...this.form,
                date: this.form.date.toISOString(),
                groups: Object.entries(this.form.groups)
                    .filter(([, value]) => value)
                    .map(([id]) => id),
            }
            // TODO: save event and remove log
            console.log('saveEvent', formData)
            this.closeDrawer()
        },
        closeDrawer() {
            this.$emit('close')
        },
    },
}
</script>
<style lang="scss" scoped>
.page-title {
    margin-bottom: pxToRem(60px);
}
</style>
