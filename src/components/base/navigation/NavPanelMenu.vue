<template>
  <menu>
    <slot />
    <li
      v-for="entry in menuEntries"
      :key="entry.key"
      class="navpanel-menu-entry"
      :class="{ active: isCurrentTab(entry, currentTab) }"
    >
      <template v-if="entry.condition">
        <span
          v-if="entry.isNotLink"
          class="navpanel-menu-link"
          :data-test="entry.dataTest"
          @click="onMenuEntryClicked($event, entry)"
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
          @click="onMenuEntryClicked($event, entry)"
        >
          <IconImage class="icon" :name="entry.icon || 'Article'" />

          {{ entry.label }}

          <IconImage v-if="entry.actionIcon" class="icon action-icon" :name="entry.actionIcon" />
        </NuxtLink>
      </template>
    </li>
  </menu>
</template>
<script>
import useGlobals from '@/stores/useGlobals.ts'
export default {
  name: 'NavPanelMenu',
  props: {
    menuEntries: {
      type: Array, // {condition, label, icon, actionIcon?, key, view, isAddAction?}
      required: true,
    },
    currentTab: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['navigated', 'action-triggered'],
  setup() {
    const globalsStore = useGlobals()
    return { globalsStore }
  },
  methods: {
    async onMenuEntryClicked(evt, entry) {
      if (entry.isAddAction) {
        if (this.globalsStore.hasUnsavedEdit) {
          let answer = true
          try {
            answer = await new Promise((accept) => {
              this.globalsStore.confirmDiscardPendingEditsPromise = accept
            })
          } catch (e) {
            console.error(e)
          } finally {
            this.globalsStore.confirmDiscardPendingEditsPromise = null
          }
          if (answer) {
            this.globalsStore.hasUnsavedEdit = false
            this.$emit('action-triggered', entry)
          }
        } else {
          this.$emit('action-triggered', entry)
        }
        // evt.preventDefault()
      }
      // naviguation guard is in middleware
      this.$emit('navigated')
    },
    isCurrentTab(entry, currentTab) {
      if (entry?.view?.name) return entry?.view?.name == currentTab?.view?.name
      if (entry?.view) return entry.view == currentTab?.view
      return false
    },
  },
}
</script>
<style scoped lang="scss">
@import '@/components/base/navigation/navpanel-menu-entry';

menu {
  display: flex;
  flex-flow: column;
  gap: 2px;
  list-style-type: none;
}
</style>
