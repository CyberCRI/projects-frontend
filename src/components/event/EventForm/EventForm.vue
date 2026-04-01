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

    <DateField
      :label="$t('event.form.event_date.label')"
      range
      time-picker
      :model-value="datePickerValue"
      :errors="v$.start_date.$errors"
      @update:model-value="onDateSelected"
    />

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

    <div class="form-section">
      <label>{{ $t('event.form.visibility.label') }}</label>
      <LpiCheckbox v-model="model.visible_by_all" :label="$t('event.form.visibility.notice')" />
    </div>

    <div v-if="selectedGroup" class="form-section">
      <label>{{ $t('event.form.people_groups.label') }}</label>
      <p class="notice">
        {{ $t('event.form.people_groups.notice') }}
      </p>

      <MultiGroupPicker
        :model-value="model.people_groups"
        @update:model-value="updateForm({ people_groups: $event })"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import TextInput from '@/components/base/form/TextInput.vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import MultiGroupPicker from '@/components/group/MultiGroupPicker/MultiGroupPicker.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import { LocationType } from '@/models/types'
import { EventForm } from '@/models/event.model'
import { defaultForm } from '@/form/event'
import DateField from '@/components/base/form/DateField.vue'

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

const { stateModals, openModals, closeModals } = useModals({
  LocationForm: false,
  LocationDrawer: false,
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
}
const updateLocation = (location) => {
  updateForm({ location })
  closeModals('LocationDrawer', 'LocationForm')
}
</script>
<style lang="scss" scoped>
.form-section + .form-section {
  margin-top: $space-xl;
}

.form-section {
  position: relative;
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
