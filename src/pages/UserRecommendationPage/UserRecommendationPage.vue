<script setup lang="ts">
import PaginationButtonsV2 from '~/components/base/navigation/PaginationButtonsV2.vue'
import { getUsersRecommendationsForUser } from '~/api/v2/recommendations.service'
import { factoryPagination } from '~/skeletons/base.skeletons'
import NothingHere from '~/components/base/NothingHere.vue'
import { userSkeleton } from '~/skeletons/user.skeletons'

const organizationCode = useOrganizationCode()
const { t } = useNuxtI18n()

const { status, data, pagination } = getUsersRecommendationsForUser(organizationCode, {
  default: () => factoryPagination(userSkeleton, 10),
})

useLpiHead2({
  title: computed(() => t('recommendations.people.title')),
})
</script>

<template>
  <div class="page-section-wide page-top recommendation-page">
    <h1 class="page-title">
      {{ $t('recommendations.people.title') }}
    </h1>

    <FetchLoader :status="status" only-error skeleton>
      <div class="list-users">
        <UserCard
          v-for="user in data"
          :key="user.id"
          :user="user"
          :to-link="{
            name: 'ProfileOtherUser',
            params: {
              userId: user.slug || user.id,
            },
          }"
        />
        <NothingHere v-if="data.length === 0" class="m-auto" />
      </div>

      <PaginationButtonsV2 :pagination="pagination" />
    </FetchLoader>
  </div>
</template>

<style lang="scss" scoped>
.list-users {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
