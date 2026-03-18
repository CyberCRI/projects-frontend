<template>
  <div class="event" :class="{ editable: canEditEvent || canDeleteEvent, 'is-new': isNew }">
    <div class="date">
      <IconImage name="Calendar" class="icon" />
      <div class="day-month">
        <div class="day">
          {{ start_date.getDay() }}
        </div>
        <div class="month">
          {{ start_date.toLocaleDateString(locale, { month: 'long' }) }}
        </div>
      </div>
    </div>
    <div class="texts">
      <h4 class="event-name">
        {{ event.$t.title }}
      </h4>
      <div class="event-information">
        <DescriptionExpandable
          :description="event.$t.content"
          :height-limit="400"
          :opened="!isLimitedDescription"
        />
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

<script setup lang="ts">
import IconImage from '@/components/base/media/IconImage.vue'
import ContextActionMenu from '@/components/base/button/ContextActionMenu.vue'
import { TranslatedEventModel } from '@/models/event.model'
import DescriptionExpandable from '@/components/base/DescriptionExpandable.vue'

const props = withDefaults(
  defineProps<{
    event: TranslatedEventModel
    isLimitedDescription?: boolean
  }>(),
  { isLimitedDescription: false }
)

const emit = defineEmits<{
  'delete-event': [TranslatedEventModel]
  'edit-event': [TranslatedEventModel]
}>()
const { canEditEvent, canDeleteEvent } = usePermissions()

const { locale } = useNuxtI18n()

const isNew = computed(() => {
  return Date.now() - new Date(props.event.created_at).getTime() < 7 * 24 * 60 * 60 * 1000
})

const start_date = computed(() => new Date(props.event.start_date))
// const end_date = computed(() => new Date(props.event.end_date ?? props.event.start_date))

const deleteEvent = (event) => {
  emit('delete-event', event)
}

const editEvent = (event) => {
  emit('edit-event', event)
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
