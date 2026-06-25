<script setup lang="ts" generic="Item extends { id: number | string }">
import PaginationButtonsV2 from '~/components/base/navigation/PaginationButtonsV2.vue'
import BaseSearch from '~/components/drawer/BaseSearch.vue'
import { isEqual, isNil } from 'es-toolkit'

export type DrawerSearchProps<Item2> = {
  isOpened?: boolean
  title?: string
  asyncing?: boolean
  results: Item2[]
  selected?: Item2[]
  pagination?: Pagination
  // max elements to be selected
  maxSelected?: number
  // when selected elements is lenght of maxSelected, "autoConfirm" (like user submited)
  maxAutoConfirm?: boolean
}

const props = withDefaults(defineProps<DrawerSearchProps<Item>>(), {
  isOpened: false,
  title: null,
  asyncing: false,
  selected: () => [],
  pagination: null,
  maxSelected: null,
  maxAutoConfirm: false,
})

const emit = defineEmits<{
  close: []
  confirm: [Item[]]
  search: []
}>()

const search = defineModel<string>('search', { default: '' })
const { stateModals, openModals, closeModals } = useModals({ saveChange: false })

const selectedItems = ref<Item[]>([]) as Ref<Item[]>

watch(
  () => [props.selected, props.isOpened],
  () => {
    selectedItems.value = [...props.selected]
  },
  { immediate: true }
)
const selectedItemsId = computed(() => selectedItems.value.map((item) => item.id))

const isFormEqual = computed(() => {
  const originalSelectedId = new Set(props.selected.map((el) => el.id))
  const selectedId = new Set(selectedItems.value.map((el) => el.id))

  return isEqual(originalSelectedId, selectedId)
})

const close = () => {
  closeModals('saveChange')
  emit('close')
}
const onConfirm = () => emit('confirm', selectedItems.value)

const checkClose = () => {
  if (isFormEqual.value) {
    close()
  } else {
    openModals('saveChange')
  }
}

const isSelected = (item: Item) => selectedItemsId.value.includes(item.id)
const toggleItem = (newItem: Item) => {
  if (isSelected(newItem)) {
    selectedItems.value = selectedItems.value.filter((item) => item.id !== newItem.id)
  } else {
    selectedItems.value.push(newItem)
  }
  // auto confirm if max elements is sets
  if (props.maxAutoConfirm && props.maxSelected === selectedItems.value.length) {
    onConfirm()
  }
}

const onSelectClear = () => {
  selectedItems.value = []
}
const onSelectAll = () => {
  const toAdd = props.results.filter((item) => !isSelected(item))
  selectedItems.value.push(...toAdd)
}

const isSelectedMax = computed(() => {
  if (isNil(props.maxSelected)) {
    return false
  }
  return selectedItems.value.length >= props.maxSelected
})

const labelMaxSelected = computed(() => {
  if (isNil(props.maxSelected)) {
    return ''
  }
  return `(${selectedItems.value.length}/${props.maxSelected})`
})

// reset search when drawer change state
watch(
  () => props.isOpened,
  () => (search.value = ''),
  { immediate: true }
)

// trigger when search change, and if drawer is opened emit event
watch(
  () => [search.value, props.isOpened],
  () => {
    if (props.isOpened) {
      // reset page to first if search vlaue changes
      props.pagination?.first()
      emit('search')
    }
  },
  { immediate: true }
)
</script>

<template>
  <BaseDrawer
    :is-opened="isOpened"
    :title="`${title || $t('search.label')} ${labelMaxSelected}`"
    class="team-modal large"
    :confirm-action-disabled="isFormEqual"
    :asyncing="asyncing"
    @close="checkClose"
    @confirm="onConfirm"
  >
    <BaseSearch
      v-model="search"
      :count-result="results.length"
      :count-selected="selectedItems.length"
      :selected-all="isNil(maxSelected)"
      @select-clear="onSelectClear"
      @select-all="onSelectAll"
    >
      <template #selected>
        <div class="list-flow-container selected-items my2">
          <TransitionGroup name="fade-items">
            <slot
              v-for="item in selectedItems"
              name="select-item"
              :item="item"
              @click="toggleItem(item)"
            />
          </TransitionGroup>
        </div>
      </template>
      <template #results>
        <div class="list-flow-container">
          <div
            v-for="result in results"
            :key="result.id"
            :class="{
              'pointer-events-none opacity-50': isSelectedMax && !isSelected(result),
            }"
          >
            <slot
              name="search-item"
              :item="result"
              :selected="isSelected(result)"
              @click="toggleItem(result)"
            />
          </div>
        </div>
        <PaginationButtonsV2 v-if="pagination" class="pagination" :pagination="pagination" />
      </template>
    </BaseSearch>
  </BaseDrawer>

  <ConfirmModal
    v-if="stateModals.saveChange"
    :title="$t('form.quit-without-saving-title')"
    :content="$t('common.confirm-close')"
    @cancel="closeModals('saveChange')"
    @confirm="close"
  />
</template>

<style lang="scss" scoped>
.list-flow-container {
  justify-content: space-around;
}

.selected-items {
  justify-content: flex-start;
  gap: 0.5rem;
}

.pagination {
  margin: 1rem auto;
}

.fade-items-move,
.fade-items-enter-active,
.fade-items-leave-active {
  transition: all 0.3s ease;
}

.fade-items-enter-from,
.fade-items-leave-to {
  opacity: 0;
}
</style>
