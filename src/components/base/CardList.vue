<template>
  <div v-if="switchableDisplay" class="diplay-switcher">
    <GroupButton v-model="mode" :options="displayModes" :has-icon="false" size="s-small" />
  </div>

  <ProjectListSkeleton
    v-if="isLoading"
    class="card-list"
    :min-gap="gridGap"
    :limit="limit"
    :mode="mode"
  />

  <div v-else>
    <template v-if="isEmpty">
      <slot name="empty">
        <NothingHere />
      </slot>
    </template>
    <div v-else class="card-container">
      <DynamicGrid :min-gap="gridGap" class="card-list" :mode="mode">
        <slot v-for="item in items" :key="item.id" :item="item" :mode="mode" />
      </DynamicGrid>
    </div>
  </div>
</template>

<script>
import ProjectListSkeleton from '@/components/project/ProjectListSkeleton.vue'
import DynamicGrid from '@/components/base/DynamicGrid.vue'

export default {
  name: 'CardList',

  components: {
    ProjectListSkeleton,
    DynamicGrid,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },

    isLoading: {
      type: Boolean,
      default: false,
    },

    limit: {
      type: Number,
      default: 12,
    },

    switchableDisplay: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      gridGap: 24,

      mode: 'card', // 'list' or 'grid'
    }
  },
  computed: {
    isEmpty() {
      return !this.isLoading && !this.items.length
    },

    displayModes() {
      return [
        {
          label: this.$t('card-list.grid'),
          iconName: 'Card',
          value: 'card',
        },
        {
          label: this.$t('card-list.list'),
          iconName: 'List',
          value: 'list',
        },
      ]
    },
  },
  watch: {
    mode(newMode, oldMode) {
      if (this.switchableDisplay && newMode !== oldMode) {
        localStorage?.setItem('card-list-mode', newMode)
      }
    },
  },

  mounted() {
    if (this.switchableDisplay) {
      this.mode = localStorage?.getItem('card-list-mode') || 'card'
    }
  },
}
</script>

<style lang="scss" scoped>
.card-list {
  justify-content: space-between;
}

.card-container {
  margin: $space-xl 0;
}
</style>
