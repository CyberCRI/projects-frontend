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
      <h4 class="event-name">
        {{ event?.$t?.title }}
      </h4>
      <div class="event-information">
        <HtmlLimiter
          v-if="isLimitedDescription"
          :html="event.content"
          :striped-tags="['table']"
          @computed="layoutComputed"
          @computing="computeLayout"
        />
        <div v-else class="event-information" v-html="event?.$t?.content" />
      </div>
    </div>
    <ContextActionMenu
      v-if="canEditEvent || canDeleteEvent"
      class="event-controls"
      :can-edit="canEditEvent"
      :can-delete="canDeleteEvent"
      @edit="editEvent(event)"
      @delete="deleteEvent(event)"
    />
  </div>
</template>
<script>
import IconImage from '@/components/base/media/IconImage.vue'
import ContextActionMenu from '@/components/base/button/ContextActionMenu.vue'
export default {
  name: 'EventItem',

  components: {
    IconImage,
    ContextActionMenu,
  },

  props: {
    event: {
      type: Object,
      default: () => ({}),
    },
    isLimitedDescription: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['delete-event', 'edit-event'],

  setup() {
    const { canEditEvent, canDeleteEvent } = usePermissions()
    return { canEditEvent, canDeleteEvent }
  },

  data() {
    return {
      style: {},
      textsStyle: {},
    }
  },

  computed: {
    isNew() {
      return Date.now() - new Date(this.event.created_at).getTime() < 7 * 24 * 60 * 60 * 1000
    },
  },

  methods: {
    computeLayout() {
      this.style = {}
      this.textsStyle = {}
    },
    layoutComputed(event) {
      this.style = { height: event.height + 'px' }
      this.textsStyle = { height: 'auto' }
    },
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
  align-items: stretch;
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
    align-self: flex-start;
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
    display: flex;
    flex-flow: column nowrap;

    .event-name {
      font-size: $font-size-m;
      font-weight: 400;
      margin-bottom: $space-2xs;
      line-height: $line-height-tight;
    }

    .event-information {
      font-size: $font-size-xs;
      position: relative;
      flex-grow: 1;
      display: flex;
      flex-flow: column;
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
