<template>
  <CardLocationTooltip
    :location="location"
    :label="$t('group.view')"
    :to="{ name: 'Group', params: { groupIdOrSlug: group.slug || group.id } }"
    :image="group.header_image"
    :default-picture="DEFAULT_GROUP_PATATOID"
    :title="group.$t.name"
    :description="group.$t.short_description ?? group.$t.description"
  />
</template>

<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from '~/models/invitation.model'
import type { AnyTranslatedLocation } from '~/models/location.model'

import CardLocationTooltip from '~/components/map/CardLocationTooltip.vue'

import { DEFAULT_GROUP_PATATOID } from '~/composables/usePatatoids'

defineProps<{ location: AnyTranslatedLocation; group: TranslatedPeopleGroupModel }>()
</script>
