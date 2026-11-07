<template>
  <RouterLink class="project-row" :to="toLink" :data-test="`project-row-${group.id}`">
    <!-- picture -->
    <div class="card-image">
      <CroppedApiImage
        :alt="`${group.name} image`"
        class="picture picture-group skeletons-background"
        :picture-data="group.header_image"
        picture-size="medium"
        :default-picture="DEFAULT_GROUP_PATATOID"
      />
    </div>
    <!-- header row -->
    <div class="card-action">
      <div v-if="modules.members" class="group-count skeletons-background">
        <IconImage name="MultiplePerson" class="icon" />
        {{ modules.members }}
      </div>
    </div>
    <!-- main row -->
    <h2 class="card-title skeletons-text">
      {{ translatedName }}
    </h2>
    <p class="card-description skeletons-text">
      {{ translatedShortDescription }}
    </p>
    <!-- footer row -->

    <div class="card-footer skeletons-text">
      <LinkButton
        v-if="modules.subgroups"
        :to="subgroupsLink"
        class="subgroups-link skeletons-background"
        :label="$t('group.see-subgroups', modules.subgroups)"
        btn-icon="ArrowRight"
      />
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import CroppedApiImage from '~/components/base/media/CroppedApiImage.vue'

import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import { DEFAULT_GROUP_PATATOID } from '~/composables/usePatatoids'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const { getTranslatableField } = useAutoTranslate()

const group = computed(() => props.group)
const slugOrId = computed(() => group.value?.slug || group.value?.id)
const translatedName = getTranslatableField(group, 'name')
const translatedShortDescription = getTranslatableField(group, 'short_description')

const toLink = computed(() => {
  return {
    name: 'Group',
    params: { groupIdOrSlug: slugOrId.value },
  }
})

const subgroupsLink = computed(() => {
  return {
    name: 'Groups',
    params: { groupIdOrSlug: slugOrId.value },
  }
})

const modules = computed(
  () => group.value?.modules ?? ({} as TranslatedPeopleGroupModel['modules'])
)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

$picture-size: 6rem;

.project-row {
  min-height: $picture-size;
  display: grid;
  grid-template: min-content min-content min-content / $picture-size 1fr max-content;
  grid-template-areas:
    'pict title action'
    'pict content content'
    'pict footer footer';
  gap: 1rem;
  align-items: stretch;
  border: 1px solid variables.$primary;
  border-radius: 1rem;
  padding: 1rem;

  @media screen and (max-width: variables.$min-tablet) {
    grid-template: min-content $picture-size min-content min-content / 1fr min-content;
    grid-template-areas:
      'title action'
      'pict pict'
      'content content'
      'footer footer';
  }
}

.card-image {
  grid-area: pict;
  align-content: center;

  @media screen and (max-width: variables.$min-tablet) {
    justify-self: center;
  }
}

.picture-group {
  width: $picture-size;
  height: $picture-size;
  border-radius: 100%;
  border: 1px solid variables.$light-gray;
}

.card-type {
  grid-area: header;
}

.card-action {
  grid-area: action;
  justify-self: flex-end;
}

.card-title {
  grid-area: title;
}

.card-description {
  grid-area: content;
}

.card-footer {
  grid-area: footer;
  justify-self: flex-end;
}

.card-title {
  font-weight: 700;
  font-size: 1.2rem;
}
</style>
