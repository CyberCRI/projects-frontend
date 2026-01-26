<template>
  <BaseGroupPreview :title="$t(GroupModuleTitle.similars)" :total="group.modules.similars">
    <template #header>
      <SeeMoreArrow is="button" class="see-more-btn header" @click="onClick" />
    </template>
    <template #content>
      <FetchLoader :status="status" only-error skeleton>
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
      <SeeMoreArrow is="button" class="see-more-btn footer" @click="onClick" />
      <GroupSimilarDrawer :group="showMore ? group : null" @close="onClose" />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { getGroupSimilar } from '@/api/v2/group.service'
import SeeMoreArrow from '@/components/base/button/SeeMoreArrow.vue'
import GroupCard from '@/components/group/GroupCard.vue'
import { GroupModuleTitle, TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/components/group/Modules/BaseGroupPreview.vue'
import { maxSkeleton, toPagination } from '@/skeletons/base.skeletons'
import { groupSkeleton } from '@/skeletons/group.skeletons'
import GroupSimilarDrawer from '@/components/group/Modules/Extras/GroupSimilarDrawer.vue'

const props = withDefaults(defineProps<{ group: TranslatedPeopleGroupModel; limit?: number }>(), {
  limit: null,
})

const limitSkeletons = computed(() => maxSkeleton(props.group?.modules?.similars, props.limit))

const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group?.id)
const { status, data: groups } = getGroupSimilar(organizationCode, groupId, {
  paginationConfig: {
    limit: props.limit,
  },
  default: () => toPagination(groupSkeleton, limitSkeletons.value),
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

.see-more-btn.footer {
  display: none;
}

.see-more-btn.header {
  display: block;
}

@media screen and (min-width: $min-desktop) {
  .see-more-btn.footer {
    display: block;
  }

  .see-more-btn.header {
    display: none;
  }
}
</style>
