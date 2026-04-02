<script setup lang="ts">
import EmptyLabel from '@/components/base/EmptyLabel.vue'
import { dateWithoutHours, formatDateTime, formatTime } from '@/functs/date'

const props = withDefaults(
  defineProps<{
    date: string | Date | Date[] | string[] | null
    time?: boolean | 'auto'
  }>(),
  {
    time: 'auto',
  }
)

const { locale } = useNuxtI18n()

const dateToArray = computed(() => {
  if (Array.isArray(props.date)) {
    return props.date.filter((v) => !!v)
  }
  return [props.date]
})

const startDate = computed(() => (dateToArray.value[0] ? new Date(dateToArray.value[0]) : null))
const endDate = computed(() =>
  dateToArray.value[1] ? new Date(dateToArray.value[1]) : startDate.value
)

const haveTime = computed(() => {
  if (!startDate.value) {
    return false
  }
  const startTime = startDate.value.getHours() * 3600 + startDate.value.getMinutes()
  const endTime = endDate.value.getHours() * 3600 + endDate.value.getMinutes()

  return (
    startTime !== endTime &&
    dateWithoutHours(startDate.value).getTime() === dateWithoutHours(endDate.value).getTime()
  )
})

// force add time in displayed date ('auto' check if value is set, true is forced, and false not displayed)
const options = computed(() => {
  if (props.time === 'auto' && !haveTime.value) {
    return {}
  }
  if (props.time) {
    return {
      hour: 'numeric',
      minute: 'numeric',
    }
  }
  return {
    hour: undefined,
    minute: undefined,
  }
})

const displayStartDate = computed(() => {
  if (!startDate.value) {
    return
  }
  return formatDateTime(startDate.value, locale.value, options.value)
})
const displayEndDate = computed(() => {
  if (!startDate.value) {
    return
  }
  if (dateWithoutHours(startDate.value).getTime() === dateWithoutHours(endDate.value).getTime()) {
    return formatTime(endDate.value, locale.value, options.value)
  }
  return formatDateTime(endDate.value, locale.value, options.value)
})

// check endDate and startDate is not equal (same day / same hours)
const haveEndDate = computed(() => {
  return endDate.value && endDate.value.toString() !== startDate.value.toString()
})
</script>

<template>
  <span class="date-preview">
    <time v-if="startDate" class="date-preview-start" :datetime="displayStartDate">
      {{ displayStartDate }}
    </time>
    <template v-if="haveEndDate">
      <span class="date-separator">
        {{ ' - ' }}
      </span>
      <time class="date-preview-end" :datetime="displayEndDate">
        {{ displayEndDate }}
      </time>
    </template>
    <EmptyLabel v-if="!startDate && !haveEndDate" :label="$t('common.no-date')" />
  </span>
</template>

<style lang="scss" scoped>
.date-preview {
  align-self: center;
  display: inline-block;
  gap: 1rem;
  font-size: 1rem;

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
