<template>
    <div class="event" :class="{ editable: canEditEvent || canDeleteEvent, 'is-new': isNew }">
        <div class="date">
            <IconImage name="Calendar" class="icon" />
            <div class="day-month">
                <div class="day">
                    {{ getDayFromDate(event.event_date) }}
                </div>
                <div class="month">
                    {{ $t(`event.calendar.month.${getMonthFromDate(event.event_date)}.short`) }}
                </div>
            </div>
        </div>
        <div class="texts">
            <h4 class="event-name">{{ event.title }}</h4>
            <div class="event-information" v-html="event.content"></div>
            <!-- TODO: put back group list when api send back their names ?-->
            <!--p class="event-groups" v-if="event.people_groups.length">
                <span>{{
                    event.people_groups.length > 1
                        ? $t('event.groups-label')
                        : $t('event.group-label')
                }}</span>
                {{ event.people_groups.map((group) => group.name).join(', ') }}
            </p-->
        </div>
        <ContextActionMenu
            v-if="canEditEvent || canDeleteEvent"
            class="event-controls"
            @edit="editEvent(event)"
            :can-edit="canEditEvent"
            @delete="deleteEvent(event)"
            :can-delete="canDeleteEvent"
        />
    </div>
</template>
<script>
import IconImage from '@/components/base/media/IconImage.vue'
import ContextActionMenu from '@/components/base/button/ContextActionMenu.vue'
import permissions from '@/mixins/permissions.ts'
export default {
    name: 'EventItem',

    emits: ['delete-event', 'edit-event'],

    mixins: [permissions],

    components: {
        IconImage,
        ContextActionMenu,
    },

    props: {
        event: {
            type: Object,
            default: () => ({}),
        },
    },

    computed: {
        isNew() {
            return Date.now() - new Date(this.event.created_at).getTime() < 7 * 24 * 60 * 60 * 1000
        },
    },

    methods: {
        getMonthFromDate(yearMonth) {
            return yearMonth.split('-')[1]
        },
        getDayFromDate(date) {
            return date.split('T')[0].split('-')[2]
        },

        deleteEvent(event) {
            this.$emit('delete-event', event)
        },

        editEvent(event) {
            this.$emit('edit-event', event)
        },
    },
}
</script>
<style lang="scss" scoped>
.event {
    display: flex;
    flex-wrap: nowrap;
    gap: $space-l;
    align-items: flex-start;
    justify-content: stretch;
    position: relative;
    padding: $space-m;
    border-radius: $border-radius-m;

    &.editable {
        padding-right: 1.4em;
    }

    .event-controls {
        position: absolute;
        right: 0;
        top: 0;
    }

    .date {
        flex-shrink: 0;
        display: flex;
        flex-wrap: nowrap;
        gap: $space-2xs;
        justify-content: flex-start;
        align-items: center;
        position: relative;

        .icon {
            width: $layout-size-3xl;
            fill: $primary-dark;
        }

        .day-month {
            display: flex;
            align-items: center;
            flex-direction: column;
            width: 1.4rem;
            color: $primary-dark;
            font-weight: 900;

            .day {
                font-size: $font-size-m;
            }

            .month {
                font-size: $font-size-xs;
            }
        }
    }

    .texts {
        flex-grow: 1;
        color: $primary-dark;

        .event-name {
            font-size: $font-size-m;
            font-weight: 400;
            margin-bottom: $space-2xs;
            line-height: $line-height-tight;
        }

        .event-information {
            font-size: $font-size-xs;
        }

        .event-groups {
            font-size: $font-size-xs;
            margin-top: $space-2xs;
        }
    }

    &.is-new {
        .event-name {
            font-weight: 900;
        }

        .date::after {
            content: '';
            display: inline-block;
            position: absolute;
            top: 0;
            left: 0;
            width: 0.8rem;
            height: 0.8rem;
            border-radius: 0.8rem;
            background-color: $salmon;
        }
    }
}
</style>
