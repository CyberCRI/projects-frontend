<template>
  <component
    :is="isComponent"
    :to="
      event.id
        ? {
            name: 'EventPage',
            params: { eventId: event.id },
          }
        : null
    "
    class="event"
    :class="{ editable: editable && (canEditEvent || canDeleteEvent), 'scale-hover': !props.is }"
  >
    <time class="date skeletons-background" :datetime="eventDate.toISOString()">
      <template v-if="!isCurrent">
        <span class="month-day">
          {{ eventDate.toLocaleDateString(locale, { month: 'long', day: '2-digit' }) }}
        </span>
        <span class="year">
          {{ eventDate.getFullYear() }}
        </span>
      </template>
      <span v-else>
        {{ $t('common.now') }}
      </span>
      <span>
        <BadgeItem v-if="isCurrent" :label="$t('status.running')" colors="salmon" />
      </span>
    </time>

    <div class="info">
      <h4 class="title skeletons-text">
        {{ event.$t.title }}
      </h4>
      <div class="event-information skeletons-text">
        <ContentExpandable
          class="expandable-left"
          :description="event.$t.content"
          :height-limit="100"
          :opened="showMore"
          :hide-see-more="hideSeeMoreButton"
        />
      </div>

      <div class="date-info skeletons-background">
        <IconImage class="icon-small" name="Calendar" />
        <span class="date-display">
          {{ displayDate }}
        </span>
      </div>
    </div>

    <ContextActionMenuInline
      v-if="editable"
      class="event-controls"
      :can-delete="canDeleteEvent"
      :can-edit="canEditEvent"
      @edit="editEvent(event)"
      @delete="deleteEvent(event)"
    />
  </component>
</template>

<script setup lang="ts">
import IconImage from '@/components/base/media/IconImage.vue'
import { TranslatedEventModel } from '@/models/event.model'
import ContentExpandable from '@/components/base/ContentExpandable.vue'
import ContextActionMenuInline from '@/components/base/button/ContextActionMenuInline.vue'

const props = withDefaults(
  defineProps<{
    event: TranslatedEventModel
    editable?: boolean
    hideSeeMoreButton?: boolean
    showMore?: boolean
    reverseDate?: boolean
    is?: string
  }>(),
  {
    editable: false,
    showMore: false,
    hideSeeMoreButton: false,
    reverseDate: false,
    is: null,
  }
)

const emit = defineEmits<{
  delete: [TranslatedEventModel]
  edit: [TranslatedEventModel]
}>()
const { canEditEvent, canDeleteEvent } = usePermissions()

const { locale } = useNuxtI18n()

const isComponent = computed(() => {
  if (props.is) {
    return props.is
  }
  return resolveComponent('NuxtLink')
})

const eventDate = computed(() => new Date(props.event.event_date))

const isCurrent = computed(() => {
  const now = new Date()
  return eventDate.value <= now && now <= eventDate.value
})

const displayDate = computed(() => {
  const formater = new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'full',
    timeStyle: 'short',
  })
  return formater.format(eventDate.value)
})

const deleteEvent = (event) => emit('delete', event)
const editEvent = (event) => emit('edit', event)
</script>
<style lang="scss" scoped>
.event {
  display: grid;
  grid-template-columns: auto 4fr;
  gap: $space-l;
  position: relative;

  &.editable {
    padding-right: 1.4em;
  }

  .event-controls {
    position: absolute;
    right: 0;
    top: 0;
    margin: -1rem;
  }

  .date {
    display: flex;
    flex-direction: column;
    background-color: #ebedee;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    color: black;
    border-radius: $border-radius-m;
    height: fit-content;

    .month-day {
      font-size: larger;
      font-weight: 500;
    }

    .year {
      opacity: 0.7;
    }
  }
}

.date-info {
  display: grid;
  grid-template-columns: auto 1fr;
}

.date-display {
  align-self: center;
}

.icon-small {
  display: inline-block;
  vertical-align: middle;
  padding: 0.4rem;
  fill: var(--primary);
  width: pxToRem(24px);
  height: pxToRem(24px);
}

.badge-new {
  position: absolute;
  color: white;
  margin: -0.5rem;
}

.news-groups {
  font-weight: bold;
}

.news-groups-list {
  margin-left: 2rem;
}
</style>

<style lang="scss">
.expandable-left {
  display: flex;
  flex-direction: column;

  > button {
    align-self: flex-end;
  }
}
</style>
