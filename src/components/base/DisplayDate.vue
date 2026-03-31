<script setup lang="ts">
import { formatDate } from '@/functs/date'

const props = defineProps<{
  date: string | Date | Date[] | string[] | null
}>()

const { d, locale } = useNuxtI18n()

const dateToArray = computed(() => {
  if (Array.isArray(props.date)) {
    return props.date
  }
  return [props.date]
})

const startDate = computed(() => (dateToArray.value[0] ? new Date(dateToArray.value[0]) : null))
const endDate = computed(() =>
  dateToArray.value[1] ? new Date(dateToArray.value[1]) : startDate.value
)

const displayDateRange = computed(() => {
  return [formatDate(startDate.value, locale.value), formatDate(endDate.value, locale.value)]
})

const haveEndDate = computed(() => {
  return endDate.value && endDate.value.toString() !== startDate.value.toString()
})
</script>

<template>
  <span class="date-preview">
    <time v-if="startDate" class="date-preview-start" :datetime="d(startDate)">
      {{ displayDateRange[0] }}
    </time>
    <template v-if="haveEndDate">
      <span class="date-separator">
        {{ ' - ' }}
      </span>
      <time class="date-preview-end" :datetime="d(endDate)">
        {{ displayDateRange[1] }}
      </time>
    </template>
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
