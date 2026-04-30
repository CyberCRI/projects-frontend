<template>
  <BaseGroupPreview
    id="similars"
    ref="similars"
    :title="$t(GroupModuleTitle.similars, group.modules.similars)"
    :total="group.modules.similars"
  >
    <template #header>
      <SeeMoreArrow is="button" class="see-more-btn reset-btn" @click="onClick" />
    </template>
    <template #content>
      <FetchLoader :status="status" only-error skeleton>
        <div class="group-similars">
          <div class="group-similars-list">
            <GroupCard
              v-for="groupSimilar in groups"
              :key="groupSimilar.id"
              class="group-similars-card"
              :group="groupSimilar"
              :mode="mode"
            />
          </div>
        </div>
      </FetchLoader>
    </template>
    <template #footer>
      <GroupSimilarDrawer :group="showMore ? group : null" @close="onClose" />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import GroupSimilarDrawer from '@/components/group/Modules/Extras/GroupSimilarDrawer.vue'
import { maxSkeleton, factoryPagination } from '@/skeletons/base.skeletons'
import type { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/components/modules/BaseModulePreview.vue'
import SeeMoreArrow from '@/components/base/button/SeeMoreArrow.vue'
import { GroupModuleTitle } from '@/models/invitation.model'
import { groupSkeleton } from '@/skeletons/group.skeletons'
import GroupCard from '@/components/group/GroupCard.vue'
import { getGroupSimilar } from '@/api/v2/group.service'
import { onMediaChange } from '@/composables/onResize'

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
  query: {
    // no need group modules for preview subgroups
    modules: 'none',
  },
  default: () => factoryPagination(groupSkeleton, limitSkeletons.value),
})

const mode = ref<'card' | 'list'>('list')

const showMore = ref(false)
const onClick = () => (showMore.value = true)
const onClose = () => (showMore.value = false)

const container = useTemplateRef('similars')
onMediaChange(
  '(min-width: 1200px)',
  (matches) => {
    const el = container.value.$el as HTMLElement
    if (matches && el.parentElement.childElementCount !== 1) {
      mode.value = 'card'
    } else {
      mode.value = 'list'
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.group-similars {
  .group-similars-list {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-bottom: 0.5rem;
  }
}

@media screen and (min-width: $min-desktop) {
  #similars:not(:only-child) {
    .see-more-btn {
      padding: 0 !important;
    }
  }
}
</style>

<style lang="scss">
@media screen and (max-width: $min-desktop) {
  .group-similars {
    .group-similars-list {
      width: 100%;

      > * {
        width: 100%;
      }
    }
  }
}

.group-similars-card {
  border: none !important;
  height: auto !important;

  .cropped-image {
    width: 4rem !important;
    height: 4rem !important;
  }
}
</style>
