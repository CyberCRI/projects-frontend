<template>
    <BaseDrawer
        :confirm-action-name="$t('common.save')"
        :confirm-action-disabled="invalid"
        :is-opened="isOpened"
        :title="form.id ? $t('event.drawer.edit') : $t('event.drawer.create')"
        class="small"
        @close="closeDrawer"
        @confirm="saveEvent"
        :asyncing="asyncing"
    >
        <EventForm ref="eventForm" v-model="form" v-if="form" @invalid="invalid = $event" />
    </BaseDrawer>
</template>
<script>
import { createEvent, putEvent } from '@/api/event.service'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import EventForm, { defaultForm } from '@/components/event/EventForm/EventForm.vue'

export default {
    name: 'EditEventDrawer',

    emits: ['close', 'event-edited'],

    components: {
        EventForm,
        BaseDrawer,
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
            asyncing: false,
            invalid: false,
        }
    },

    watch: {
        event: {
            handler(event) {
                if (event) {
                    this.form = {
                        ...event,
                        event_date: new Date(event.event_date),
                        // build group "object" from array if it is an array
                        people_groups: event.people_groups.reduce
                            ? event.people_groups.reduce((acc, group) => {
                                  acc[group.id] = true
                                  return acc
                              }, {})
                            : event.people_groups,
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

            this.asyncing = true

            try {
                const formData = {
                    ...this.form,
                    event_date: this.form.event_date.toISOString(),
                    people_groups: Object.entries(this.form.people_groups)
                        .filter(([, value]) => value)
                        .map(([id]) => id),
                }
                let savedEvent
                if (this.event?.id) {
                    savedEvent = await putEvent(
                        this.$store.getters['organizations/current']?.code,
                        this.event.id,
                        formData
                    )
                } else {
                    savedEvent = await createEvent(
                        this.$store.getters['organizations/current']?.code,
                        formData
                    )
                }
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('event.save.success'),
                    type: 'success',
                })
                this.$emit('event-edited', savedEvent)
            } catch (err) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('event.save.error')} (${err})`,
                    type: 'error',
                })
                console.error(err)
            } finally {
                this.asyncing = false
                this.closeDrawer()
            }
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
