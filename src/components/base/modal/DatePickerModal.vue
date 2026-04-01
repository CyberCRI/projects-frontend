<script setup lang="ts">
import '@vuepic/vue-datepicker/dist/main.css'

import LpiButton from '@/components/base/button/LpiButton.vue'
import DisplayDate from '@/components/base/DisplayDate.vue'
import { dateWithoutHours, mergeTime, sanitizeDate } from '@/functs/date'
import { InternalModelValue, VueDatePicker } from '@vuepic/vue-datepicker'
import { enUS, fr, ca, de, es, et, nl } from 'date-fns/locale'

// mapping datefn locale for datepicker (calendar are correct name/type from locale)
const LOCALES = {
  ca,
  de,
  en: enUS,
  es,
  et,
  fr,
  nl,
}
const { locale } = useNuxtI18n()
// get datefns from locale value
const localeDateFn = computed(() => LOCALES[locale.value] ?? LOCALES.en)

// change style for week days in calendar
const SATURDAY = 5
const SUNDAY = 6
const WEEK_DAYS = [SATURDAY, SUNDAY]

// add clss class for each ui in datepicker
const UI = Object.freeze({
  navBtnNext: 'custom-navBtnNext',
  navBtnPrev: 'custom-navBtnPrev',
  calendar: 'custom-calendar',
  calendarCell: 'custom-calendarCell',
  menu: 'custom-menu',
  input: 'custom-input',
})

const { stateModal, toggleModal } = useModal()
const props = withDefaults(
  defineProps<{
    range?: boolean
    timePicker?: boolean
  }>(),
  {
    range: false,
    timePicker: false,
  }
)
const emit = defineEmits(['close'])

// model defined from v-model in prent
const model = defineModel<string | Date | string[] | Date[]>()

// locale model to not change parent model during select date/time
const localeModel = ref()

// when v-model updated, reset localeModel
watch(
  model,
  () => {
    localeModel.value = (props.range ? model.value : [model.value]) as string[] | Date[]
  },
  { immediate: true }
)

// convert date to "time" object for timepicker
const toTime = (date) => ({
  hours: date?.getHours(),
  minutes: date?.getMinutes(),
})
const modelTime = computed(() => [
  toTime(localeModel.value[0]),
  toTime(localeModel.value[1] ?? localeModel.value[0]),
])

const date = (date): number => dateWithoutHours(date).getTime()
const time = (date): number => {
  const d = new Date(date)
  return d.getHours() * 3600 + d.getMinutes()
}

const noDateSelected = computed(() => localeModel.value.filter((v) => v).length === 0)
const asTimeSelected = computed(() => {
  if (noDateSelected.value) {
    return false
  }
  return time(localeModel.value[0]) || (localeModel.value[1] && time(localeModel.value[1]))
})

// final confirm, change parent v-model
const onSubmit = () => {
  const modelRaw = toRaw(localeModel.value)
  model.value = props.range ? modelRaw : modelRaw[0]
  emit('close')
}

// interval value in datepicker change, check if not change to not trigger v-model update
const onUpdateDate = (values: InternalModelValue) => {
  const newValues = (props.range ? toRaw(values) : [toRaw(values)]) as Date[]

  if (!localeModel.value) {
    localeModel.value = newValues
    return
  }

  const current = toRaw(localeModel.value) as Date[]

  // comapre if date is different, set withtout hours/minutes
  if (date(current[0]) !== date(newValues[0])) {
    localeModel.value[0] = dateWithoutHours(newValues[0])

    // if time is different (but date is same), sanitize date
  } else if (time(current[0]) !== time(newValues[0])) {
    localeModel.value[0] = sanitizeDate(newValues[0])
  }

  // same as above but check if value is not null
  if (newValues[1]) {
    if (date(current[1]) !== date(newValues[1])) {
      localeModel.value[1] = dateWithoutHours(newValues[1])
    } else if (time(current[1]) !== time(newValues[1])) {
      localeModel.value[1] = sanitizeDate(newValues[1])
    }

    // if end date is remove
  } else if (current[1]) {
    localeModel.value.slice()
    localeModel.value = localeModel.value.slice(0, 1)
  }
}

const onStartTimeUpdate = (dateTime) => {
  dateTime = sanitizeDate(toRaw(dateTime))
  // same time, ignore it
  if (time(dateTime) == time(localeModel.value[0])) {
    return
  }

  const finalDateTime = mergeTime(localeModel.value[0], dateTime)

  if (localeModel.value[1]) {
    const endTime = new Date(toRaw(localeModel.value[1]))
    // only change time in end if date is different
    if (date(endTime) == date(finalDateTime)) {
      if (finalDateTime.getHours() > endTime.getHours()) {
        endTime.setHours(finalDateTime.getHours(), endTime.getMinutes(), 0, 0)
      }

      if (finalDateTime.getMinutes() > endTime.getMinutes()) {
        endTime.setHours(endTime.getHours(), finalDateTime.getMinutes(), 0, 0)
      }

      localeModel.value[1] = sanitizeDate(endTime)
    }
  }

  localeModel.value[0] = finalDateTime
  localeModel.value[1] ??= localeModel.value[0]
}

