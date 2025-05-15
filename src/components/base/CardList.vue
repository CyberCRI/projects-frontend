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
        <div class="card-list__empty">
          <p class="card-list__empty--text">
            {{ $t('project.nothing') }}
          </p>
          <img
            :src="`${runtimeConfig.public.appPublicBinariesPrefix}/empties/emptyBox.svg`"
            alt="Nothing here"
          />
        </div>
      </slot>
    </template>
    <div v-else class="card-container">
      <DynamicGrid :min-gap="gridGap" class="card-list" :mode="mode">
        <div v-for="item in items" :key="item.id" class="card-list__content">
          <slot name="default" :item="item" :mode="mode" />
        </div>
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

  setup() {
    const runtimeConfig = useRuntimeConfig()
    return {
      runtimeConfig,
    }
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

.card-list__empty {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
}

.card-list__empty--text {
  font-weight: 400;
  font-size: 22px;
  color: $primary-dark;
  margin-bottom: 24px;
}

.card-list__empty--image {
  width: 200px;
}

.card-list__content.card {
  width: min-content;
}

.card-container {
  margin: $space-xl 0;
}
</style>
