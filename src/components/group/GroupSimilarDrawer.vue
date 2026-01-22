<template>
  <BaseDrawer
    :is-opened="!!group"
    data-test="add-default-skills-drawer"
    :title="`${t(`group.similars`)} (${count})`"
    class="medium"
    no-footer
    @close="emit('close')"
  >
    <FetchLoader :status="status" only-error skeleton>
      <div class="groups-list-similars">
        <GroupCard v-for="groupSimilar in groups" :key="groupSimilar.id" :group="groupSimilar" />
      </div>
      <div class="groups-paginations">
        <PaginationButtons2 :pagination="pagination" />
      </div>
    </FetchLoader>
  </BaseDrawer>
</template>

<script setup lang="ts">
import { getGroupSimilar } from '@/api/v2/group.service'
import BaseDrawer from '@/components/base/BaseDrawer.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { toArray } from '@/skeletons/base.skeletons'
import { groupSkeleton } from '@/skeletons/group.skeletons'

const { t } = useNuxtI18n()
const emit = defineEmits(['close'])
const props = withDefaults(
  defineProps<{
    group?: TranslatedPeopleGroupModel
  }>(),
  { group: null }
)

const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group?.id)
const {
  status,
  pagination,
  data: groups,
} = getGroupSimilar(organizationCode, groupId, {
  default: () => toArray(groupSkeleton),
})
const { count } = pagination
</script>

<style lang="scss">
$profile-groups: 1rem;

.groups-list-similars {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.groups-paginations {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
</style>
