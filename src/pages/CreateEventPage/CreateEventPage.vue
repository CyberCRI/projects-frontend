<template>
    <div class="page-section-narrow page-top">
        <h1 class="page-title">{{ $t('event.create.title') }}</h1>
        <EventForm ref="eventForm" v-model="form" />
        <div class="form-actions">
            <LpiButton
                :disabled="asyncing"
                :label="$filters.capitalize($t('common.cancel'))"
                secondary
                class="footer__left-button"
                @click="cancel"
                data-test="close-button"
            />

            <LpiButton
                :disabled="$refs?.eventForm?.v$?.$invalid || asyncing"
                :label="$filters.capitalize(confirmActionName || $t('common.confirm'))"
                :btn-icon="asyncing ? 'LoaderSimple' : null"
                class="footer__right-button"
                @click="saveEvent"
                data-test="confirm-button"
            />
        </div>
    </div>
</template>
<script>
import LpiButton from '@/components/base/button/LpiButton.vue'
import EventForm, { defaultForm } from '@/components/event/EventForm/EventForm.vue'
import { createEvent } from '@/api/event.service'

export default {
    name: 'CreateEventPage',

    components: {
        EventForm,
        LpiButton,
    },
    data() {
        return {
            asyncing: false,
            form: defaultForm(),
        }
    },

    methods: {
        cancel() {
            // TODO
            this.form = defaultForm()
        },

        async saveEvent() {
            const isValid = await this.$refs.eventForm.v$.$validate()
            if (!isValid) {
                return
            }

            try {
                this.asyncing = true
                const formData = {
                    ...this.form,
                    event_date: this.form.event_date?.toISOString(),
                    people_groups: Object.entries(this.form.people_groups)
                        .filter(([, value]) => value)
                        .map(([id]) => id),
                }
                await createEvent(this.$store.getters['organizations/current']?.code, formData)
                this.$store.dispatch('notifications/pushToast', {
                    message: this.$t('event.save.success'),
                    type: 'success',
                })
            } catch (err) {
                this.$store.dispatch('notifications/pushToast', {
                    message: `${this.$t('event.save.error')} (${err})`,
                    type: 'error',
                })
                console.error(err)
            } finally {
                this.asyncing = false
                this.$router.push({ name: 'FutureEvents' })
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.page-title {
    margin-bottom: pxToRem(60px);
}

.form-actions {
    flex-shrink: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    border-top: $border-width-s solid $lighter-gray;
    color: $primary-dark;
    font-weight: 700;
    padding-top: $space-l;
    padding-bottom: $space-l;
    position: sticky;
    bottom: 0;
    background: $white;
    gap: $space-l;

    button ~ button {
        text-transform: capitalize;
    }
}
</style>
