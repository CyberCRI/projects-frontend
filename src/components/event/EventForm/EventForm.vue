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

      <span v-if="model.event_date" class="date-preview">
        <time class="date-preview-start" :datetime="d(model.event_date)">
          {{ displayedDate }}
        </time>
      </span>

      <!-- disable our/minutes if not  -->
      <VueDatePicker
        v-if="stateModals.DatePicker"
        inline
        :model-value="datePickerValue"
        :locale="locale"
        :on-click-outside="() => closeModals('DatePicker')"
        @update:model-value="onDateSelected"
      />

      <FieldErrors :errors="v$.event_date.$errors" />
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
  DatePicker: false,
})

const rules = computed(() => ({
  title: {
    required: helpers.withMessage(t('event.form.title.required'), required),
  },
  event_date: {
    required: helpers.withMessage(t('event.form.event_date.required'), required),
  },
}))

const datePickerValue = computed(() =>
  model.value.event_date ? new Date(model.value.event_date) : new Date()
)

const displayedDate = computed(() => {
  return new Date(datePickerValue.value).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
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
  updateForm({ event_date: modelData[0], end_date: modelData[1] })
  closeModals('DatePicker')
}

const updateForm = (data) => {
  model.value = {
    ...model.value,
    ...data,
  }
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
</style>
