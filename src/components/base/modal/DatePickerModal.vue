<script setup lang="ts">
import '@vuepic/vue-datepicker/dist/main.css'

import LpiButton from '@/components/base/button/LpiButton.vue'
import DisplayDate from '@/components/base/DisplayDate.vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import { isNil } from 'es-toolkit'

const props = defineProps<{
  modelValue: any
}>()
const model = ref(props.modelValue)

const attrs = useAttrs()

const { locale } = useNuxtI18n()
const emit = defineEmits<{
  'update:model-value': [any]
  close: []
}>()

const UI = Object.freeze({
  navBtnNext: 'custom-navBtnNext',
  navBtnPrev: 'custom-navBtnPrev',
  calendar: 'custom-calendar',
  calendarCell: 'custom-calendarCell',
  menu: 'custom-menu',
  input: 'custom-input',
})

const resetHoursDate = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const internalModelValue = ref()

const isDifferentDate = (date, date2): boolean => {
  return resetHoursDate(date).getTime() !== resetHoursDate(date2).getTime()
}

const onValue = (value: string) => {
  internalModelValue.value = resetHoursDate(value)
}

const onArrayValue = (values: string[]) => {
  const final = []
  if (!internalModelValue.value) {
    internalModelValue.value = [...toRaw(values)]
  }

  if (isDifferentDate(internalModelValue.value[0], values[0])) {
    final[0] = resetHoursDate(values[0])
  } else {
    final[0] = values[0]
  }

  if (values[1] && isDifferentDate(internalModelValue.value[1], values[1])) {
    final[1] = resetHoursDate(values[1])
  } else {
    final[1] = values[1]
  }

  internalModelValue.value = final
}

const onInternalValueUpdate = (value) => {
  if (Array.isArray(value)) {
    onArrayValue(value)
  } else {
    onValue(value)
  }
}

const SATURDAY = 5
const SUNDAY = 6
const WEEK_DAYS = [SATURDAY, SUNDAY]

const onSubmit = () => {
  emit('update:model-value', internalModelValue.value)
  emit('close')
}

const onTimePickerOpen = () => {}

const dataPickerRef = useTemplateRef('dataPickerRef')

const timeView = ref(false)
const onClock = () => {
  if (timeView.value === false) {
    timeView.value = true
    dataPickerRef.value.switchView('time')
  } else {
    timeView.value = false
    dataPickerRef.value.switchView('calendar')
  }
}
</script>

<template>
  <DialogModal is-small @close="$emit('close')" @submit="onSubmit">
    <template #header>
      <h3>
        <IconImage class="icon" name="Calendar" />
        {{ $t('common.chose-date') }}
      </h3>
    </template>
    <template #body>
      <div class="custom-vue-picker">
        <div>
          <VueDatePicker
            ref="dataPickerRef"
            v-bind="attrs"
            v-model="model"
            inline
            :locale="locale"
            :ui="UI"
            :action-row="{
              showSelect: false,
              showCancel: false,
              showNow: false,
              showPreview: false,
            }"
            :multi-calendars="!isNil(attrs.range) ? { static: false } : undefined"
            @internal-model-change="onInternalValueUpdate"
            @time-picker-open="onTimePickerOpen"
          >
            <!-- add 'red' color in week day -->
            <template #calendar-header="{ index, day }">
              <div :class="WEEK_DAYS.includes(index) ? 'custom-day' : ''">
                {{ day }}
              </div>
            </template>

            <!-- custom icons -->
            <template #calendar-icon>
              <IconImage name="Calendar" />
            </template>
            <template #clock-icon>
              <IconImage name="Clock" />
            </template>
          </VueDatePicker>
        </div>
        <LpiButton
          v-if="attrs.enableTimePicker !== false"
          :label="timeView ? $t('common.close') : $t('common.add-time')"
          btn-icon="Clock"
          @click="onClock"
        />
        <div class="display-date">
          <DisplayDate :date="internalModelValue" />
        </div>
      </div>
    </template>
  </DialogModal>
</template>

<style lang="scss">
.custom-vue-picker {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .dp__theme_light {
    --dp-range-between-dates-background-color: color-mix(
      in srgb,
      var(--primary-light),
      transparent 50%
    ) !important;
    --dp-range-between-dates-text-color: black !important;
    --dp-primary-color: var(--primary-dark) !important;
    --dp-hover-color: var(--primary-dark);
    --dp-hover-text-color: white;
  }

  .custom-navBtnNext,
  .custom-navBtnPrev {
    border-radius: 100%;
    background-color: var(--primary-dark);

    svg {
      fill: white;
    }

    &:hover {
      transform: scale(1.1);
    }
  }

  .custom-menu {
    border: none !important;
  }

  .custom-input {
    background-color: red;
  }

  .custom-footer {
    width: 100%;
  }

  .custom-day {
    color: color-mix(in srgb, var(--primary-dark), transparent 10%);
  }

  button[data-test-id='open-time-picker-btn'] {
    display: none;
  }

  .dp--tp-wrap {
    .dp__btn.dp__button {
      display: none;
    }
  }
}

.display-date {
  padding: 1rem 0;
  font-size: large;
}
</style>
