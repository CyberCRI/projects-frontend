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
        @update:model-value="updateForm({ content: $event })"
      />
    </div>
    <div class="form-section">
      <label>{{ $t('event.form.event_date.label') }}</label>
      <button type="button" class="date-btn" @click="toggleModals('DatePicker')">
        <IconImage class="icon" name="Calendar" />
        {{ $t('invitation.create.field.validity.pick-date') }}
      </button>

      <span v-if="model.start_date || model.end_date" class="date-preview">
        <time class="date-preview-start" :datetime="d(model.start_date)">
          {{ displayedDate[0] }}
        </time>
        <template v-if="displayedDate[1]">
          <span class="date-separator">
            {{ '-' }}
          </span>
          <time class="date-preview-end" :datetime="d(model.end_date)">
            {{ displayedDate[1] }}
          </time>
        </template>
      </span>

      <VueDatePicker
        v-if="stateModals.DatePicker"
        range
        inline
        :model-value="datePickerValue"
        :locale="locale"
        :on-click-outside="() => closeModals('DatePicker')"
        @update:model-value="onDateSelected"
      />

      <FieldErrors :errors="v$.start_date.$errors" />
    </div>

    <div class="form-section">
      <!-- locations -->
      <div class="event-location">
        <label>
          {{ $t('event.location') }}
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
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import IconImage from '@/components/base/media/IconImage.vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import MultiGroupPicker from '@/components/group/MultiGroupPicker/MultiGroupPicker.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import { LocationType } from '@/models/types'
import { isNil } from 'es-toolkit'
import { EventForm } from '@/models/event.model'
import { defaultForm } from '@/form/event'

withDefaults(
  defineProps<{
    selectedGroup?: boolean
  }>(),
  {
    selectedGroup: true,
  }
)
const { t, d, locale } = useNuxtI18n()
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
  return [new Date(model.value.start_date) || null, new Date(model.value.end_date) || null]
})

const displayedDate = computed(() => {
  return datePickerValue.value
    .filter((v) => !isNil(v))
    .map((date) => {
      return new Date(date).toLocaleDateString(locale.value, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })
    })
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
  updateForm({ start_date: modelData[0], end_date: modelData[1] })
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
.loader-ctn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5rem 0;
}

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

.date-preview {
  margin-left: $space-l;
  display: inline-flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;

  .date-separator {
    padding-left: 0.06rem;
  }

  time {
    font-style: italic;
    opacity: 0.8;
    letter-spacing: -0.04rem;
  }
}

.event-location {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
