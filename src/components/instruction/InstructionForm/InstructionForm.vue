<template>
  <form>
    <div class="form-section">
      <TextInput
        :model-value="modelValue.title"
        :label="$t('instructions.form.title.label')"
        :placeholder="$t('instructions.form.title.placeholder')"
        class="input-field"
        @update:model-value="updateForm({ title: $event })"
        @blur="v$.modelValue.title.$validate"
      />
      <FieldErrors :errors="v$.modelValue.title.$errors" />
    </div>

    <div class="form-section">
      <label>{{ $t('instructions.form.publication_date.label') }}</label>
      <button type="button" class="date-btn" @click="showDatePicker = true">
        <IconImage class="icon" name="Calendar" />
        {{ $t('invitation.create.field.validity.pick-date') }}
      </button>

      <span v-if="modelValue.publication_date" class="date-preview">{{ displayedDate }}</span>
      <VueDatePicker
        v-if="showDatePicker"
        :on-click-outside="() => (showDatePicker = false)"
        :inline="true"
        :auto-apply="true"
        :model-value="modelValue.publication_date"
        :enable-time-picker="false"
        @update:model-value="onDateSelected"
      />

      <FieldErrors :errors="v$.modelValue.publication_date.$errors" />
    </div>

    <div class="form-section">
      <label>{{ $t('instructions.form.content.label') }}</label>
      <TipTapEditor
        ref="tiptapEditor"
        :model-value="modelValue.content"
        :save-image-callback="saveOrganizationImage"
        class="input-field content-editor no-max-height"
        mode="full"
        @update:model-value="updateForm({ content: $event })"
        @blur="v$.modelValue.content.$validate"
      />

      <FieldErrors :errors="v$.modelValue.content.$errors" />
    </div>
    <div class="form-section">
      <label>{{ $t('instructions.form.groups.label') }}</label>
      <p class="notice">
        {{ $t('instructions.form.groups.notice') }}
      </p>

      <MultiGroupPicker
        has-public-field
        :is-public="modelValue.visible_by_all"
        :model-value="modelValue.people_groups"
        @update:is-public="updateForm({ visible_by_all: $event })"
        @update:model-value="updateForm({ people_groups: $event })"
      />
    </div>
    <div class="form-section">
      <label>{{ $t('instructions.form.notify.label') }}</label>
      <p class="notice">
        {{ $t('instructions.form.notify.notice') }}
      </p>

      <button type="button" class="date-btn" @click="toggleNotify">
        <IconImage
          class="icon"
          :name="modelValue.has_to_be_notified ? 'SquareRounded' : 'SquareRoundedOutline'"
        />
        {{ $t('instructions.form.notify.button') }}
      </button>
    </div>
  </form>
</template>

<script>
import TipTapEditor from '@/components/base/form/TextEditor/TipTapEditor.vue'
import TextInput from '@/components/base/form/TextInput.vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required } from '@vuelidate/validators'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import IconImage from '@/components/base/media/IconImage.vue'
import MultiGroupPicker from '@/components/group/MultiGroupPicker/MultiGroupPicker.vue'
import FieldErrors from '@/components/base/form/FieldErrors.vue'
import { postOrganizationImage } from '@/api/organizations.service.ts'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

export function defaultForm() {
  return {
    title: '',
    content: '<p></p>',
    publication_date: new Date().toISOString(),
    has_to_be_notified: false,
    people_groups: {},
    visible_by_all: true,
  }
}

export default {
  name: 'InstructionForm',

  components: {
    TextInput,
    TipTapEditor,
    VueDatePicker,
    IconImage,
    MultiGroupPicker,
    FieldErrors,
  },
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },

  emits: ['update:modelValue', 'invalid'],
  setup() {
    const organizationsStore = useOrganizationsStore()
    return {
      organizationsStore,
    }
  },

  data() {
    return {
      v$: useVuelidate(),
      showDatePicker: false,
    }
  },

  computed: {
    displayedDate() {
      return this.modelValue.publication_date
        ? this.$d(new Date(this.modelValue.publication_date))
        : ''
    },
    organization() {
      return this.organizationsStore.current
    },
  },

  watch: {
    'v$.$invalid'(isInvalid) {
      this.$emit('invalid', isInvalid)
    },
  },
  validations() {
    return {
      modelValue: {
        title: {
          required: helpers.withMessage(this.$t('instructions.form.title.required'), required),
        },
        content: {
          required: helpers.withMessage(this.$t('instructions.form.content.required'), required),
        },
        publication_date: {
          required: helpers.withMessage(
            this.$t('instructions.form.publication_date.required'),
            required
          ),
        },
      },
    }
  },

  methods: {
    saveOrganizationImage(file) {
      const formData = new FormData()
      formData.append('file', file, file.name)
      return postOrganizationImage({
        orgCode: this.organization.code,
        body: formData,
      })
    },
    onDateSelected(modelData) {
      this.updateForm({ publication_date: modelData })
      this.showDatePicker = false
    },

    updateForm(data) {
      this.$emit('update:modelValue', { ...this.modelValue, ...data })
    },
    toggleNotify() {
      this.updateForm({ has_to_be_notified: !this.modelValue.has_to_be_notified })
    },
  },
}
</script>

<style lang="scss" scoped>
.input-field {
  margin: $space-l;
  margin-bottom: $space-xs;
}

.content-editor {
  flex-grow: 1;
  min-height: pxToRem(300px);
}

.date-preview {
  margin-left: $space-l;
  display: inline-block;
  font-size: 1.2rem;
  font-weight: 700;
}

.img-ctn {
  margin-bottom: $space-xl;
  display: flex;
  flex-direction: column;
  align-items: center;

  label {
    align-self: flex-start;
  }
}

.form-section + .form-section {
  margin-top: $space-xl;
}

label {
  font-size: 0.875rem;
  font-weight: bold;
  color: $black;
  display: block;
}

label,
.notice {
  margin-bottom: $space-l !important;
}

// TODO fix cleanly
:deep(.input-ctn),
:deep(.input-field) {
  margin: 0;
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
  cursor: pointer;

  .icon {
    width: $layout-size-2xl;
    fill: $primary-dark;
  }
}
</style>
