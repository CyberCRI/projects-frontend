<template>
  <menu>
    <li
      v-for="entry in menuEntries"
      :key="entry.key"
      class="menu-entry"
      :class="{ active: isCurrentTab(entry, currentTab) }"
    >
      <NuxtLink
        v-if="entry.condition"
        class="link"
        :data-test="entry.dataTest"
        :to="entry.view"
        @click="onMenuEntryClicked($event, entry)"
      >
        <IconImage class="icon" :name="entry.icon || 'Article'" />

        {{ entry.label }}

        <IconImage v-if="entry.actionIcon" class="icon action-icon" :name="entry.actionIcon" />
      </NuxtLink>
    </li>
  </menu>
</template>
<script>
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
  methods: {
    onMenuEntryClicked(evt, entry) {
      console.log(entry)
      if (entry.isAddAction) {
        this.$emit('action-triggered', entry)
        evt.preventDefault()
      } else {
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
