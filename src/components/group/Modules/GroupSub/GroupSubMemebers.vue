<template>
  <UserCard :user="member">
    <template #actions></template>
  </UserCard>
</template>

<script setup lang="ts">
import { TranslatedGroupMember } from '@/models/group.model'

defineProps<{
  member: TranslatedGroupMember
}>()
</script>