const onEndTimeUpdate = (dateTime) => {
  dateTime = toRaw(dateTime)
  if (time(dateTime) !== time(toRaw(localeModel.value[1]))) {
    const finalDateTime = sanitizeDate(
      mergeTime(localeModel.value[1] ?? localeModel.value[0], dateTime)
    )

    const startTime = new Date(toRaw(localeModel.value[0]))
    // only change time in start if date is different
    if (date(startTime) == date(finalDateTime)) {
      if (finalDateTime.getHours() < startTime.getHours()) {
        startTime.setHours(finalDateTime.getHours(), startTime.getMinutes(), 0, 0)
      }

      if (finalDateTime.getMinutes() < startTime.getMinutes()) {
        startTime.setHours(startTime.getHours(), finalDateTime.getMinutes(), 0, 0)
      }

      localeModel.value[0] = sanitizeDate(startTime)
    }

    localeModel.value[1] = finalDateTime
  }
}

// reset hours/minutes
const resetTime = () => {
  const values = toRaw(localeModel.value).map(dateWithoutHours)
  localeModel.value = values
}
</script>

<template>
  <DialogModal is-small @close="$emit('close')" @submit="onSubmit">
    <template #header>
      <h3>
        <IconImage class="icon" name="Calendar" />
        {{ $t('common.chose-date', range ? 10 : 1) }}
      </h3>
    </template>
    <template #body>
      <div class="custom-vue-picker">
        <div class="custom-container">
          <!-- calendar picker -->
          <VueDatePicker
            ref="dataPickerRef"
            :model-value="range ? localeModel : localeModel[0]"
            :range="range"
            inline
            :locale="localeDateFn"
            :ui="UI"
            :action-row="{
              showSelect: false,
              showCancel: false,
              showNow: false,
              showPreview: false,
            }"
            :multi-calendars="range ? { static: false } : undefined"
            @internal-model-change="onUpdateDate"
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

          <!-- time picker only if enabled -->
          <template v-if="stateModal">
            <div class="custom-timepicker">
              <div class="custom-timepicker-item">
                <EmptyLabel :label="$t('common.start-time')" />
                <VueDatePicker
                  time-picker
                  inline
                  :model-value="modelTime[0]"
                  :range="false"
                  :min-time="{ hours: 0, minutes: 0 }"
                  :time-config="{
                    minutesGridIncrement: 15,
                    minutesIncrement: 15,
                  }"
                  :locale="localeDateFn"
                  :ui="UI"
                  :action-row="{
                    showSelect: false,
                    showCancel: false,
                    showNow: false,
                    showPreview: false,
                  }"
                  @internal-model-change="onStartTimeUpdate"
                />
              </div>
              <div class="custom-timepicker-item">
                <EmptyLabel :label="$t('common.end-time')" />
                <VueDatePicker
                  v-if="range"
                  time-picker
                  inline
                  :model-value="modelTime[1]"
                  :time-config="{
                    minutesGridIncrement: 15,
                    minutesIncrement: 15,
                  }"
                  :locale="localeDateFn"
                  :ui="UI"
                  :action-row="{
                    showSelect: false,
                    showCancel: false,
                    showNow: false,
                    showPreview: false,
                  }"
                  @internal-model-change="onEndTimeUpdate"
                />
              </div>
            </div>
          </template>
        </div>
        <div class="control-vue-picker">
          <LpiButton
            v-if="stateModal"
            :disabled="!asTimeSelected"
            :label="$t('common.reset-time')"
            btn-icon="Clock"
            @click="resetTime"
          />

          <LpiButton
            v-if="timePicker"
            :disabled="noDateSelected"
            :label="stateModal ? $t('common.back-calendar') : $t('common.add-time')"
            :btn-icon="stateModal ? 'ChevronLeft' : 'Clock'"
            @click="toggleModal"
          />
        </div>
        <div class="display-date">
          <DisplayDate :date="localeModel" :time="timePicker ? 'auto' : false" />
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
    --dp-hover-text-color: var(--white);
    --dp-hover-icon-color: var(--white);
  }

  .custom-navBtnNext,
  .custom-navBtnPrev {
    width: 2rem;
    height: 2rem;
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

  .dp__menu_inner {
    gap: 0.5rem;
  }

  .dp__instance_calendar:not(:first-child) {
    border-left: 2px var(--lighter-gray) solid;
  }
}

.display-date {
  padding: 1rem 0;
  font-size: large;
}

.custom-container {
  position: relative;
}

.custom-timepicker {
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: 1fr minmax(auto, 1fr);
  background-color: var(--white);
}

.custom-timepicker-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.control-vue-picker {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}
</style>
