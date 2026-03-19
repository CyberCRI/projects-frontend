<template>
  <div class="event" :class="{ editable: canEditEvent || canDeleteEvent }">
    <BadgeItem v-if="isNew" :label="$t('common.new')" colors="salmon" class="badge-new" />

    <time class="date" :datetime="start_date.toISOString()">
      <span class="month-day">
        {{ start_date.toLocaleDateString(locale, { month: 'long', day: '2-digit' }) }}
      </span>
      <span class="year">
        {{ start_date.getFullYear() }}
      </span>
    </time>

    <div class="info">
      <h4 class="title">
        {{ event.$t.title }}
      </h4>
      <div class="event-information">
        <ContentExpandable
          class="expandable-left"
          :description="event.$t.content"
          :height-limit="100"
        />
      </div>

      <template v-if="event.location">
        <button class="reset-btn btn-location scale-hover" @click.prevent="openModals('location')">
          <IconImage class="icon-small" name="MapMarker" />
          <span>
            {{ event.location?.$t?.title ?? $t('location.address') }}
          </span>
        </button>
        <LocationDrawer
          :is-opened="stateModals.location"
          :locations="[event.location]"
          @close="closeModals('location')"
        />
      </template>

      <!-- for date range -->
      <div>
        <IconImage class="icon-small" name="Calendar" />
        <span>
          {{ displayDateRange }}
        </span>
      </div>

      <temlate v-if="event.people_groups.length">
        <span class="news-groups">
          {{ $t('event.form.people_groups.label', event.people_groups2) }}:
        </span>
        <ContentExpandable
          class="expandable-left"
          :height-limit="30"
          :see-more-label="$t('group.see-more')"
          :see-less-label="$t('group.see-less')"
        >
          <ul class="news-groups-list">
            <li v-for="group in event.people_groups2" :key="group.slug">
              <NuxtLink
                :to="{ name: 'Group', params: { groupIdOrSlug: group.slug || group.id } }"
                class="scale-hover inline-block"
              >
                <IconImage class="icon-small" name="LinkRotated" />
                {{ group.name }}
              </NuxtLink>
            </li>
          </ul>
        </ContentExpandable>
      </temlate>
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
import ContentExpandable from '@/components/base/ContentExpandable.vue'

const props = defineProps<{
  event: TranslatedEventModel
}>()

const emit = defineEmits<{
  'delete-event': [TranslatedEventModel]
  'edit-event': [TranslatedEventModel]
}>()
const { canEditEvent, canDeleteEvent } = usePermissions()

const { locale } = useNuxtI18n()
const { stateModals, openModals, closeModals } = useModals({ location: false })

const isNew = computed(() => {
  return Date.now() - new Date(props.event.created_at).getTime() < 7 * 24 * 60 * 60 * 1000
})

const start_date = computed(() => new Date(props.event.start_date))
const end_date = computed(() => new Date(props.event.end_date ?? props.event.start_date))

const displayDateRange = computed(() => {
  const formater = new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'full',
    timeStyle: 'short',
  })
  // not range date, format only start_date
  if (end_date.value === start_date.value) {
    return formater.format(start_date.value)
  }
  return formater.formatRange(start_date.value, end_date.value)
})

const deleteEvent = (event) => emit('delete-event', event)
const editEvent = (event) => emit('edit-event', event)
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
  }

  .date {
    display: flex;
    flex-direction: column;
    background-color: #ebedee;
    align-items: center;
    justify-content: center;
    padding: 1rem;
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

.icon-small {
  display: inline-block;
  vertical-align: middle;
  padding: 0.4rem;
  fill: var(--primary);
  width: pxToRem(24px);
  height: pxToRem(24px);
}

.btn-location {
  cursor: pointer;
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
