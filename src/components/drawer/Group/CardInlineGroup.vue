<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'
import BaseCardInline from '~/components/drawer/BaseCardInline.vue'

defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const attrs = useAttrs()
</script>

<template>
  <BaseCardInline
    :label="group.$t.name"
    :image="group.header_image"
    :description="group.short_description"
    :default-picture="DEFAULT_GROUP_PATATOID"
    :data-test="`group-card-${group.$t.name}`"
    v-bind="attrs"
  />
</template>
