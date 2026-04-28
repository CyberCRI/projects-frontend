<template>
  <BaseDrawer
    :title="drawerTitle"
    :is-opened="isOpened"
    class="small"
    :confirm-action-name="t('common.save')"
    :confirm-action-disabled="!rooted && selectedGroup === null"
    :asyncing="status !== 'success'"
    @close="emit('close')"
    @confirm="emit('confirm', selectedGroup)"
  >
    <FetchLoader :status="status">
      <PickGroup
        :subtitle="subtitle"
        :groups="groups"
        :initial-group="initialGroup"
        :forbidden-ids="forbiddenIds"
        :rooted="rooted"
        @select-group="selectGroup"
      />
    </FetchLoader>
  </BaseDrawer>
</template>
<script setup>
import PickGroup from '~/components/group/PickGroup/PickGroup.vue'
import FetchLoader from '~/components/base/FetchLoader.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'

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
  status: {
    type: String,
    default: 'success',
  },
})

const emit = defineEmits(['close', 'confirm'])
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
