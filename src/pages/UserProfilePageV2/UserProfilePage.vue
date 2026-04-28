<script setup lang="ts">
import { getUser } from '~/api/people.service'

const props = withDefaults(
  defineProps<{
    userId?: string | number
    isEditing?: boolean
  }>(),
  {
    userId: null,
    isEditing: false,
  }
)

const router = useRouter()
const route = useRoute()

watchEffect(async () => {
  if (!props.userId) {
    return
  }
  const user = await getUser(props.userId.toString(), true)
  useLpiHead2({
    title: `${user.given_name} ${user.family_name}`,
    description: user.short_description,
    image: user.profile_picture,
  })
})

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
      :is-editing="isEditing"
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
