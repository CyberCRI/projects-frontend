<template>
    <div class="page-section-narrow page-top">
        <h1 class="page-title">{{ $t('event.calendar.title') }}</h1>
        <div class="create-event-button-ctn">
            <LpiButton
                v-if="canCreateEvent"
                primary
                :label="$filters.capitalize($t('event.create.button'))"
                @click="createEvent"
                data-test="create-event-button"
                btn-icon="Plus"
                class="create-event-button"
            />
        </div>

        <TabsLayout :tabs="tabs" :border="false" align-left router-view />
    </div>
</template>
<script>
import TabsLayout from '@/components/base/navigation/TabsLayout.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import permissions from '@/mixins/permissions.ts'

export default {
    name: 'CalendarPage',

    mixins: [permissions],

    components: {
        TabsLayout,
        LpiButton,
    },

    computed: {
        tabs() {
            return [
                {
                    key: 'future-events',
                    label: this.$t('event.calendar.future'),
                    view: { name: 'FutureEvents' },
                },
                {
                    key: 'past-events',
                    label: this.$t('event.calendar.past'),
                    view: { name: 'PastEvents' },
                },
            ]
        },
    },
    methods: {
        createEvent() {
            this.$router.push({ name: 'CreateEvent' })
        },
    },
}
</script>
<style lang="scss" scoped>
.page-title {
    margin-bottom: pxToRem(60px);
}

.create-event-button-ctn {
    margin: 2rem 0;
}

.create-event-button {
    margin-left: auto;
}
</style>
