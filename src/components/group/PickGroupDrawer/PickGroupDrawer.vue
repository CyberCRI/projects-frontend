<template>
  <BaseDrawer
    :title="drawerTitle"
    :is-opened="isOpened"
    class="medium"
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

<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'
import PickGroup from '~/components/group/PickGroup/PickGroup.vue'
import type { HierarchyGroupModel } from '~/models/group.model'
import FetchLoader from '~/components/base/FetchLoader.vue'
import BaseDrawer from '~/components/base/BaseDrawer.vue'
import type { AsyncDataRequestStatus } from '#app'

const props = withDefaults(
  defineProps<{
    // title of the drawer
    drawerTitle?: string
    // text before the serach input
    subtitle?: string
    // groups hierarchy
    groups?: (HierarchyGroupModel | TranslatedPeopleGroupModel)[]
    // initially selected group
    initialGroup?: HierarchyGroupModel
    isOpened?: boolean
    // array of unselectable group ids
    forbiddenIds?: any[]
    // allow to show and pick a (null) root group
    rooted?: boolean
    status?: AsyncDataRequestStatus
  }>(),
  {
    drawerTitle: '',
    subtitle: '',
    groups: () => [],
    initialGroup: null,
    isOpened: false,
    forbiddenIds: () => [],
    rooted: false,
    status: 'success',
  }
)

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
