<template>
  <menu>
    <slot />
    <li
      v-for="entry in menuEntries"
      :key="entry.key"
      class="navpanel-menu-entry"
      :class="{ active: isCurrentTab(entry) }"
    >
      <template v-if="entry.condition">
        <span
          v-if="entry.isNotLink"
          class="navpanel-menu-link"
          :data-test="entry.dataTest"
          @click="onMenuEntryClicked(entry)"
        >
          <IconImage class="icon" :name="entry.icon || 'Article'" />

          {{ entry.label }}

          <IconImage v-if="entry.actionIcon" class="icon action-icon" :name="entry.actionIcon" />
        </span>
        <NuxtLink
          v-else
          class="navpanel-menu-link"
          :data-test="entry.dataTest"
          :to="entry.view"
          @click="onMenuEntryClicked(entry)"
        >
          <IconImage class="icon" :name="entry.icon || 'Article'" />

          {{ entry.label }}

          <IconImage v-if="entry.actionIcon" class="icon action-icon" :name="entry.actionIcon" />
        </NuxtLink>
      </template>
    </li>
  </menu>
</template>

<script setup lang="ts">
import useGlobals from '~/stores/useGlobals'

import type { IconImageChoice } from '~/functs/IconImage'

type MenyEntry = {
  condition: boolean
  label: string
  icon: IconImageChoice
  actionIcon?: IconImageChoice
  key: string
  view:
    | {
        name: string
      }
    | string
  isNotLink?: boolean
  dataTest?: string
  isAddAction?: () => void
}
const props = withDefaults(
  defineProps<{
    menuEntries: MenyEntry[]
    currentTab?: any
  }>(),
  {
    currentTab: null,
  }
)

const emit = defineEmits<{
  navigated: []
  'action-triggered': [MenyEntry]
}>()

const globalsStore = useGlobals()

const onMenuEntryClicked = async (entry: MenyEntry) => {
  if (entry.isAddAction) {
    if (globalsStore.hasUnsavedEdit) {
      let answer = true
      try {
        answer = await new Promise((accept) => {
          globalsStore.confirmDiscardPendingEditsPromise = accept
        })
      } catch (e) {
        console.error(e)
      } finally {
        globalsStore.confirmDiscardPendingEditsPromise = null
      }
      if (answer) {
        globalsStore.hasUnsavedEdit = false
        emit('action-triggered', entry)
      }
    } else {
      emit('action-triggered', entry)
    }
  }
  // naviguation guard is in middleware
  emit('navigated')
}
const isCurrentTab = (entry: MenyEntry) => {
  let entryName
  if (typeof entry.view === 'string') {
    entryName = entry.view
  } else {
    entryName = entry.view?.name
  }

  if (!props.currentTab) {
    return false
  }

  let currentTabName
  if (typeof props.currentTab.view === 'string') {
    currentTabName = props.currentTab.view
  } else {
    currentTabName = props.currentTab.view?.name
  }

  return entryName === currentTabName
}
</script>

<style scoped lang="scss">
@import '~/components/base/navigation/navpanel-menu-entry';

menu {
  display: flex;
  flex-flow: column;
  gap: 2px;
  list-style-type: none;
}
</style>
