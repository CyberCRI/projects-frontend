<template>
  <BaseGroupPreview
    v-if="group.$t.description"
    :title="$t('group.similars')"
    :total="group.modules.similars"
  >
    <template #content>
      <FetchLoader :status="status">
        <div class="group-similars">
          <div class="group-similars-list">
            <GroupCard
              v-for="groupSimilar in groups"
              :key="groupSimilar.id"
              :group="groupSimilar"
            />
          </div>
        </div>
      </FetchLoader>
    </template>
    <template #footer>
      <SeeMoreArrow is="button" class="see-more-btn" @click="onClick" />
      <GroupSimilarDrawer :group="showMore ? group : null" @close="onClose" />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { getGroupSimilar } from '@/api/v2/group.service'
import SeeMoreArrow from '@/components/base/button/SeeMoreArrow.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import GroupSimilarDrawer from '@/components/group/GroupSimilarDrawer.vue'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/pages/GroupPageV2/Tabs/BaseGroupPreview.vue'

const props = defineProps<{ group: TranslatedPeopleGroupModel }>()

const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group?.id)
const LIMIT = 3
const { status, data: groups } = getGroupSimilar(organizationCode, groupId, {
  paginationConfig: {
    limit: LIMIT,
  },
})

const showMore = ref(false)
const onClick = () => (showMore.value = true)
const onClose = () => (showMore.value = false)
</script>

<style lang="scss" scoped>
.group-similars {
  overflow-y: scroll;
  max-height: 400px;

  .group-similars-list {
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
}

// reset button default css
.see-more-btn {
  background-color: unset;
  border: unset;
  font-size: unset;
}

@media screen and (min-width: $min-desktop) {
  .group-similars-list {
    flex-direction: column;
  }
}
</style>
