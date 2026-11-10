<template>
  <NuxtLink
    :to="{
      name: 'ProfileUser',
      params: { userIdOrSlug: researcher.user.slug || researcher.user.id },
    }"
    class="similar-profile"
  >
    <CroppedApiImage
      :alt="`${researcher.display_name} image`"
      class="picture picture-user skeletons-background"
      :picture-data="researcher.user.profile_picture"
      picture-size="medium"
      :default-picture="DEFAULT_USER_PATATOID"
    />
    <div class="card-title skeletons-text text-ellipsis">
      {{ researcher.display_name }}
    </div>
    <div class="card-description skeletons-text text-ellipsis">
      {{ researcher.user.$t.job }}
    </div>
  </NuxtLink>
</template>
<script lang="ts" setup>
import type { TranslatedResearcher } from 'shared-projects-frontend/models'
import { DEFAULT_USER_PATATOID } from '~/composables/usePatatoids'

defineProps<{ researcher: TranslatedResearcher }>()
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.similar-profile {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

.card-title {
  font-weight: 600;
  font-size: 1rem;
}

.card-description {
  font-size: 1rem;
}

.picture {
  border-radius: 100%;
  height: variables.pxtorem(60px);
  width: variables.pxtorem(60px);
}
</style>
