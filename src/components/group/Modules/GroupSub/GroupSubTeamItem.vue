<template>
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
        <GroupRecapPreview is="span" :group="group" no-title :modules="['members', 'subgroups']" />
      </div>
    </NuxtLink>
    <BaseGroupMembersList
      v-if="group.modules.members"
      :group="group"
      class="contents"
      :with-pagination="withPagination"
    />
  </div>
</template>

<script setup lang="ts">
import GroupRecapPreview from '@/components/group/Modules/Extras/GroupRecapPreview.vue'
import BaseGroupMembersList from '@/components/group/Modules/Members/BaseGroupMembersList.vue'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    withPagination?: boolean
  }>(),
  { withPagination: true }
)

const groupItem = useTemplateRef('groupItem')
const onMouseover = () => {
  groupItem.value?.classList.add('shadow-box-transform')
}
const onMouseout = () => {
  groupItem.value?.classList.remove('shadow-box-transform')
}
</script>

<style lang="scss" scoped>
.no-transform:not(.shadow-box-transform) {
  transform: unset !important;
}

.subgroup-element {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  gap: 1rem;
  height: 100%;

  > :last-child {
    margin-bottom: -1rem;
  }

  .subgroup-header {
    grid-column: span 2;
    padding: 1rem 1.5rem;
    background-color: color-mix(in srgb, $primary, transparent 90%);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.subgroup-sub {
  display: flex;
  gap: 0.2rem;
  align-items: center;
  justify-content: flex-end;

  svg {
    fill: $primary;
    display: inline-block;
    width: 1.5rem;
    margin: 0 0.3rem;
  }
}
</style>
