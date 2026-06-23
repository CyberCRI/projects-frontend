<template>
  <Field
    :disabled="disabled"
    :label="label"
    :help="help"
    :required="required"
    :errors="errors"
    :bottom-text="bottomText"
    :big-input="bigInput"
  >
    <template v-if="$slots.default" #label>
      <slot />
    </template>

    <textarea
      v-if="inputType === 'textarea'"
      :id="inputId || (label ? randomId : null)"
      ref="inputField"
      v-model="model"
      v-disable-focus="unfocusable"
      :placeholder="placeholder"
      :data-test="dataTest"
      :maxlength="maxLength"
      :rows="rows"
      class="skeletons-background"
      @keydown.enter="$emit('enter')"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />

    <span
      v-else
      class="input-wrapper skeletons-background"
      :class="{ 'is-password': inputType == 'password' }"
    >
      <input
        :id="inputId || (label ? randomId : null)"
        ref="inputField"
        v-model="model"
        v-disable-focus="unfocusable"
        :placeholder="placeholder"
        :type="typeOverride || inputType || 'text'"
        :disabled="disabled"
        :data-test="dataTest"
        :maxlength="maxLength"
        :list="suggestionListId"
        @change="$emit('change', $event)"
        @keydown.enter="$emit('enter')"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
      <IconImage
        v-if="inputType === 'password'"
        class="show-password"
        :name="typeOverride ? 'Eye' : 'EyeSlash'"
        @click="typeOverride = typeOverride ? null : 'text'"
      />
    </span>
  </Field>
</template>

<script setup lang="ts">
import IconImage from '~/components/base/media/IconImage.vue'
import Field from '~/components/base/form/Field.vue'
import type { ErrorObject } from '@vuelidate/core'
import type { Events } from 'vue'

const props = withDefaults(
  defineProps<{
    autofocus?: boolean
    placeholder?: string
    label?: string
    help?: string
    bottomText?: string
    inputId?: string
    inputType?: string
    bigInput?: boolean
    unfocusable?: boolean
    dataTest?: string
    disabled?: boolean
    maxLength?: number
    required?: boolean
    rows?: number
    errors?: ErrorObject[]
    suggestionListId?: string
  }>(),
  {
    autofocus: false,
    placeholder: '',
    label: null,
    help: null,
    bottomText: null,
    inputId: '',
    inputType: 'text',
    required: false,
    bigInput: false,
    unfocusable: false,
    dataTest: 'input-field',
    disabled: false,
    maxLength: null,
    rows: 3,
    suggestionListId: '',
    errors: () => [],
  }
)

const model = defineModel<string>({ default: '' })

defineEmits<{
  enter: []
  focus: [Events['onFocus']]
  blur: [Events['onBlur']]
  change: [Events['onChange']]
}>()

const randomId = useUniqueId()
const typeOverride = ref(null)

const inputFieldRef = useTemplateRef('inputField')

watchEffect(() => {
  if (props.autofocus) {
    nextTick(() => inputFieldRef.value?.focus())
  }
})
</script>

<style lang="scss" scoped>
.input-wrapper {
  width: 100%;

  &.is-password {
    position: relative;

    input {
      padding-right: 2rem;
    }

    .show-password {
      position: absolute;
      z-index: 10;
      right: 0;
      top: 50%;
      transform: translate(-20%, -50%);
      height: 60%;
      fill: $primary-dark;
      cursor: pointer;
    }
  }
}

input,
textarea {
  padding: 10px;
  font-size: 1em;
  box-sizing: border-box;
  width: 100%;
  border-radius: $border-radius-s;
  background: $white;
  border: $border-width-s solid $light-gray;
  color: $black;
}

textarea {
  border-bottom-right-radius: $border-radius-s;
}

::placeholder {
  color: $mid-gray;
}
</style>
