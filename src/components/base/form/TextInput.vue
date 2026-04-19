<template>
  <div :class="{ 'big-input': bigInput, disabled: disabled }" class="input-ctn">
    <label v-if="label" :for="inputId || randomId">{{ label }}</label>
    <slot v-else />

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
      @keydown.enter="$emit('enter')"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />

    <span v-else class="input-wrapper" :class="{ 'is-password': inputType == 'password' }">
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

    <small v-if="bottomText">{{ bottomText }}</small>

    <FieldErrors :errors="errors" />
  </div>
</template>

<script setup lang="ts">
import type FieldErrors from '~/components/base/form/FieldErrors.vue'
import IconImage from '~/components/base/media/IconImage.vue'
import type { ErrorObject } from '@vuelidate/core'
import type { Events } from 'vue'

const props = withDefaults(
  defineProps<{
    autofocus?: boolean
    placeholder?: string
    label?: string
    bottomText?: string
    inputId?: string
    inputType?: string
    bigInput?: boolean
    unfocusable?: boolean
    dataTest?: string
    disabled?: boolean
    maxLength?: number
    rows?: number
    errors?: ErrorObject[]
    suggestionListId?: string
  }>(),
  {
    autofocus: false,
    placeholder: '',
    label: null,
    bottomText: null,
    inputId: '',
    inputType: 'text',
    bigInput: false,
    unfocusable: false,
    dataTest: 'input-field',
    disabled: false,
    maxLength: null,
    rows: 3,
    suggestionListId: ''
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
onMounted(() => {
  if (props.autofocus) {
    nextTick(() => inputFieldRef.value?.focus())
  }
})
</script>

<style lang="scss" scoped>
.input-ctn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

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

  label {
    font-size: $font-size-s;
    font-weight: bold;
    margin-bottom: $space-m;
    color: $black;

    &.large-space {
      margin-bottom: $space-l;
    }
  }

  small {
    font-size: $font-size-xs;
    align-self: flex-end;
    color: $black;
  }

  &.disabled {
    input {
      color: $light-gray;
    }

    label {
      color: $light-gray;
    }

    small {
      color: $light-gray;
    }
  }

  &.big-input input {
    height: 60px;
    border-radius: 35px;
    font-size: $font-size-3xl;
    line-height: 1;
  }

  @media screen and (min-width: $min-tablet) {
    &.big-input input {
      height: 90px;
      font-size: $font-size-5xl;
      line-height: 1;
      border-radius: $border-radius-s;
    }
  }
}
</style>
