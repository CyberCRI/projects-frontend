<template>
  <BaseDrawer
    :confirm-action-name="$t('common.save')"
    :confirm-action-disabled="invalid"
    :is-opened="isOpened"
    :title="event?.id ? $t('event.drawer.edit') : $t('event.drawer.create')"
    class="medium"
    :asyncing="asyncing"
    @close="closeDrawer"
    @confirm="saveEvent"
  >
    <EventForm
      v-if="form"
      ref="eventForm"
      v-model="form"
      :selected-group="selectedGroup"
      @invalid="invalid = $event"
    />
  </BaseDrawer>
</template>

<script setup lang="ts">
import { createEvent, putEvent } from '~/api/event.service'
import BaseDrawer from '~/components/base/BaseDrawer.vue'
import EventForm from '~/components/event/EventForm/EventForm.vue'
import useToasterStore from '~/stores/useToaster'
import { defaultForm } from '~/form/event'
import { EventModel } from '~/models/event.model'

const props = withDefaults(
  defineProps<{
    isOpened?: boolean
    event?: EventModel
    selectedGroup?: boolean
  }>(),
  { isOpened: false, event: null, selectedGroup: true }
)

const emit = defineEmits<{
  close: []
  edited: [EventModel]
}>()
const { t } = useNuxtI18n()
const toaster = useToasterStore()
const organizationCode = useOrganizationCode()

const form = ref(defaultForm())
const asyncing = ref(false)
const invalid = ref(false)

watch(
  () => props.event,
  (event) => {
    if (event) {
      form.value = {
        ...event,
        start_date: event.start_date ? new Date(event.start_date) : null,
        end_date: event.end_date ? new Date(event.end_date) : null,
        // build group "object" from array if it is an array
        people_groups: event.people_groups.reduce
          ? event.people_groups.reduce((acc, groupId) => {
              acc[groupId] = true
              return acc
            }, {})
          : event.people_groups,
      }
    } else {
      form.value = defaultForm()
    }
  },
  { immediate: true }
)

const eventForm = useTemplateRef('eventForm')
const saveEvent = async () => {
  const isValid = await eventForm.value.v$.$validate()
  if (!isValid) {
    return
  }

  asyncing.value = true

  try {
    const formData = {
      ...form.value,
      start_date: form.value.start_date.toISOString(),
      end_date: (form.value.end_date || form.value.start_date).toISOString(),
      people_groups: Object.entries(form.value.people_groups)
        .filter(([, value]) => value)
        .map(([id]) => id),
    }
    let savedEvent: EventModel
    if (props.event?.id) {
      savedEvent = await putEvent(organizationCode, props.event.id, formData)
    } else {
      savedEvent = await createEvent(organizationCode, formData)
    }
    toaster.pushSuccess(t('event.save.success'))

    emit('edited', savedEvent)
  } catch (err) {
    toaster.pushError(`${t('event.save.error')} (${err})`)
    console.error(err)
  } finally {
    asyncing.value = false
    closeDrawer()
  }
}
const closeDrawer = () => emit('close')
</script>
