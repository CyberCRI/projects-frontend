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
      <FetchLoader :status="status">
        <div class="subgroup-list">
          <div v-for="sub in groups" :key="sub.id" class="subgroup-element">
            <span class="subgroup-header border-primary">
              <h4>{{ sub.$t.name }}</h4>
              <span class="subgroup-sub">
                <span>{{ sub.modules.subgroups }}</span>
                <IconImage :name="GroupModuleIcon.subgroups" />
              </span>
            </span>
            <BaseMembersPreview :group="sub" :is-loading="false" class="contents test" />
          </div>
        </div>
      </FetchLoader>
    </template>
  </BaseGroupPreview>
  <!-- <div v-if="subgroups.length > 0 && !isLoading" class="subgroups">
    <div class="subgroups-title">
      <span class="name">{{ t('group.subgroups') }} :</span>
    </div>
    <NuxtLink
      v-for="(subgroup, index) in subgroups"
      :key="index"
      :to="{ name: 'Group', params: { groupId: subgroup.id } }"
      class="subgroups-item"
    >
      <div class="vector" />
      <span class="name">{{ subgroup.name }}</span>
    </NuxtLink>
  </div>
  <SubGroupsSkeleton v-else-if="isLoading" /> -->
</template>

<script setup lang="ts">
import { getSubGroup } from '@/api/v2/group.service'
import IconImage from '@/components/base/media/IconImage.vue'
import GroupSubMemebers from '@/components/group/Modules/GroupSub/GroupSubMemebers.vue'
import {
  GroupModuleIcon,
  GroupModuleTitle,
  TranslatedPeopleGroupModel,
} from '@/models/invitation.model'
import BaseGroupPreview from '@/pages/GroupPageV2/Tabs/BaseGroupPreview.vue'
import BaseMembersPreview from '@/pages/GroupPageV2/Tabs/Members/BaseMembersPreview.vue'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const { t } = useNuxtI18n()

const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group?.id)
const LIMIT = 2
const { status, data: groups } = getSubGroup(organizationCode, groupId, {
  paginationConfig: {
    limit: LIMIT,
  },
})

const showMore = ref(false)
const onClick = () => (showMore.value = true)
const onClose = () => (showMore.value = false)
</script>

<style lang="scss" scoped>
.subgroup-list {
  display: flex;
  flex-direction: column;
  // justify-items: center;
  // align-items: center;
  gap: 1rem;
}

.subgroup-element {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  gap: 1rem;
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
