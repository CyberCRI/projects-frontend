<template>
  <CardLocationTooltip
    :location="location"
    :label="$t('group.view')"
    :to="{ name: 'Group', params: { groupId: group.id } }"
    :image="group.header_image"
    :default-picture="DEFAULT_GROUP_PATATOID"
    :title="group.$t.name"
    :description="group.$t.short_description"
  />
</template>

<script setup lang="ts">
import { TranslatedLocation } from '@/models/location.model'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { DEFAULT_GROUP_PATATOID } from '@/composables/usePatatoids'
import CardLocationTooltip from '@/components/map/CardLocationTooltip.vue'

defineProps<{ location: TranslatedLocation; group: TranslatedPeopleGroupModel }>()
</script>
