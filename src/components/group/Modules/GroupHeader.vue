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
    <template #content>
      <div class="group-info-container">
        <div class="group-image">
          <CroppedApiImage
            :alt="`${group.$t.name} image`"
            :picture-data="group.header_image"
            picture-size="medium"
            :default-picture="DEFAULT_GROUP_PATATOID"
          />
        </div>
        <!-- infos -->
        <div class="group-infos list-divider">
          <h1 class="group-title skeleton-block">
            {{ group.$t.name }}
          </h1>
          <p
            v-if="group.$t.short_description"
            class="short-description"
            v-html="group.$t.short_description"
          />
          <FetchLoader :status="status" only-error skeleton>
            <div class="group-leaders">
              <GroupMemberItem
                v-for="member in leaders"
                :key="member.id"
                :member="member"
                role-label=""
                mode="list"
              />
            </div>
          </FetchLoader>
          <TagsList
            v-if="group.tags.length"
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
      <div v-if="hasExtras" class="group-info-extras">
        <div v-if="hasLinks" class="group-info-links">
          <button
            v-if="group.location"
            class="group-recap-element group-location reset-btn"
            @click="openModal()"
          >
            <IconImage name="MapMarker" />
            <span class="group-recap-title">{{ t('group.location') }}</span>
          </button>
        </div>
        <SdgList
          class="group-info-sdgs"
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
      <!-- drawer views -->
      <LocationDrawer
        v-if="group.location"
        :is-opened="stateModal"
        :locations="[group.location]"
        @close="closeModal()"
      />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import { DEFAULT_GROUP_PATATOID } from '@/composables/usePatatoids'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/components/group/Modules/BaseGroupPreview.vue'
import SdgList from '@/components/sdgs/SdgList.vue'
import TagsList from '@/components/tags/TagsList.vue'
import LocationDrawer from '@/components/map/LocationDrawer.vue'
import { getGroupMember } from '@/api/v2/group.service'
import GroupMemberItem from '@/components/group/Modules/Members/GroupMemberItem.vue'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { memberSkeleton } from '@/skeletons/group.skeletons'
import { factoryPagination } from '@/skeletons/base.skeletons'

const props = withDefaults(
  defineProps<{
    group: TranslatedPeopleGroupModel
    isLoading?: boolean
  }>(),
  { isLoading: false }
)

const { t } = useNuxtI18n()
const { openModal, closeModal, stateModal } = useModal()
const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group.id)

const { data: members, status } = getGroupMember(organizationCode, groupId, {
  query: { limit: 5 },
  default: () => factoryPagination(() => memberSkeleton({ is_leader: true }), 2),
})
const leaders = computed(() => members.value?.filter((item) => item.is_leader))

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

const hasLinks = computed(() => {
  return props.group.location
})
const hasExtras = computed(() => {
  return props.group.sdgs.length || hasLinks.value
})
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
  border-radius: 5px;
  border: 1px solid $primary;
  height: auto;
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;

  & > *:only-child {
    grid-column: span 2;
  }
}

.group-info-links {
  display: flex;
  justify-content: flex-start;
  align-items: start;
  flex-wrap: wrap;
}

.group-info-sdgs {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
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

.group-location {
  cursor: pointer;
}
</style>

<style lang="scss">
.group-leaders {
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  gap: 0.2rem;

  > * {
    pointer-events: none;

    // width: 100%;
    height: unset !important;
    border: none !important;

    .picture-user {
      width: 2.5rem !important;
      height: 2.5rem !important;
    }
  }
}
</style>
