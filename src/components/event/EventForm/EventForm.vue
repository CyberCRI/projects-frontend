<template>
  <form>
    <div class="form-section">
      <label>{{ $t('event.form.title.label') }}</label>
      <TextInput
        input-type="text"
        label=""
        :model-value="model.title"
        :placeholder="$t('event.form.title.placeholder')"
        @update:model-value="updateForm({ title: $event })"
        @blur="v$.title.$validate"
      />
      <FieldErrors :errors="v$.title.$errors" />
    </div>
    <div class="form-section">
      <label>{{ $t('event.form.content.label') }}</label>

      <TipTapEditor
        ref="tiptapEditor"
        :model-value="model.content"
        class="input-field content-editor no-max-height"
        mode="full"
        @update:model-value="updateForm({ content: $event })"
      />
    </div>
    <div class="form-section">
      <label>{{ $t('event.form.event_date.label') }}</label>
      <button type="button" class="date-btn" @click="toggleModals('DatePicker')">
        <IconImage class="icon" name="Calendar" />
        {{ $t('invitation.create.field.validity.pick-date') }}
      </button>

      <DisplayDate :date="[model.start_date, model.end_date]" />

      <!-- disable our/minutes if not  -->
      <DatePickerModal
        v-if="stateModals.DatePicker"
        range
        :minutes-increment="15"
        :minutes-grid-increment="15"
        :time-config="{ timePickerInline: true }"
        :start-time="{ hours: 0, minutes: 0 }"
        :model-value="datePickerValue"
        @update:model-value="onDateSelected"
        @close="closeModals('DatePicker')"
      />

      <FieldErrors :errors="v$.start_date.$errors" />
    </div>

    <div class="form-section">
      <!-- locations -->
      <div v-if="!model.location" class="event-location">
        <label>
          {{ $t('location.default-title') }}
        </label>
        <LpiButton
          class="add-btn"
          :btn-icon="model.location ? 'Pen' : 'Plus'"
          data-test="add-location"
          :label="$t(model.location ? 'group.form.edit' : 'group.form.add')"
          @click="openModals('LocationDrawer')"
        />
      </div>
      <LocationList
        :locations="model.location ? [model.location] : []"
        editable
        :focus="false"
        @edit="openModals('LocationForm')"
        @delete="updateLocation(null)"
      />
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

    <div v-if="selectedGroup" class="form-section">
      <label>{{ $t('event.form.people_groups.label') }}</label>
      <p class="notice">
        {{ $t('event.form.people_groups.notice') }}
      </p>

      <MultiGroupPicker
        has-public-field
        :is-public="model.visible_by_all"
        :model-value="model.people_groups"
        @update:is-public="updateForm({ visible_by_all: $event })"
        @update:model-value="updateForm({ people_groups: $event })"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import TextInput from '@/components/base/form/TextInput.vue'
import '@vuepic/vue-datepicker/dist/main.css'
import IconImage from '@/components/base/media/IconImage.vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import MultiGroupPicker from '@/components/group/MultiGroupPicker/MultiGroupPicker.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import { LocationType } from '@/models/types'
import { EventForm } from '@/models/event.model'
import { defaultForm, sanitizeDate } from '@/form/event'
import { nowDate } from '@/functs/date'
import DatePickerModal from '@/components/base/modal/DatePickerModal.vue'
import DisplayDate from '@/components/base/DisplayDate.vue'

withDefaults(
  defineProps<{
    selectedGroup?: boolean
  }>(),
  {
    selectedGroup: true,
  }
)
const { t } = useNuxtI18n()
const model = defineModel<EventForm>({ default: defaultForm() })
const emit = defineEmits<{
  invalid: [boolean]
}>()

const { stateModals, openModals, closeModals, toggleModals } = useModals({
  LocationForm: false,
  LocationDrawer: false,
  DatePicker: false,
})

const LOCATION_TYPES: LocationType[] = ['event']

const rules = computed(() => ({
  title: {
    required: helpers.withMessage(t('event.form.title.required'), required),
  },
  start_date: {
    required: helpers.withMessage(t('event.form.event_date.required'), required),
  },
}))

const datePickerValue = computed(() => {
  const start = model.value.start_date ? new Date(model.value.start_date) : nowDate()
  const end = model.value.end_date ? new Date(model.value.end_date) : start
  return [start, end].map((date) => sanitizeDate(date))
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
    start_date: sanitizeDate(modelData[0]),
    end_date: sanitizeDate(modelData[1] || modelData[0]),
  })
  closeModals('DatePicker')
}

const updateForm = (data) => {
  model.value = {
    ...model.value,
    ...data,
  }
}
const updateLocation = (location) => {
  updateForm({ location })
  closeModals('LocationDrawer', 'LocationForm')
}
</script>
<style lang="scss" scoped>
.date-btn {
  padding: $space-s;
  background-color: $white;
  border: $border-width-s solid $primary-dark;
  border-radius: $border-radius-s;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  gap: $space-m;
  color: $primary-dark;
  font-weight: 700;

  .icon {
    width: $layout-size-2xl;
    fill: $primary-dark;
  }
}

.form-section + .form-section {
  margin-top: $space-xl;
}

.form-section {
  position: relative;
}

.datepicker-container {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
}

label {
  font-size: $font-size-s;
  font-weight: 700;
  color: $black;
  display: block;
}

label,
.notice {
  margin-bottom: $space-l !important;
}

.event-location {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
