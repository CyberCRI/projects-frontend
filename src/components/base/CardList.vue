<template>
  <div v-if="switchableDisplay" class="diplay-switcher">
    <GroupButton v-model="mode" :options="displayMode" :has-icon="false" size="s-small" />
  </div>

  <ProjectListSkeleton
    v-if="isLoading"
    class="card-list"
    :min-gap="GRID_GAP"
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
      <DynamicGrid :min-gap="GRID_GAP" class="card-list" :mode="mode">
        <slot v-for="item in items" :key="item.id" :item="item" :mode="mode" />
      </DynamicGrid>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProjectListSkeleton from '@/components/project/ProjectListSkeleton.vue'
import DynamicGrid from '@/components/base/DynamicGrid.vue'

const props = withDefaults(
  defineProps<{
    items?: any[]
    isLoading?: boolean
    limit?: number
    switchableDisplay?: boolean
  }>(),
  {
    items: () => [],
    isLoading: false,
    limit: 12,
    switchableDisplay: false,
  }
)

const { t } = useNuxtI18n()

const GRID_GAP = 24
const mode = ref<'card' | 'list'>('card')
const isEmpty = computed(() => !props.isLoading && !props.items.length)

const displayMode = computed(() => {
  return [
    {
      label: t('card-list.grid'),
      iconName: 'Card',
      value: 'card',
    },
    {
      label: t('card-list.list'),
      iconName: 'List',
      value: 'list',
    },
  ]
})

watch(mode, (newMODE, oldMODE) => {
  if (props.switchableDisplay && newMODE !== oldMODE) {
    localStorage?.setItem('card-list-MODE', newMODE)
  }
})

onMounted(() => {
  if (props.switchableDisplay) {
    const storageMode = localStorage?.getItem('card-list-MODE')
    if (['card', 'list'].includes(storageMode)) {
      mode.value = storageMode as 'card' | 'list'
    }
  }
})
</script>

<style lang="scss" scoped>
.card-list {
  justify-content: space-between;
}

.card-container {
  margin: $space-xl 0;
}
</style>
