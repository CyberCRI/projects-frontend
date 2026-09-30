<template>
  <details
    v-if="entry.submenu"
    :open="!!entry.submenu.find((e) => e == currentTab)"
    class="submenu-container"
  >
    <summary class="navpanel-menu-link submenu-toggle" :data-test="entry.dataTest">
      <IconImage class="icon skeletons-background" :name="entry.icon || 'Article'" />
      <span class="skeletons-text">
        {{ entry.label }}
      </span>
      <IconImage class="submenu-chevron submenu-chevron-up skeletons-background" name="ChevronUp" />
      <IconImage
        class="submenu-chevron submenu-chevron-down skeletons-background"
        name="ChevronDown"
      />
    </summary>
    <div class="submenu-wrapper">
      <NavPanelMenu
        class="submenu"
        :menu-entries="entry.submenu"
        :current-tab="currentTab"
        @action-triggered="$emit('action-triggered', $event)"
        @navigated="$emit('navigated')"
      />
    </div>
  </details>
</template>

<script setup lang="ts">
import type { MenuEntry } from '~/components/base/navigation/NavPanelMenu.vue'

withDefaults(
  defineProps<{
    entry: MenuEntry
    currentTab?: MenuEntry
  }>(),
  {
    currentTab: null,
  }
)

defineEmits<{
  navigated: []
  'action-triggered': [MenuEntry]
}>()
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';
@use '~/components/base/navigation/navpanel-menu-entry';

menu {
  display: flex;
  flex-flow: column;
  gap: 2px;
  list-style-type: none;
}

.submenu-container {
  .submenu-chevron {
    width: 1.5em;
    height: 1.5em;
    fill: var(--primary-dark);
    margin-left: auto;
  }

  .submenu-chevron-up {
    display: none;
  }

  .submenu-chevron-down {
    display: inline-block;
  }

  &[open] {
    .submenu {
      padding-left: 1.2rem;
      border-left: 1px dotted var(--primary-dark);
    }

    .submenu-chevron-up {
      display: inline-block;
    }

    .submenu-chevron-down {
      display: none;
    }
  }

  .submenu-wrapper {
    background-color: #fff;
    padding-left: 0.8rem;
  }
}
</style>
