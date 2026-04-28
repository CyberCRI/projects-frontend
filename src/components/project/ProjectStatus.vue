<template>
  <BadgeItem :icon-name="icon" :label="goalStatus" />
</template>

<script setup lang="ts">
import type { TranslatedProject } from '~/models/project.model'
import type { ProjectStatusType } from '~/models/types'

import BadgeItem from '~/components/base/BadgeItem.vue'

import type { IconImageChoice } from '~/functs/IconImage'

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
