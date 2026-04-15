<script setup lang="ts">
withDefaults(
  defineProps<{
    timePicker?: boolean
    range?: boolean
    label: string
    errors?: any[]
  }>(),
  {
    timePicker: false,
    range: false,
    errors: () => [],
  }
)

const model = defineModel<Date | string | Date[] | string[]>()

const { stateModal, toggleModal, closeModal } = useModal()

const clearDate = () => {
  if (Array.isArray(model.value)) {
    model.value = []
  } else {
    model.value = null
  }
}

const dateExist = computed(() => {
  if (Array.isArray(model.value)) {
    return model.value.filter((d) => d).length !== 0
  }

  return !!model.value
})
</script>

<template>
  <div class="form-section">
    <label>{{ label }}</label>
    <button type="button" class="date-btn scale-hover" @click="toggleModal">
      <IconImage class="icon" name="Calendar" />
      {{ $t('invitation.create.field.validity.pick-date') }}
    </button>
    <button
      type="button"
      class="date-btn clear-btn scale-hover"
      :class="{
        'no-date': !dateExist,
      }"
      :aria-label="$t('common.clear-date')"
      @click="clearDate"
    >
      <IconImage class="icon" name="Close" />
    </button>

    <DisplayDate class="display-date" :date="model" :time="timePicker ? 'auto' : false" />

    <DatePickerModal
      v-if="stateModal"
      v-model="model"
      :range="range"
      :time-picker="timePicker"
      @close="nextTick(closeModal)"
    />

    <FieldErrors :errors="errors" />
  </div>
</template>

<style lang="scss" scoped>
.date-btn {
  padding: $space-s;
  background-color: $white;
  border: $border-width-s solid $primary-dark;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
  gap: $space-m;
  color: $primary-dark;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  .icon {
    width: $layout-size-2xl;
    fill: $primary-dark;
  }

  &:not(.clear-btn) {
    border-top-left-radius: $border-radius-s;
    border-bottom-left-radius: $border-radius-s;
  }

  &:has(~ .clear-btn.no-date) {
    border-top-right-radius: $border-radius-s;
    border-bottom-right-radius: $border-radius-s;
  }

  &.clear-btn {
    background-color: var(--primary-dark);
    border-top-right-radius: $border-radius-s;
    border-bottom-right-radius: $border-radius-s;

    .icon {
      fill: var(--white);
    }

    &.no-date {
      transform: scaleX(0);
      transform-origin: left;
    }
  }
}

.display-date {
  margin-left: 0.5rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
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
</style>
