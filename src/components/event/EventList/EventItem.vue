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
    <time class="date skeletons-background" :datetime="displayDate.toISOString()">
      <template v-if="!isToday">
        <span class="month-day">
          {{ displayDate.toLocaleDateString(locale, { month: 'long', day: '2-digit' }) }}
        </span>
        <span class="year">
          {{ displayDate.getFullYear() }}
        </span>
      </template>
      <span v-else>
        {{ $t('common.now') }}
      </span>
      <span>
        <BadgeItem v-if="isRunning" :label="$t('status.running')" colors="salmon" />
      </span>
    </time>

    <div class="info">
      <h3 class="title skeletons-text">
        {{ event.$t.title }}
      </h3>
      <div v-if="haveContent" class="event-information skeletons-text">
        <LineClamped v-if="contentText" :line-number="contentLineNumber">
          {{ content }}
        </LineClamped>
        <ContentExpandable
          v-else
          class="expandable-left"
          :description="event.$t.content"
          :height-limit="100"
          :opened="showMore"
          :hide-see-more="hideSeeMoreButton"
        />
      </div>

      <!-- for date range -->
      <div class="element-info skeletons-background">
        <IconImage class="icon-small" name="Calendar" />
        <DisplayDate :date="[event.start_date, event.end_date]" />
      </div>

      <template v-if="event.location">
        <component
          :is="!locationPreview ? 'button' : 'div'"
          class="reset-btn element-info btn-location skeletons-background"
          :class="{
            'scale-hover': !locationPreview,
            'pointer-events-none': locationPreview,
          }"
          @click.prevent="locationEvent(event)"
        >
          <IconImage class="icon-small" name="MapMarker" />
          <span class="text-ellipsis text-location">
            {{ event.location.$t?.title || $t('location.address') }}
          </span>
        </component>
        <MapRecap v-if="locationPreview" :locations="[event.location]" />
      </template>
    </div>

    <ContextActionMenuInline
      v-if="editable"
      :can-delete="canDeleteEvent"
      :can-edit="canEditEvent"
      @edit="editEvent(event)"
      @delete="deleteEvent(event)"
    />
  </component>
</template>

<script setup lang="ts">
import IconImage from '~/components/base/media/IconImage.vue'
import { TranslatedEventModel } from '~/models/event.model'
import ContentExpandable from '~/components/base/ContentExpandable.vue'
import MapRecap from '~/components/map/MapRecap.vue'
import ContextActionMenuInline from '~/components/base/button/ContextActionMenuInline.vue'
import { html2Text } from '~/functs/string'
import { dateWithoutHours, sanitizeDate } from '~/functs/date'
import DisplayDate from '~/components/base/DisplayDate.vue'
import LineClamped from '~/components/base/LineClamped.vue'
import { useIntervalNow } from '~/composables/useDate'

const props = withDefaults(
  defineProps<{
    event: TranslatedEventModel
    editable?: boolean
    hideSeeMoreButton?: boolean
    showMore?: boolean
    locationPreview?: boolean
    reverseDate?: boolean
    contentText?: boolean
    contentLineNumber?: number
    is?: string
  }>(),
  {
    editable: false,
    showMore: false,
    hideSeeMoreButton: false,
    locationPreview: false,
    reverseDate: false,
    contentText: false,
    contentLineNumber: 3,
    is: null,
  }
)

const emit = defineEmits<{
  delete: [TranslatedEventModel]
  edit: [TranslatedEventModel]
  location: [TranslatedEventModel]
}>()
const { canEditEvent, canDeleteEvent } = usePermissions()

const { locale } = useNuxtI18n()

const now = useIntervalNow('minute')

const isComponent = computed(() => {
  if (props.is) {
    return props.is
  }
  return resolveComponent('NuxtLink')
})

const content = computed(() => html2Text(props.event.$t.content))
const haveContent = computed(() => content.value.length !== 0)

const start_date = computed(() => sanitizeDate(new Date(props.event.start_date)))
const end_date = computed(() =>
  sanitizeDate(new Date(props.event.end_date ?? props.event.start_date))
)

const displayDate = computed(() => (props.reverseDate ? end_date.value : start_date.value))

const isToday = computed(() => {
  const date = dateWithoutHours(now.value)
  return dateWithoutHours(start_date.value) <= date && date <= dateWithoutHours(end_date.value)
})

const isRunning = computed(() => {
  return start_date.value <= now.value && now.value <= end_date.value
})

const deleteEvent = (event) => emit('delete', event)
const editEvent = (event) => emit('edit', event)
const locationEvent = (event) => emit('location', event)
</script>
<style lang="scss" scoped>
.event {
  display: grid;
  grid-template-columns: auto 4fr auto;
  gap: $space-l;
  position: relative;

  &.editable {
    padding-right: 1.4em;
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

.element-info {
  display: grid;
  grid-template-columns: auto 1fr;
}

.icon-small {
  display: inline-block;
  vertical-align: middle;
  padding: 0.4rem;
  fill: var(--primary);
  width: pxToRem(24px);
  height: pxToRem(24px);
}

.title {
  font-size: 1.5rem;
}

.btn-location {
  cursor: pointer;
}

.text-location {
  white-space: nowrap;
  margin: auto;
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
