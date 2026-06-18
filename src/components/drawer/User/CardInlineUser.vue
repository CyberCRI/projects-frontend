<script setup lang="ts">
import BaseCardInline from '~/components/drawer/BaseCardInline.vue'
import type { TranslatedUserModel } from '~/models/user.model'
import { capitalize } from '~/functs/string'

const props = defineProps<{
  user: TranslatedUserModel
}>()

const attrs = useAttrs()

const label = computed(
  () => `${capitalize(props.user.given_name)} ${capitalize(props.user.family_name)}`
)
</script>

<template>
  <BaseCardInline
    :label="label"
    :image="user.profile_picture"
    :description="user.$t.job"
    :data-test="`user-card-${label}`"
    :default-picture="DEFAULT_USER_PATATOID"
    v-bind="attrs"
  />
</template>
