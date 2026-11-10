<template>
  <div class="group-header">
    <div class="img-block">
      <div class="img-ctn">
        <CroppedApiImage
          :alt="`${group.$t.name} image`"
          class="group-image"
          :picture-data="group.header_image"
          :default-picture="DEFAULT_GROUP_PATATOID"
        />
      </div>
    </div>

    <div class="group-title">
      <div class="name skeletons-text">
        {{ group.$t.name }}
      </div>
    </div>

    <div class="main">
      <div class="subsection group-visibility">
        <span class="icon">
          <IconImage :name="groupVisibilityIcon" />
        </span>
        <span>
          {{ groupVisibilityLabel }}
        </span>
      </div>
      <div v-if="short_description" class="subsection">
        <p class="short-description skeletons-text" v-html="short_description" />
        <AIGeneratedMark v-if="group.structure" />
      </div>
      <div v-if="leaders.length" class="subsection">
        <FetchLoader :status="status" only-error skeleton>
          <div class="group-leaders">
            <HeaderUserCard
              v-for="member in leaders"
              :key="member.id"
              :member="member"
              mode="list"
              @click="openProfile(member)"
            />
          </div>
        </FetchLoader>
      </div>

      <div v-if="group.structure && sortedDomains.length" class="subsection domain-list">
        <ResearcherDomain v-for="domain in sortedDomains" :key="domain.id" :domain="domain" />
      </div>
      <TagsList
        v-if="!group.structure && group.tags.length"
        :tags="group.tags"
        :to="{
          name: 'GroupSearch',
          query: {
            section: 'groups',
          },
        }"
        class="subsection"
      />
    </div>

    <div v-if="hasFooter" class="group-footer">
      <div class="contacts">
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
        <BaseModuleButton
          v-for="(contact, idx) in contacts"
          :key="idx"
          :btn-icon="contact.icon"
          :label="contact.label"
          :to="contact.link"
        />
      </div>
      <template v-if="group.sdgs?.length">
        <SdgList
          :sdgs="group.sdgs.slice(0, 3) || []"
          :to="{
            name: 'GroupSearch',
            query: {
              section: 'group',
            },
          }"
          class="main-sdgs"
        />
      </template>
    </div>
    <!-- drawer views -->
    <div>
      <LocationDrawer
        v-if="group.locations.length"
        :is-opened="stateModal"
        :locations="group.locations"
        class="emptyable"
        @close="closeModal()"
      />
      <UserProfileDrawer
        :is-opened="!!leaderIdDrawer"
        :user-id="leaderIdDrawer"
        class="emptyable"
        @close="closeProfile"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TranslatedPeopleGroupModel } from 'shared-projects-frontend/models'
import UserProfileDrawer from '~/components/drawer/User/UserProfileDrawer.vue'
import HeaderUserCard from '@/components/group/Modules/HeaderUserCard.vue'
import { DEFAULT_GROUP_PATATOID } from '@/composables/usePatatoids'
import LocationDrawer from '@/components/map/LocationDrawer.vue'
import { factoryPagination } from '@/skeletons/base.skeletons'
import { memberSkeleton } from '@/skeletons/group.skeletons'
import FetchLoader from '@/components/base/FetchLoader.vue'
import { getGroupMember } from '@/api/v2/group.service'
import TagsList from '@/components/tags/TagsList.vue'
import SdgList from '@/components/sdgs/SdgList.vue'

const props = defineProps<{
  group: TranslatedPeopleGroupModel
}>()

const { t } = useNuxtI18n()
const { openModal, closeModal, stateModal } = useModal()
const organizationCode = useOrganizationCode()
const groupId = computed(() => props.group.id)

const { data: members, status } = getGroupMember(organizationCode, groupId, {
  default: () => factoryPagination(() => memberSkeleton({ role: 'leaders' }), 1),
  paginationConfig: {
    limit: 5,
  },
})
const leaders = computed(() => members.value?.filter((item) => item.role === 'leaders') ?? [])

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

// const hasLinks = computed(() => {
//   return props.group.locations.length || props.group.email
// })
// const hasExtras = computed(() => {
//  return props.group.sdgs.length || hasLinks.value
// })

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

const short_description = computed(
  () =>
    props.group.$t.short_description ||
    (props.group.structure
      ? "L'équipe d'Alexandra Baffet étudie les cellules souches neurals et les mécanismes qui régulent la formation et l'évaolution du cortex cérébral, en comparant notamment les processus entre les espèces.'"
      : '')
)

