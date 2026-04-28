<template>
  <BaseGroupPreview class="group-header-info shadowed-box" :loading="isLoading" title="">
    <template #header>
      <div class="group-visibility">
        <span class="icon">
          <IconImage :name="groupVisibilityIcon" />
        </span>
        <span>
          {{ groupVisibilityLabel }}
        </span>
      </div>
    </template>
    <template #content>
      <div class="group-info-container">
        <CroppedApiImage
          :alt="`${group.$t.name} image`"
          class="group-image"
          :picture-data="group.header_image"
          :default-picture="DEFAULT_GROUP_PATATOID"
        />
        <!-- infos -->
        <div class="group-infos">
          <h1 class="group-title">
            {{ group.$t.name }}
          </h1>
          <p
            v-if="group.$t.short_description"
            class="short-description"
            v-html="group.$t.short_description"
          />
          <FetchLoader v-if="leaders.length" :status="status" only-error skeleton>
            <div class="group-leaders">
              <GroupMemberItem
                v-for="member in leaders"
                :key="member.id"
                :member="member"
                mode="list"
                @click="openProfile(member)"
              />
            </div>
          </FetchLoader>
          <TagsList
            v-if="group.tags.length"
            :tags="group.tags"
            :to="{
              name: 'GroupSearch',
              query: {
                section: 'groups',
              },
            }"
          />
        </div>
      </div>
      <div v-if="hasExtras" class="group-info-extras">
        <div v-if="hasLinks" class="group-info-links">
          <!-- locations -->
          <button
            v-if="group.locations.length"
            class="group-recap-element group-location reset-btn"
            @click="openModal()"
          >
            <IconImage class="fill-primary" name="MapMarkerOutline" />
            <span class="group-recap-title text-ellipsis">{{ locationTitle }}</span>
          </button>
          <!-- contact -->
          <a
            v-if="group.email"
            :href="`mailto:${group.email}`"
            class="group-recap-element reset-btn"
          >
            <IconImage name="EmailOutline" />
            <span class="group-recap-title">{{ $t('group.contact') }}</span>
          </a>
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
        v-if="group.locations.length"
        :is-opened="stateModal"
        :locations="group.locations"
        @close="closeModal()"
      />
      <GroupMemberDrawer
        :is-opened="!!leaderIdDrawer"
        :member-id="leaderIdDrawer"
        @close="closeProfile"
      />
    </template>
  </BaseGroupPreview>
</template>

<script setup lang="ts">
import GroupMemberDrawer from '@/components/group/Modules/Members/GroupMemberDrawer.vue'
import GroupMemberItem from '@/components/group/Modules/Members/GroupMemberItem.vue'
import type { TranslatedPeopleGroupModel } from '@/models/invitation.model'
import BaseGroupPreview from '@/components/modules/BaseModulePreview.vue'
import { DEFAULT_GROUP_PATATOID } from '@/composables/usePatatoids'
import LocationDrawer from '@/components/map/LocationDrawer.vue'
import { factoryPagination } from '@/skeletons/base.skeletons'
import { memberSkeleton } from '@/skeletons/group.skeletons'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { getGroupMember } from '@/api/v2/group.service'
import TagsList from '@/components/tags/TagsList.vue'
import SdgList from '@/components/sdgs/SdgList.vue'

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
  default: () => factoryPagination(() => memberSkeleton({ is_leader: true }), 1),
  paginationConfig: {
    limit: 5,
  },
})
const leaders = computed(() => members.value?.filter((item) => item.is_leader) ?? [])

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
  return props.group.locations.length
})
const hasExtras = computed(() => {
  return props.group.sdgs.length || hasLinks.value
})

const locationTitle = computed(() => {
  // if many location are linked to this group
  // return global text "locations"
  // else if only one linked, return the title of first location
  if (props.group.locations.length > 1) {
    return t('group.location', props.group.locations.length)
  }
  const location = props.group.locations[0]
  return location.$t.title || t('group.location')
})

// preview leader
const leaderIdDrawer = ref<number>()
const openProfile = (leader) => (leaderIdDrawer.value = leader.id)
const closeProfile = () => (leaderIdDrawer.value = null)
</script>

<style lang="scss" scoped>
.group-info-container {
  display: grid;
  grid-template-columns: 240px 1fr;

  @media screen and (max-width: $min-tablet) {
    grid-template-columns: unset;
    grid-template-rows: 240px 1fr;
  }
}

.group-infos {
  padding: 0 1rem;
  gap: 0.3rem;
  display: flex;
  flex-direction: column;
}

.group-title {
  font-size: xx-large;
}

.group-image {
  border-radius: 100%;
  aspect-ratio: 1;
  margin: auto;
  width: 100%;
  height: auto;

  @media screen and (max-width: $min-tablet) {
    width: auto;
    height: 100%;
  }
}

.group-visibility {
  font-weight: 700;
  font-size: $font-size-xs;
  color: $primary-dark;
  display: flex;
  align-items: center;

  .icon svg {
    fill: $primary-dark;
    width: $layout-size-xl;
    height: $layout-size-m;
  }
}

.group-info-extras {
  padding: 1rem;
  border-radius: 5px;
  height: auto;
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media screen and (max-width: $min-desktop) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  & > *:only-child {
    grid-column: span 2;
  }
}

.group-info-links {
  display: flex;

  // justify-content: flex-start;
  // align-items: start;
  flex-wrap: wrap;
  gap: 0.2rem;
  overflow: hidden;

  @media screen and (max-width: $min-desktop) {
    flex-direction: column;
    gap: 0.5rem;
    justify-content: start;
    align-items: start;
  }
}

.group-info-sdgs {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;

  @media screen and (max-width: $min-desktop) {
    justify-content: flex-start;
  }
}

.group-recap-element {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--primary-dark);
  gap: 0.4rem;

  svg {
    width: 32px;
    fill: var(--primary-dark);
  }
}

.group-recap-title {
  font-weight: bold;
  text-align: start;
}

.group-location {
  cursor: pointer;
  overflow: hidden;
  width: 100%;
}
</style>

<style lang="scss">
.group-header-info .group-container {
  margin-top: 0 !important;
}

.group-leaders {
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  gap: 0.5rem;

  .basic-card .content {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }

  > * {
    height: unset !important;
    border: none !important;

    .picture-user {
      width: 2.5rem !important;
      height: 2.5rem !important;
    }
  }
}
</style>
