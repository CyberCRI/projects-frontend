<template>
    <AdminBlock :block-title="blockTitle" :is-loading="isLoading">
        <template #actions>
            <LinkButton btn-icon="Plus" :label="$t('common.add')" @click="addEvent"></LinkButton>
        </template>
        <template #default>
            <EventAdminListItem
                v-for="event in events"
                :event="event"
                @edit-event="onEditEvent"
                @delete-event="onDeleteEvent"
            ></EventAdminListItem>
        </template>

        <template #footer>
            <LinkButton btn-icon="ArrowRight" :label="$t('common.see-all')" />
        </template>
    </AdminBlock>
    <EditEventDrawer :is-opened="!!editedEvent" @close="editedEvent = null" :event="editedEvent" />
</template>
<script>
import AdminBlock from '../AdminBlock.vue'
import LinkButton from '@/components/lpikit/LpiButton/LinkButton.vue'
import EditEventDrawer from '@/components/lpikit/EditEventDrawer/EditEventDrawer.vue'
import { defaultForm } from '@/components/lpikit/EventForm/EventForm.vue'
import EventAdminListItem from './EventAdminListItem.vue'
export default {
    name: 'EventAdminBlock',

    components: {
        AdminBlock,
        LinkButton,
        EditEventDrawer,
        EventAdminListItem,
    },

    data() {
        return {
            events: [],
            isLoading: true,
            editedEvent: null,
        }
    },

    computed: {
        blockTitle() {
            let extra = this.isLoading ? '' : ` (${this.events.length})`
            return this.$t('admin.portal.events') + extra
        },
    },

    async mounted() {
        await this.loadEvents()
    },

    methods: {
        async loadEvents() {
            this.isLoading = true
            this.events = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve([
                        {
                            id: 1,
                            date: '2024-03-25',
                            name: 'Event 1',
                            information: 'Information 1',
                            groups: [],
                            date_edited: '2024-01-25T12:00:00Z',
                        },
                        {
                            id: 2,
                            date: '2024-03-28',
                            name: 'Event 2',
                            information: 'Information 2',
                            groups: [
                                {
                                    id: 3,
                                    name: 'Researchers',
                                },
                                {
                                    id: 159,
                                    name: 'R&D Staff',
                                },
                            ],
                            date_edited: '2024-03-05T12:00:00Z',
                        },
                        {
                            id: 3,
                            date: '2024-04-02',
                            name: 'Event 3',
                            information: 'Information 3',
                            groups: [],
                            date_edited: '2024-03-03T12:00:00Z',
                        },
                    ])
                }, 1000)
            })
            this.isLoading = false
        },

        addEvent() {
            this.editedEvent = defaultForm()
        },

        onEditEvent(event) {
            this.editedEvent = event
        },

        onDeleteEvent(event) {
            // TODO
            console.log('deleteEvent', event)
        },
    },
}
</script>
<style lang="scss" scoped></style>