const sortedDomains = computed(() => [
  {
    domain: {
      title_nl: null,
      description: '',
      description_et: null,
      description_nl: null,
      title_fr: 'Artificial Intelligence',
      title_ca: null,
      description_de: null,
      description_ca: null,
      description_en: null,
      title_es: null,
      id: 430,
      type: 'Wikipedia',
      title_de: null,
      title_en: 'Artificial Intelligence',
      secondary_type: 'tag',
      title: 'Artificial Intelligence',
      description_es: null,
      title_et: null,
      description_fr: null,
    },
    level: 90,
    tag: {
      title_nl: null,
      description: '',
      description_et: null,
      description_nl: null,
      title_fr: 'Artificial Intelligence',
      title_ca: null,
      description_de: null,
      description_ca: null,
      description_en: null,
      title_es: null,
      id: 430,
      type: 'Wikipedia',
      title_de: null,
      title_en: 'Artificial Intelligence',
      secondary_type: 'tag',
      title: 'Artificial Intelligence',
      description_es: null,
      title_et: null,
      description_fr: null,
      $t: { title: 'Artificial Intelligence', description: '' },
    },
  },
  {
    domain: {
      title_nl: null,
      description: '',
      description_et: null,
      description_nl: null,
      title_fr: 'Cognitive science',
      title_ca: null,
      description_de: null,
      description_ca: null,
      description_en: null,
      title_es: null,
      id: 430,
      type: 'Wikipedia',
      title_de: null,
      title_en: 'Cognitive science',
      secondary_type: 'tag',
      title: 'Cognitive science',
      description_es: null,
      title_et: null,
      description_fr: null,
    },
    level: 80,
    tag: {
      title_nl: null,
      description: '',
      description_et: null,
      description_nl: null,
      title_fr: 'Cognitive science',
      title_ca: null,
      description_de: null,
      description_ca: null,
      description_en: null,
      title_es: null,
      id: 430,
      type: 'Wikipedia',
      title_de: null,
      title_en: 'Cognitive science',
      secondary_type: 'tag',
      title: 'Cognitive science',
      description_es: null,
      title_et: null,
      description_fr: null,
      $t: { title: 'Cognitive science', description: '' },
    },
  },

  {
    domain: {
      title_nl: null,
      description: '',
      description_et: null,
      description_nl: null,
      title_fr: 'Robotics',
      title_ca: null,
      description_de: null,
      description_ca: null,
      description_en: null,
      title_es: null,
      id: 430,
      type: 'Wikipedia',
      title_de: null,
      title_en: 'Robotics',
      secondary_type: 'tag',
      title: 'Robotics',
      description_es: null,
      title_et: null,
      description_fr: null,
    },
    level: 60,
    tag: {
      title_nl: null,
      description: '',
      description_et: null,
      description_nl: null,
      title_fr: 'Robotics',
      title_ca: null,
      description_de: null,
      description_ca: null,
      description_en: null,
      title_es: null,
      id: 430,
      type: 'Wikipedia',
      title_de: null,
      title_en: 'Robotics',
      secondary_type: 'tag',
      title: 'Robotics',
      description_es: null,
      title_et: null,
      description_fr: null,
      $t: { title: 'Robotics', description: '' },
    },
  },
])

const contacts = computed(() => {
  const res = []

  if (props.group.email) {
    res.push({ icon: 'ExternalLink', label: 'Contact', link: `mailto:${props.group.email}` })
  }

  return res
})

const hasFooter = computed(
  () =>
    props.group?.locations.length ||
    props.group?.email ||
    contacts.value?.length ||
    props.group?.sdgs?.length
)
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

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

.group-header {
  position: relative;

  .img-block {
    $pic-size: variables.pxtorem(169px);

    grid-area: picture;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 $pic-size;
    width: $pic-size;
    margin: 0;

    .img-ctn {
      width: $pic-size;
      height: $pic-size;
      border-radius: 100%;
      overflow: hidden;
      flex-shrink: 0;

      .cropped-image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .main {
    grid-area: main;
    display: flex;
    flex-flow: column;
    gap: 1rem;

    .short-description {
      font-weight: 400;
      font-size: variables.$font-size-m;
    }
  }
}

.sdg-img {
  width: variables.pxtorem(40px);
  height: variables.pxtorem(40px);
  transition: all 0.2s ease-in-out;
  transform: translateZ(0);

  &:hover {
    transform: translateZ(0) scale(1.2);
  }
}

.domain-list {
  display: flex;
  flex-flow: row wrap;
  gap: 0.6rem;
  align-items: flex-start;
}

.group-footer {
  grid-area: footer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  border: variables.$border-width-s solid variables.$primary;
  border-radius: 4px;
  padding: 0.2rem 1rem;

  .contacts {
    display: flex;
    gap: 1rem;
    justify-content: flex-start;
    align-items: center;
  }

  .main-sdgs {
    display: flex;
    gap: 1rem;
    justify-content: flex-start;
    align-items: center;
  }
}

.group-title {
  grid-area: title;
  display: flex;
  flex-basis: 100%;
  align-items: center;

  .name {
    flex-grow: 1;
    font-size: variables.pxtorem(40px);
    font-weight: 700;
    text-transform: capitalize;
  }
}

@media screen and (min-width: variables.$max-tablet) {
  .group-header {
    display: grid;
    grid-template: min-content 1fr min-content / min-content 1fr min-content;
    grid-template-areas:
      'picture title aside'
      'picture main aside'
      'footer footer footer';
    gap: 1rem;
    padding: 1rem;

    .short-description {
      font-size: variables.$font-size-s;
      margin-bottom: variables.$space-m;
    }
  }
}

.group-visibility {
  font-weight: 700;
  font-size: variables.$font-size-xs;
  color: variables.$primary-dark;
  display: flex;
  align-items: center;

  .icon svg {
    fill: variables.$primary-dark;
    width: variables.$layout-size-xl;
    height: variables.$layout-size-m;
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

.subsection ~ .subsection {
  padding-top: 1rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0.5rem;
    width: 8rem;
    border-top: 1px solid variables.$light-gray;
  }
}

:deep(.group-leaders .picture-user) {
  width: 2.5rem !important;
  height: 2.5rem !important;
}
</style>
