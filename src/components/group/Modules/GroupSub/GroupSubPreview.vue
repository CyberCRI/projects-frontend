<template>
  <BaseGroupPreview
    id="subgroup"
    :title="t(GroupModuleTitle.subgroups)"
    :total="group.modules.subgroups"
    :icon="GroupModuleIcon.subgroups"
    :see-more="{
      name: 'groupProjects',
      params: { groupId: group.id },
    }"
  >
    <template #content>
      <FetchLoader :status="status" only-error skeleton>
        <div class="subgroup-list">
          <div
            v-for="sub in groups"
            :key="sub.id"
            class="subgroup-element shadow-box-transition no-transform"
          >
            <NuxtLink
              :to="{
                name: 'Group',
                params: { groupId: sub.id },
              }"
              class="subgroup-header border-primary skeletons-text"
              @mouseover.prevent="onMouseover"
              @mouseout.prevent="onMouseout"
            >
              <h4>{{ sub.$t.name }}</h4>
              <span class="subgroup-sub">
                <span>{{ sub.modules.subgroups }}</span>
                <IconImage :name="GroupModuleIcon.subgroups" />
              </span>
            </NuxtLink>
            <BaseMembersPreview :group="sub" :is-loading="false" class="contents" />
          </div>
        </div>
      </FetchLoader>
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { getSubGroup } from '@/api/v2/group.service'
import IconImage from '@/components/base/media/IconImage.vue'
import {
  GroupModuleIcon,
  GroupModuleTitle,
  TranslatedPeopleGroupModel,
} from '@/models/invitation.model'
import BaseGroupPreview from '@/pages/GroupPageV2/Tabs/BaseGroupPreview.vue'
import BaseMembersPreview from '@/pages/GroupPageV2/Tabs/Members/BaseMembersPreview.vue'
import { toArray } from '@/skeletons/base.skeletons'
import { groupSkeleton } from '@/skeletons/group.skeletons'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const { t } = useNuxtI18n()

const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group?.id)
const LIMIT = 2
const limitSkeletons = computed(() => Math.min(props.group.modules?.subgroups ?? LIMIT, LIMIT))

const { status, data: groups } = getSubGroup(organizationCode, groupId, {
  paginationConfig: {
    limit: LIMIT,
  },
  default: () => toArray(groupSkeleton, limitSkeletons.value),
})

const onMouseover = (event) => {
  event.target.parentElement.classList.add('shadow-box-transform')
}
const onMouseout = (event) => {
  event.target.parentElement.classList.remove('shadow-box-transform')
}
</script>

<style lang="scss" scoped>
.subgroup-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no-transform:not(.shadow-box-transform) {
  transform: unset !important;
}

.subgroup-element {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  gap: 1rem;

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

  svg {
    fill: $primary;
    display: inline-block;
    width: 1.5rem;
    margin: 0 0.3rem;
  }
}
</style>
