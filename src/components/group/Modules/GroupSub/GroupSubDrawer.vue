<template>
  <BaseDrawer
    :is-opened="!!group"
    data-test="group-sub-drawer"
    :title="`${t(GroupModuleTitle.subgroups)} (${count})`"
    class="medium"
    no-footer
    @close="emit('close')"
  >
    <GroupSubList :group="group" />
  </BaseDrawer>
</template>

<script setup lang="ts">
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import GroupSubList from '@/components/group/Modules/GroupSub/GroupSubList.vue'
import { GroupModuleTitle, TranslatedPeopleGroupModel } from '@/models/invitation.model'

const { t } = useNuxtI18n()
const emit = defineEmits(['close'])
const props = withDefaults(
  defineProps<{
    group?: TranslatedPeopleGroupModel
  }>(),
  { group: null }
)

const count = computed(() => props.group?.modules?.subgroups ?? 0)
</script>
