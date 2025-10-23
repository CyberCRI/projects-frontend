<template>
  <BaseDrawer
    :title="drawerTitle"
    :is-opened="isOpened"
    class="small"
    :confirm-action-name="t('common.save')"
    :confirm-action-disabled="!rooted && selectedGroup === null"
    @close="emits('close')"
    @confirm="emits('confirm', selectedGroup)"
  >
    <PickGroup
      :subtitle="subtitle"
      :groups="groups"
      :initial-group="initialGroup"
      :forbidden-ids="forbiddenIds"
      :rooted="rooted"
      @select-group="selectGroup"
    />
  </BaseDrawer>
</template>
<script setup>
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import PickGroup from '@/components/group/PickGroup/PickGroup.vue'

defineOptions({ name: 'PickGroupDrawer' })
const props = defineProps({
  drawerTitle: {
    // title of the drawer
    type: String,
    default: '',
  },
  subtitle: {
    // text before the serach input
    type: String,
    default: '',
  },
  groups: {
    // groups hierarchy
    type: Array,
    default: () => [],
  },
  initialGroup: {
    // initially selected group
    type: Object,
    default: null,
  },
  isOpened: {
    // drawer visibility
    type: Boolean,
    default: false,
  },
  forbiddenIds: {
    // array of unselectable group ids
    type: Array,
    default: () => [],
  },
  rooted: {
    // allow to show and pick a (null) root group
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['close', 'confirm'])
const { t } = useNuxtI18n()
const selectedGroup = ref(null)

watch(
  () => props.isOpened,
  (val) => {
    if (val) {
      selectedGroup.value = props.initialGroup
    }
  },
  { immediate: true }
)

const selectGroup = (group) => {
  selectedGroup.value = group
}
</script>
