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
                @edit-event="editedNews = event"
            />
            <EditNewsDrawer
                :is-opened="!!editedNews"
                :news="editedNews"
                @close="editedNews = null"
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
import EditNewsDrawer from '@/components/lpikit/EditNewsDrawer/EditNewsDrawer.vue'

export default {
    name: 'EventSummaryBlock',

    components: { EventItem, BaseListSummaryBlock, SummaryAction, EditNewsDrawer },

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

    data() {
        return {
            editedNews: null,
        }
    },
}
</script>
<style lang="scss" scoped>
.event {
    padding: 0;
}
</style>
