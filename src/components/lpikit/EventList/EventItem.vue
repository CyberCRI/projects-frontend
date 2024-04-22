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
        <div class="novelty-wrapper" v-if="isNew">
            <span class="novelty-marker"></span>
        </div>
        <div class="texts">
            <h4 class="event-name">{{ event.title }}</h4>
            <p class="event-information">{{ event.content }}</p>
            <p class="event-groups" v-if="event.people_groups.length">
                <span>{{
                    event.people_groups.length > 1
                        ? $t('event.groups-label')
                        : $t('event.group-label')
                }}</span>
                {{ event.people_groups.map((group) => group.name).join(', ') }}
            </p>
        </div>
        <div class="event-controls" v-if="canEditEvent || canDeleteEvent">
            <ContextActionButton
                action-icon="Pen"
                class="edit-btn small"
                @click="editEvent(event)"
                v-if="canEditEvent"
            />
            <ContextActionButton
                action-icon="Close"
                class="remove-btn small"
                @click="deleteEvent(event)"
                v-if="canDeleteEvent"
            />
        </div>
    </div>
</template>
<script>
import IconImage from '@/components/svgs/IconImage.vue'
import ContextActionButton from '@/components/lpikit/LpiButton/ContextActionButton.vue'
import permissions from '@/mixins/permissions.ts'
export default {
    name: 'EventItem',

    emits: ['delete-event', 'edit-event'],

    mixins: [permissions],

    components: {
        IconImage,
        ContextActionButton,
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

        &:hover {
            background: $primary-lighter;
        }
    }

    .event-controls {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        flex-flow: column nowrap;
        gap: $space-2xs;
        justify-content: flex-start;
    }

    .date {
        flex-shrink: 0;
        display: flex;
        flex-wrap: nowrap;
        gap: $space-2xs;
        justify-content: flex-start;
        align-items: center;

        .icon {
            width: $font-size-3xl;
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
                font-size: 1rem;
            }

            .month {
                font-size: $font-size-xs;
            }
        }
    }

    .novelty-wrapper {
        .novelty-marker {
            display: inline-block;
            width: 1rem;
            height: 1rem;
            border-radius: 1rem;
            background-color: $salmon;
        }
    }

    .texts {
        flex-grow: 1;
        color: $primary-dark;

        .event-name {
            font-size: 1rem;
            font-weight: 400;
            margin-bottom: $space-2xs;
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
        .event-name,
        .event-information,
        .event-groups {
            font-weight: 900;
        }
    }
}
</style>
