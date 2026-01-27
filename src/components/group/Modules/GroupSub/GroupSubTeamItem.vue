<template>
  <ToolTip :hover="true" offset-distance="5" :disabled="disableToolTip" placement="top">
    <template #custom-content>
      {{ $t('common.see-more') }}
    </template>
    <div ref="groupItem" class="subgroup-element shadow-box-transition no-transform">
      <NuxtLink
        :to="{
          name: 'Group',
          params: { groupId: group.id },
        }"
        class="subgroup-header border-primary skeletons-text"
        @mouseover.prevent="onMouseover"
        @mouseout.prevent="onMouseout"
      >
        <h4>{{ group.$t.name }}</h4>
        <div>
          <GroupRecapPreview
            is="span"
            :group="group"
            no-title
            :modules="['members', 'subgroups']"
          />
        </div>
      </NuxtLink>
      <BaseGroupMembersList
        v-if="group.modules.members"
        :group="group"
        class="subgroup-members"
        :with-pagination="withPagination"
        :limit="limitMembers"
      />
    </div>
  </ToolTip>
</template>

<script setup lang="ts">
import GroupRecapPreview from '@/components/group/Modules/Extras/GroupRecapPreview.vue'
import BaseGroupMembersList from '@/components/group/Modules/Members/BaseGroupMembersList.vue'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    withPagination?: boolean
    limitMembers?: number
  }>(),
  { withPagination: true, limitMembers: null }
)

const disableToolTip = ref(false)
const groupItem = useTemplateRef('groupItem')
const onMouseover = () => {
  groupItem.value?.classList.add('shadow-box-transform')
  disableToolTip.value = false
}
const onMouseout = () => {
  groupItem.value?.classList.remove('shadow-box-transform')
  disableToolTip.value = true
}
</script>

<style lang="scss" scoped>
.no-transform:not(.shadow-box-transform) {
  transform: unset !important;
}

.subgroup-element {
  display: grid;
  grid-template-rows: 1fr;
  width: 100%;
  gap: 1rem;
  min-height: pxToRem(85px);

  .subgroup-header {
    padding: 1rem 1.5rem;
    background-color: color-mix(in srgb, $primary, transparent 90%);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.subgroup-members {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: calc(100% - 2rem);
  gap: 1rem;
  padding: 0 1rem;
  min-height: pxToRem(85px);
}
</style>
