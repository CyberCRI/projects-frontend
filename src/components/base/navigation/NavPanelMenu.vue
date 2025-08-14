<template>
  <menu>
    <li
      v-for="entry in menuEntries"
      :key="entry.key"
      class="menu-entry"
      :class="{ active: isCurrentTab(entry, currentTab) }"
    >
      <template v-if="entry.condition">
        <NuxtLink
          v-if="!entry.isAddAction"
          class="link"
          :data-test="entry.dataTest"
          :to="entry.view"
          @click="onMenuEntryClicked($event, entry)"
        >
          <IconImage class="icon" :name="entry.icon || 'Article'" />

          {{ entry.label }}

          <IconImage v-if="entry.actionIcon" class="icon action-icon" :name="entry.actionIcon" />
        </NuxtLink>
        <span
          v-else
          class="link"
          :data-test="entry.dataTest"
          @click="onMenuEntryClicked($event, entry)"
        >
          <IconImage class="icon" :name="entry.icon || 'Article'" />

          {{ entry.label }}

          <IconImage v-if="entry.actionIcon" class="icon action-icon" :name="entry.actionIcon" />
        </span>
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
        evt.preventDefault()
      } else {
        // naviguation guard is in middleware
        this.$emit('navigated')
      }
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
menu {
  display: flex;
  flex-flow: column;
  gap: 2px;
  list-style-type: none;

  .menu-entry {
    cursor: pointer;
    border-radius: $border-radius-s;

    &:hover,
    &.active {
      background-color: $primary-light;
    }

    .link {
      display: flex;
      gap: 1rem;
      align-items: center;
      padding: 0.4rem;
      color: $primary-dark;
      cursor: pointer;

      .icon {
        display: inline-block;
        width: 1em;
        height: 1em;
        fill: $primary-dark;
      }

      .action-icon {
        margin-left: auto;
        opacity: 0;
      }

      &:hover .action-icon {
        opacity: 1;
      }
    }
  }
}
</style>
