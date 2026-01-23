<template>
  <BaseGroupPreview :title="$t('group.presentation')" icon="Article">
    <template #content>
      <DescriptionExpandable
        :description="group.$t.description"
        :height-limit="400"
        class="description-content"
      />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/components/group/Modules/BaseGroupPreview.vue'

defineProps<{ group: TranslatedPeopleGroupModel }>()
</script>
