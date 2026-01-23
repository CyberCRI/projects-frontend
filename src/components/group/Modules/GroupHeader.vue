<template>
  <BaseGroupPreview :loading="isLoading" title="">
    <template #header>
      <div class="group-visibility">
        <p>
          <span class="icon">
            <IconImage :name="groupVisibilityIcon" />
          </span>
          <span>
            {{ groupVisibilityLabel }}
          </span>
        </p>
      </div>
    </template>
    <template #skeleton>
      <GroupHeaderSkeleton />
    </template>
    <template #content>
      <div class="group-info-container">
        <div class="group-image">
          <CroppedApiImage
            :alt="`${group.$t.name} image`"
            :picture-data="group.header_image"
            picture-size="medium"
            :default-picture="DEFAULT_USER_PATATOID"
          />
        </div>
        <div class="group-infos list-divider">
          <h1 class="group-title skeleton-block">
            {{ group.$t.name }}
          </h1>
          <p
            v-if="group.$t.short_description"
            class="short-description"
            v-html="group.$t.short_description"
          />
          <TagsList
            v-if="group.tags"
            :tags="group.tags"
            :to="{
              name: 'GroupSearch',
              query: {
                sections: 'groups',
              },
            }"
          />
        </div>
      </div>
      <div class="group-info-extras">
        <div>
          <div v-if="group.location" class="group-recap-element">
            <IconImage name="MapMarker" />
            <span class="group-recap-title">{{ t('group.location') }}</span>
          </div>
        </div>

        <SdgList
          :sdgs="group.sdgs"
          :to="{
            name: 'Search',
            query: {
              section: 'groups',
              page: 1,
            },
          }"
        />
      </div>
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import SdgList from '@/components/base/SdgList.vue'
import { DEFAULT_USER_PATATOID } from '@/composables/usePatatoids'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/components/group/Modules/BaseGroupPreview.vue'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    isLoading?: boolean
  }>(),
  { isLoading: false }
)

const { t } = useNuxtI18n()

const groupVisibilityLabel = computed(() => {
  if (props.group.publication_status === 'public') {
    return t('group.visibility-public')
  } else if (props.group.publication_status === 'private') {
    return t('group.visibility-private')
  }
  return t('group.visibility-org')
})

const groupVisibilityIcon = computed(() =>
  props.group.publication_status === 'public' ? 'Eye' : 'EyeSlash'
)
</script>

<style lang="scss" scoped>
.group-info-container {
  display: grid;
  grid-template-columns: 240px 1fr;
}

.group-infos {
  padding: 1rem;
  gap: 0.3rem;
  display: flex;
  flex-direction: column;
}

.group-title {
  font-size: xx-large;
}

.group-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.group-visibility {
  p {
    font-weight: 700;
    font-size: $font-size-xs;
    color: $primary-dark;
    display: flex;
    align-items: center;
    gap: $space-s;

    .icon svg {
      fill: $primary-dark;
      width: $layout-size-xl;
      height: $layout-size-m;
    }
  }
}

.group-info-extras {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  border: 1px solid $primary;
  height: 30px;
  margin-top: 1rem;
}

.group-recap-element {
  display: flex;
  justify-content: center;
  align-items: center;
  color: $primary-dark;
  gap: 0.4rem;

  svg {
    width: 32px;
    fill: $primary;
  }
}

.group-recap-title {
  font-weight: bold;
}
</style>
