<template>
    <BaseListSummaryBlock
        :title="events.length > 2 ? $t(`home.short-title.events`) : $t(`home.long-title.events`)"
        :items="events"
        :inlined="inlined"
    >
        <template #default>
            <EventItem
                v-for="event in events"
                :key="event.id"
                :event="event"
                :cols="events.length > 2 ? 'three-col' : 'two-col'"
            />
        </template>

        <template #action>
            <SummaryAction
                :to="{ name: 'CalendarPage' }"
                action-icon="ArrowRight"
                :action-label="$t('feed.see-all')"
            />
        </template>
    </BaseListSummaryBlock>
</template>

<script>
import EventItem from '@/components/lpikit/EventList/EventItem.vue'
import BaseListSummaryBlock from '@/components/lpikit/SummaryCards/BaseListSummaryBlock.vue'
import SummaryAction from '@/components/lpikit/SummaryCards/SummaryAction.vue'

export default {
    name: 'EventSummaryBlock',

    components: { EventItem, BaseListSummaryBlock, SummaryAction },

    props: {
        events: {
            type: Array,
            default: () => [],
        },
        inlined: {
            type: Boolean,
            default: false,
        },
    },
}
</script>
<style lang="scss" scoped>
.event {
    padding: 0;
}
</style>
