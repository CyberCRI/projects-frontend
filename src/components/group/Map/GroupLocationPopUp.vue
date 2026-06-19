<template>
  <CardLocationPopUp
    :location="location"
    :label="$t('group.view')"
    :to="{ name: 'Group', params: { groupIdOrSlug: group.slug || group.id } }"
    :image="group.header_image"
    :default-picture="DEFAULT_GROUP_PATATOID"
    :title="group.$t.name"
    :description="group.$t.short_description ?? group.$t.description"
  />
</template>

<script setup lang="ts" generic="T extends AnyTranslatedLocation">
import type CardLocationPopUp from '@/components/map/CardLocationPopUp.vue'
import type { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import type { AnyTranslatedLocation } from '@/models/location.model'
import { DEFAULT_GROUP_PATATOID } from '@/composables/usePatatoids'

defineProps<{ location: T; group: TranslatedPeopleGroupModel }>()
</script>
