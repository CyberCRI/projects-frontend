<template>
  <CardLocationTooltip
    :location="location"
    :label="$t('group.view')"
    :to="{ name: 'Group', params: { groupId: group.id } }"
    :image="group.header_image"
    :default-picture="DEFAULT_GROUP_PATATOID"
    :title="group.$t.name"
    :description="group.$t.short_description ?? group.$t.description"
  />
</template>

<script setup lang="ts">
import { AnyTranslatedLocation } from '@/models/location.model'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import { DEFAULT_GROUP_PATATOID } from '@/composables/usePatatoids'
import CardLocationTooltip from '@/components/map/CardLocationTooltip.vue'

const props = defineProps<{ location: AnyTranslatedLocation; group: TranslatedPeopleGroupModel }>()

watch(
  () => props.group,
  () => console.log(props.group),
  { immediate: true }
)
</script>
