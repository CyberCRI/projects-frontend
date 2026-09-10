<script setup lang="ts">
import ProfileSummaryTab from '~/pages/UserPageV2/Tabs/ProfileSummaryTab.vue'
import type { UserSlugOrId } from 'shared-projects-frontend/models'
import LpiButton from '~/components/base/button/LpiButton.vue'
import FetchLoader from '~/components/base/FetchLoader.vue'
import { userSkeleton } from '~/skeletons/user.skeletons'
import { getUser } from '~/api/v2/user.service'
const props = withDefaults(
  defineProps<{
    isOpened: boolean
    userId?: UserSlugOrId
  }>(),
  { userId: null }
)

defineEmits<{
  close: []
}>()

const organizationCode = useOrganizationCode()

const {
  status,
  data: user,
  error,
} = getUser(
  organizationCode,
  computed(() => props.userId),
  {
    default: userSkeleton,
  }
)
</script>

<template>
  <BaseDrawer
    no-footer
    :is-opened="isOpened"
    :title="$t('profile.drawer_title')"
    @close="$emit('close')"
    @confirm="$emit('close')"
  >
    <FetchLoader :status="status" :error="error" only-error skeleton>
      <ProfileSummaryTab ref="profile-user" :user="user" />
      <LpiButton
        class="profile-link skeletons-background"
        btn-icon="Eye"
        :label="$t('profile.go-to-page')"
        :to="{
          name: 'ProfileUser',
          params: { userIdOrSlug: user.slug || user.id || '-1' },
        }"
      />
    </FetchLoader>
  </BaseDrawer>
</template>

<style lang="scss" scoped>
.profile-link {
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 1rem;
}
</style>
