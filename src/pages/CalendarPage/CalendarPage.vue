<template>
    <div class="page-section-narrow page-top">
        <h1 class="page-title">{{ $t('event.calendar.title') }}</h1>

        <TabsLayout :tabs="tabs" :border="false" align-left router-view />
    </div>
</template>
<script>
import TabsLayout from '@/components/lpikit/Tabs/TabsLayout.vue'

export default {
    name: 'CalendarPage',

    components: {
        TabsLayout,
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
}
</script>
<style lang="scss" scoped>
.page-title {
    margin-bottom: pxToRem(60px);
}
</style>
