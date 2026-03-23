<template>
  <component
    :is="is"
    :to="to"
    class="event"
    :class="{ editable: canEditEvent || canDeleteEvent, 'scale-hover': !!to }"
  >
    <!-- <BadgeItem v-if="isNew" label="" colors="salmon" class="badge-new" /> -->

    <time
      class="date skeletons-background"
      :datetime="start_date.toISOString()"
      :class="{ 'is-new': isNew }"
    >
      <span class="month-day">
        {{ start_date.toLocaleDateString(locale, { month: 'long', day: '2-digit' }) }}
      </span>
      <span class="year">
        {{ start_date.getFullYear() }}
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

      <!-- for date range -->
      <div class="date-info skeletons-background">
        <IconImage class="icon-small" name="Calendar" />
        <span class="date-range">
          {{ displayDateRange }}
        </span>
      </div>

      <template v-if="event.location">
        <comonent
          :is="locationPreview ? 'div' : 'button'"
          class="reset-btn btn-location scale-hover skeletons-background"
          @click.prevent="openModals('location')"
        >
          <IconImage class="icon-small" name="MapMarker" />
          <span>
            {{ event.location?.$t?.title || $t('location.address') }}
          </span>
        </comonent>
        <MapRecap v-if="locationPreview" :locations="[event.location]" />
        <LocationDrawer
          v-else
          :is-opened="stateModals.location"
          :locations="[event.location]"
          @close="closeModals('location')"
        />
      </template>

      <temlate v-if="event.people_groups2?.length && !hideGroups">
        <span class="news-groups skeletons-text">
          {{ $t('event.form.people_groups.label', event.people_groups2) }}:
        </span>
        <ContentExpandable
          class="expandable-left skeletons-background"
          :opened="showMore"
          :hide-see-more="hideSeeMoreButton"
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
            <li v-for="group in event.people_groups2" :key="group.slug">
              <NuxtLink
                :to="{ name: 'Group', params: { groupIdOrSlug: group.slug || group.id } }"
                class="scale-hover inline-block"
              >
                <IconImage class="icon-small" name="LinkRotated" />
                {{ group.name }}
              </NuxtLink>
            </li>
            <li v-for="group in event.people_groups2" :key="group.slug">
              <NuxtLink
                :to="{ name: 'Group', params: { groupIdOrSlug: group.slug || group.id } }"
                class="scale-hover inline-block"
              >
                <IconImage class="icon-small" name="LinkRotated" />
                {{ group.name }}
              </NuxtLink>
            </li>
            <li v-for="group in event.people_groups2" :key="group.slug">
              <NuxtLink
                :to="{ name: 'Group', params: { groupIdOrSlug: group.slug || group.id } }"
                class="scale-hover inline-block"
              >
                <IconImage class="icon-small" name="LinkRotated" />
                {{ group.name }}
              </NuxtLink>
            </li>
            <li v-for="group in event.people_groups2" :key="group.slug">
              <NuxtLink
                :to="{ name: 'Group', params: { groupIdOrSlug: group.slug || group.id } }"
                class="scale-hover inline-block"
              >
                <IconImage class="icon-small" name="LinkRotated" />
                {{ group.name }}
              </NuxtLink>
            </li>
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
      v-if="editable && (canEditEvent || canDeleteEvent)"
      class="event-controls skeletons-background"
      :can-edit="canEditEvent"
      :can-delete="canDeleteEvent"
      @edit="editEvent(event)"
      @delete="deleteEvent(event)"
    />
  </component>
</template>

<script setup lang="ts">
import IconImage from '@/components/base/media/IconImage.vue'
import ContextActionMenu from '@/components/base/button/ContextActionMenu.vue'
import { TranslatedEventModel } from '@/models/event.model'
import ContentExpandable from '@/components/base/ContentExpandable.vue'
import MapRecap from '@/components/map/MapRecap.vue'

const props = withDefaults(
  defineProps<{
    event: TranslatedEventModel
    editable?: boolean
    hideGroups?: boolean
    hideSeeMoreButton?: boolean
    showMore?: boolean
    to?: any
    locationPreview?: boolean
  }>(),
  {
    editable: false,
    hideGroups: false,
    showMore: false,
    hideSeeMoreButton: false,
    to: null,
    locationPreview: false,
  }
)

const emit = defineEmits<{
  delete: [TranslatedEventModel]
  edit: [TranslatedEventModel]
}>()
const { canEditEvent, canDeleteEvent } = usePermissions()

const { locale } = useNuxtI18n()
const { stateModals, openModals, closeModals } = useModals({ location: false })

const isNew = computed(() => {
  return Date.now() - new Date(props.event.created_at).getTime() < 3600 * 24 * 2
})

const start_date = computed(() => new Date(props.event.start_date))
const end_date = computed(() => new Date(props.event.end_date ?? props.event.start_date))

const is = computed(() => {
  if (props.to) {
    return resolveComponent('NuxtLink')
  }
  return 'div'
})

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

.is-new::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
  left: 0;
  margin: -0.25rem;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 1rem;
  background-color: $salmon;
}

.date-info {
  display: grid;
  grid-template-columns: auto 1fr;
}

.date-range {
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
