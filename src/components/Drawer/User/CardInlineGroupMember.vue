<script setup lang="ts">
import BaseCardInline from '~/components/Drawer/BaseCardInline.vue'
import type { TranslatedGroupMember } from '~/models/group.model'
import { capitalize } from '~/functs/string'

const props = defineProps<{
  member: TranslatedGroupMember
}>()

const attrs = useAttrs()

const label = computed(
  () => `${capitalize(props.member.given_name)} ${capitalize(props.member.family_name)}`
)
</script>

<template>
  <BaseCardInline
    :label="label"
    :image="member.profile_picture"
    :description="member.$t.job"
    :default-picture="DEFAULT_USER_PATATOID"
    :data-test="`group-member-card-${label}`"
    v-bind="attrs"
  />
</template>
