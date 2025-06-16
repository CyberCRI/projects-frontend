<script setup>
import UserProfile from '@/components/people/UserProfile.vue'
import { getUser } from '@/api/people.service.ts'

import { getOrganizationByCode } from '@/api/organizations.service'
const props = defineProps({
  userId: {
    type: [String, Number],
    default: null,
  },
})

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

try {
  if (props.userId) {
    const user = await getUser(props.userId, true)
    const { image, dimensions } = useImageAndDimension(user.profile_picture, 'medium')
    useLpiHead(
      useRequestURL().toString(),
      `${user.given_name} ${user.family_name}`,
      user.short_description,
      image,
      dimensions
    )
  } else {
    const runtimeConfig = useRuntimeConfig()
    const organization = await getOrganizationByCode(runtimeConfig.public.appApiOrgCode)
    const { image, dimensions } = useImageAndDimension(organization?.banner_image, 'medium')
    useLpiHead(
      useRequestURL().toString(),
      computed(() => t('me.page-title')),
      organization?.dashboard_subtitle,
      image,
      dimensions
    )
  }
} catch (err) {
  // DGAF
  console.log(err)
}

function display404() {
  router.replace({
    name: 'page404',
    params: { pathMatch: route.path.substring(1).split('/') },
  })
}
</script>
<template>
  <div class="page-section-extra-wide profile-page">
    <UserProfileV2
      :key="userId"
      :user-id="userId"
      :show-page-link="false"
      routable-tabs
      @user-not-found="display404"
    />
  </div>
</template>

<style lang="scss" scoped>
.profile-page {
  padding-top: 6.5rem;
  padding-bottom: 6.5rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: stretch;
}
</style>
