<template>
  <div class="other-org-account-card">
    <CroppedApiImage
      :alt="`${user.given_name} ${user.family_name} image`"
      class="img-container"
      :picture-data="user.profile_picture"
      picture-size="small"
      :default-picture="DEFAULT_USER_PATATOID"
    />
    <div class="text-wrapper">
      <h3 class="name">{{ user?.given_name }} {{ user?.family_name }}</h3>
      <h4 v-if="user?.job" class="job">
        {{ user.job }}
      </h4>
      <div v-if="isLoadingOrgRoles" class="loader">
        <LoaderSimple />
      </div>
      <ul v-else>
        <li
          v-for="orgRole in orgRoles"
          :key="`${orgRole.role}:${orgRole.orgName}`"
          class="role-line"
        >
          {{ roleI18n(orgRole.role) }}
          {{ $t('account.role-in-organization') }}
          {{ orgRole.orgName }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getOrganizations, getUser } from 'shared-projects-frontend/apis'

import CroppedApiImage from '~/components/base/media/CroppedApiImage.vue'
import LoaderSimple from '~/components/base/loader/LoaderSimple.vue'

import type { TranslatedUserModel } from 'shared-projects-frontend/models'
import { DEFAULT_USER_PATATOID } from '~/composables/usePatatoids'
import { roleI18n } from '~/functs/rolesUtils'

const props = defineProps<{
  user: TranslatedUserModel
}>()

const isLoadingOrgRoles = ref(false)
const orgRoles = ref([])
const { t } = useNuxtI18n()

const loadRoles = async () => {
  isLoadingOrgRoles.value = true
  // TODO: getOrganizations might be paginated if more than 100, we'll need to handle the case some day
  await Promise.all([getUser(props.user.id), getOrganizations()]).then(([user, orgs]) => {
    const orgIndex = orgs.results.reduce((acc, org) => {
      acc['#' + org.id] = org // the # is prefixed to org id in role code
      return acc
    }, {})
    orgRoles.value =
      user?.roles
        .filter((role) => role.match(/^organization:[^:]+:[^:]+$/))
        .map((role) => {
          const roleParts = role.split(':')
          return {
            role: roleParts[2],
            orgName: orgIndex[roleParts[1]]?.name || t('account.another-organization'),
          }
        }) || []
  })
  isLoadingOrgRoles.value = false
}

onMounted(() => loadRoles())
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.other-org-account-card {
  display: flex;
  align-items: center;
  padding: variables.$space-m;
  gap: variables.$space-m;
  box-sizing: border-box;
  border-radius: variables.$border-radius-m;
  background-color: variables.$primary-lighter;
}

.img-container {
  border-radius: 50%;
  background-size: cover;
  background-position: top center;
  width: variables.pxtorem(80px);
  height: variables.pxtorem(80px);
  flex-shrink: 0;
}

.name {
  font-size: variables.$font-size-m;
}

.job {
  font-weight: normal;
  font-size: variables.$font-size-m;
}

.loader {
  display: flex;
  justify-content: center;
}
</style>
