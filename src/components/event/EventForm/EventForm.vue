<template>
  <form class="list-container">
    <TextInput
      input-type="text"
      :label="$t('event.form.title.label')"
      required
      :model-value="model.title"
      :placeholder="$t('event.form.title.placeholder')"
      :errors="v$.title.$errors"
      @update:model-value="updateForm({ title: $event })"
      @blur="v$.title.$validate"
    />

    <Field :label="$t('event.form.content.label')" required>
      <TipTapEditor
        ref="tiptapEditor"
        :model-value="model.content"
        class="input-field content-editor no-max-height"
        mode="full"
        :errors="v$.content.$errors"
        @update:model-value="updateForm({ content: $event })"
      />
    </Field>

    <DateField
      :label="$t('event.form.event_date.label')"
      range
      time-picker
      :model-value="datePickerValue"
      :errors="[...v$.start_date.$errors, ...v$.end_date.$errors]"
      @update:model-value="onDateSelected"
    />

    <div class="form-section">
      <!-- locations -->
      <Field :label="$t('location.default-title')">
        <template #in-label>
          <LpiButton
            v-if="!model.location"
            class="add-btn"
            :btn-icon="model.location ? 'Pen' : 'Plus'"
            data-test="add-location"
            :label="$t(model.location ? 'group.form.edit' : 'group.form.add')"
            @click="openModals('LocationDrawer')"
          />
        </template>
        <LocationItem
          v-if="model.location"
          :location="model.location"
          editable
          :focus="false"
          @edit="openModals('LocationForm')"
          @delete="updateLocation(null)"
        />
        <EmptyLabel v-else :label="$t('map.empty')" class="m-auto" />
      </Field>

      <LocationForm
        v-if="stateModals.LocationForm"
        v-model="model.location"
        :location-types="LOCATION_TYPES"
        @close="closeModals('LocationForm')"
        @submit="closeModals('LocationForm')"
        @delete="updateLocation(null)"
      />
      <LocationDrawer
        :is-opened="stateModals.LocationDrawer"
        :locations="model.location ? [model.location] : []"
        editable
        :location-types="LOCATION_TYPES"
        @close="closeModals('LocationDrawer')"
        @submit="updateLocation($event)"
        @delete="updateLocation(null)"
      />
    </div>

    <Field :label="$t('event.form.visibility.label')">
      <LpiCheckbox v-model="model.visible_by_all" :label="$t('event.form.visibility.notice')" />
    </Field>

    <Field
      v-if="selectedGroup"
      :label="$t('event.form.people_groups.label')"
      :help="$t('event.form.people_groups.notice')"
    >
      <MultiGroupPicker
        :model-value="model.people_groups"
        @update:model-value="updateForm({ people_groups: $event })"
      />
    </Field>
  </form>
</template>

<script setup lang="ts">
import { helpers, required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

import type { EventForm } from '~/models/event.model'
import type { LocationType } from '~/models/types'

import MultiGroupPicker from '~/components/group/MultiGroupPicker/MultiGroupPicker.vue'
import TipTapEditor from '~/components/base/form/TextEditor/TipTapEditor.vue'
import TextInput from '~/components/base/form/TextInput.vue'
import DateField from '~/components/base/form/DateField.vue'

import LocationItem from '~/components/map/LocationItem.vue'
import EmptyLabel from '~/components/base/EmptyLabel.vue'
import { defaultEventForm } from '~/form/event'
import { requiredContent } from '~/form/base'

withDefaults(
  defineProps<{
    selectedGroup?: boolean
  }>(),
  {
    selectedGroup: true,
  }
)
const { t } = useNuxtI18n()
const model = defineModel<EventForm>({ default: defaultEventForm() })
const emit = defineEmits<{
  invalid: [boolean]
}>()

const { stateModals, openModals, closeModals } = useModals({
  LocationForm: false,
  LocationDrawer: false,
})

const LOCATION_TYPES: LocationType[] = ['event']

const rules = computed(() => ({
  title: {
    required: helpers.withMessage(t('event.form.title.required'), required),
  },
  content: {
    required: helpers.withMessage(t('event.form.content.required'), requiredContent),
  },
  start_date: {
    required: helpers.withMessage(t('event.form.event_date.required'), required),
    maxValue: helpers.withMessage(
      t('event.form.event_date.before-end'),
      (value: string | Date, { end_date }) => {
        if (!end_date) {
          return true
        }
        return new Date(value) <= new Date(end_date)
      }
    ),
  },
  end_date: {
    minValue: helpers.withMessage(
      t('event.form.event_date.before-start'),
      (value: string | Date, { start_date }) => {
        // no validate
        if (!value) {
          return true
        }
        return new Date(value) >= new Date(start_date)
      }
    ),
  },
}))

const datePickerValue = computed(() => {
  const start = model.value.start_date ? new Date(model.value.start_date) : null
  const end = model.value.end_date ? new Date(model.value.end_date) : null
  return [start, end].filter((v) => !!v)
})

const v$ = useVuelidate(rules, model)
defineExpose({
  v$,
})

watch(
  () => v$.value.$invalid,
  (isInvalid) => {
    emit('invalid', isInvalid)
  }
)

const onDateSelected = (modelData) => {
  updateForm({
    start_date: modelData[0],
    end_date: modelData[1] || modelData[0],
  })
}

const updateForm = (data) => {
  model.value = {
    ...model.value,
    ...data,
  }
  // trigger only "field" changed validations validations
  Object.keys(data).forEach((key) => {
    v$.value[key]?.$touch()
  })
}
const updateLocation = (location) => {
  updateForm({ location })
  closeModals('LocationDrawer', 'LocationForm')
}
</script>
<style lang="scss" scoped>
.list-container {
  gap: 2rem;
}

.event-location {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
