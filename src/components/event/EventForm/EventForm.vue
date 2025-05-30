<template>
  <form>
    <div class="form-section">
      <label>{{ $t('event.form.title.label') }}</label>
      <TextInput
        input-type="text"
        label=""
        :model-value="modelValue.title"
        :placeholder="$t('event.form.title.placeholder')"
        @update:model-value="updateForm({ title: $event })"
        @blur="v$.modelValue.title.$validate"
      />
      <FieldErrors :errors="v$.modelValue.title.$errors" />
    </div>
    <div class="form-section">
      <label>{{ $t('event.form.content.label') }}</label>

      <TipTapEditor
        ref="tiptapEditor"
        :model-value="modelValue.content"
        class="input-field content-editor no-max-height"
        @update:model-value="updateForm({ content: $event })"
      />
    </div>
    <div class="form-section">
      <label>{{ $t('event.form.event_date.label') }}</label>
      <button type="button" class="date-btn" @click="showDatePicker = true">
        <IconImage class="icon" name="Calendar" />
        {{ $t('invitation.create.field.validity.pick-date') }}
      </button>

      <span v-if="modelValue.event_date" class="date-preview">{{ displayedDate }}</span>
      <VueDatePicker
        v-if="showDatePicker"
        :on-click-outside="() => (showDatePicker = false)"
        :inline="true"
        :auto-apply="true"
        :model-value="modelValue.event_date"
        :enable-time-picker="false"
        @update:model-value="onDateSelected"
      />

      <FieldErrors :errors="v$.modelValue.event_date.$errors" />
    </div>
    <div class="form-section">
      <label>{{ $t('event.form.people_groups.label') }}</label>
      <p class="notice">
        {{ $t('event.form.people_groups.notice') }}
      </p>

      <MultiGroupPicker
        has-public-field
        :is-public="modelValue.visible_by_all"
        :model-value="modelValue.people_groups"
        @update:is-public="updateForm({ visible_by_all: $event })"
        @update:model-value="updateForm({ people_groups: $event })"
      />
    </div>
  </form>
</template>
<script>
import TextInput from '@/components/base/form/TextInput.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import IconImage from '@/components/base/media/IconImage.vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import MultiGroupPicker from '@/components/group/MultiGroupPicker/MultiGroupPicker.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'

export function defaultForm() {
  return {
    title: '',
    content: '<p></p>',
    event_date: '',
    people_groups: {},
    visible_by_all: true,
  }
}

export default {
  name: 'EventForm',

  components: {
    TextInput,
    VueDatePicker,
    IconImage,
    MultiGroupPicker,
    FieldErrors,
    TipTapEditor,
  },

  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },

  emits: ['update:modelValue', 'invalid'],

  data() {
    return {
      showDatePicker: false,
      v$: useVuelidate(),
    }
  },

  validations() {
    return {
      modelValue: {
        title: {
          required: helpers.withMessage(this.$t('event.form.title.required'), required),
        },
        event_date: {
          required: helpers.withMessage(this.$t('event.form.event_date.required'), required),
        },
      },
    }
  },

  computed: {
    displayedDate() {
      return this.modelValue.event_date ? this.$d(new Date(this.modelValue.event_date)) : ''
    },
  },

  watch: {
    'v$.$invalid'(value) {
      this.$emit('invalid', value)
    },
  },

  methods: {
    onDateSelected(modelData) {
      this.updateForm({ event_date: modelData })
      this.showDatePicker = false
    },

    updateForm(data) {
      this.$emit('update:modelValue', { ...this.modelValue, ...data })
    },
  },
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
  display: inline-block;
  font-size: 1.2rem;
  font-weight: 700;
}
</style>
