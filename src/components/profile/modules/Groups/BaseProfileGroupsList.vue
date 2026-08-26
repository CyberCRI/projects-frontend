<script setup lang="ts">
import type {
  TranslatedUserModel,
  TranslatedPeopleGroupModel,
} from 'shared-projects-frontend/models'
import { factoryPagination, maxSkeleton } from '@/skeletons/base.skeletons'
import { refreshUser } from '~/composables/user/refreshUser'
import SectionHeader from '~/components/base/SectionHeader.vue'
import NothingHere from '~/components/base/NothingHere.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { groupSkeleton } from '~/skeletons/group.skeletons'
import { getUserGroups } from '~/api/v2/user.service'
import GroupCard from '~/components/group/GroupCard.vue'

const props = withDefaults(
  defineProps<{
    profile: TranslatedUserModel
    limit?: number
    preview?: boolean
    editable?: boolean
  }>(),
  {
    limit: null,
    preview: false,
    editable: false,
  }
)

const { t } = useNuxtI18n()
const profileId = computed(() => props.profile.id)
const organizationCode = useOrganizationCode()
const limitGroupsSkeletons = computed(() => maxSkeleton(props.profile.modules.groups, props.limit))
const asyncing = ref(false)

const {
  status,
  data: groups,
  refresh,
} = getUserGroups(organizationCode, profileId, {
  paginationConfig: {
    limit: props.preview ? props.limit : 999999,
  },
  default: () => factoryPagination(groupSkeleton, limitGroupsSkeletons.value),
})

// const clear = () => {
//   asyncing.value = false
// }

// const fullRefresh = () =>
//   refreshUser(props.profile).then(() => {
//     refresh()
//     clear()
//   })
</script>

<template>
  <FetchLoader :status="status" only-error skeleton>
    <div class="teams">
        <SectionHeader
          v-if="!preview"
          :title="'GROUP WORDING TODO'"
          :has-button="false"
          :quantity="groups?.length"
        />
        <div class="team-groups">
            <GroupCard :group="group" v-for="group in groups" :key="group.id" />
        </div>
      <NothingHere v-if="groups?.length === 0" />
    </div>
  </FetchLoader>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.teams {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.team-card {
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 1rem;
}

.team-groups {
  display: flex;
  justify-content: flex-start;
  gap: 2rem;
  flex-wrap: wrap;

  .project-group {
    width: 100%;
    max-width: 200px;
  }
}
</style>
