<template>
  <menu>
    <li
      v-for="entry in menuEntries"
      :key="entry.view"
      class="menu-entry"
      :class="{ active: entry == currentTab }"
    >
      <NuxtLink
        v-if="entry.condition"
        class="link"
        :data-test="entry.key"
        :to="entry.view"
        @click="navigated"
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
      type: Array,
      required: true,
    },
    currentTab: {
      type: Object,
      default: () => {},
    },
  },
  emits: ['navigated'],
  methods: {
    navigated() {
      this.$emit('navigated')
    },
  },
}
</script>
<style scoped lang="scss">
menu {
  display: flex;
  flex-flow: column;
  gap: 0.5rem;
  list-style-type: none;

  .menu-entry {
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
      }
    }
  }
}
</style>
