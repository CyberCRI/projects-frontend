<template>
  <BadgeItem :icon-name="icon" :label="goalStatus" />
</template>

<script setup lang="ts">
import BadgeItem from '@/components/base/BadgeItem.vue'
import { IconImageChoice } from '@/functs/IconImage'
import { TranslatedProject } from '@/models/project.model'
import { ProjectStatusType } from '@/models/types'

const STATUS_ICONS: Record<ProjectStatusType, IconImageChoice> = {
  canceled: 'Close',
  completed: 'Check',
  running: 'Spinner',
  toreview: 'Alert',
}

const props = defineProps<{
  project: TranslatedProject
}>()

const { t } = useNuxtI18n()

const icon = computed(() => STATUS_ICONS[props.project.life_status])
const goalStatus = computed(() => t(`status.${props.project.life_status}`))
</script>
