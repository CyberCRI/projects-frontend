<template>
  <BaseGroupPreview
    id="subgroup"
    :title="t(GroupModuleTitle.subgroups)"
    :total="group.modules.subgroups"
    :icon="GroupModuleIcon.subgroups"
  >
    <template #header>
      <SeeMoreArrow is="button" class="see-more-btn" @click="onMore" />
    </template>
    <template #content>
      <GroupSubList :group="group" :limit="2" :with-pagination="false" />
      <GroupSubDrawer :group="selectedGroup" @close="onClose" />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import {
  GroupModuleIcon,
  GroupModuleTitle,
  TranslatedPeopleGroupModel,
} from '@/models/invitation.model'
import BaseGroupPreview from '@/components/group/Modules/BaseGroupPreview.vue'
import GroupSubList from '@/components/group/Modules/GroupSub/GroupSubList.vue'
import GroupSubDrawer from '@/components/group/Modules/GroupSub/GroupSubDrawer.vue'

const props = defineProps<{ group: TranslatedPeopleGroupModel }>()

const { t } = useNuxtI18n()
const selectedGroup = ref<TranslatedPeopleGroupModel | null>(null)
const onMore = () => (selectedGroup.value = props.group)
const onClose = () => (selectedGroup.value = null)
</script>
