<template>
  <div class="profile-header">
    <div class="img-block">
      <div class="img-ctn">
        <CroppedApiImage
          :alt="`${userFullName} image`"
          :picture-data="user.profile_picture"
          picture-size="medium"
          :default-picture="DEFAULT_USER_PATATOID"
        />
      </div>
    </div>

    <div class="profile-title">
      <div class="name skeletons-text">
        {{ userFullName }}
        <span v-if="user.pronouns && user.pronouns.length" class="pronouns">
          ({{ user.pronouns }})
        </span>
      </div>
    </div>

    <div class="main">
      <div class="job skeletons-text">
        {{ capitalize(user.$t.job) }}
      </div>

      <div v-if="user.researcher" class="researcher-roles">
        <p v-for="(role, idx) in researcherRoles" :key="idx" class="researcher-role">
          <span class="role-label">{{ role.label }} —&nbsp;</span>
          <LinkButton class="role-structure" :label="role.structure" btn-icon="Building4" />
        </p>
      </div>
      <div v-if="user.researcher && sortedDomains.length" class="domain-list">
        <ResearcherDomain v-for="domain in sortedDomains" :key="domain.id" :domain="domain" />
      </div>
      <!--div v-if="user.researcher" class="sdg-ctn">
      <IdentifierLink
        v-for="identifier in user.researcher.identifiers"
        :key="identifier.value"
        :identifier="identifier"
        type="researcher"
      />
      </div-->
      <p
        v-if="!user.researcher && user.short_description"
        class="short-description skeletons-text"
        v-html="user.short_description"
      />
    </div>

    <div v-if="hasResearcherStat" class="researcher-aside">
      <div class="researcher-stats researcher-aside-block">
        <dl v-if="user.researcher.modules.citations" class="researcher-stat">
          <dt class="stat-label">{{ $t('researcher.stats.citations') }}</dt>
          <dd class="stat-metric">{{ user.researcher.modules.citations }}</dd>
        </dl>
        <dl v-if="user.researcher.h_index" class="researcher-stat">
          <dt class="stat-label">{{ $t('researcher.stats.h-index') }}</dt>
          <dd class="stat-metric">{{ user.researcher.h_index }}</dd>
        </dl>
        <dl v-if="user.researcher.i10_index" class="researcher-stat">
          <dt class="stat-label">{{ $t('researcher.stats.i10-index') }}</dt>
          <dd class="stat-metric">{{ user.researcher.i10_index }}</dd>
        </dl>
      </div>

      <div class="researcher-aside-block">
        <p class="researcher-short-bio">
          {{ user.researcher.short_bio }}
        </p>
        <AIGeneratedMark />
      </div>
    </div>

    <div class="profile-footer">
      <div class="contacts">
        <BaseModuleButton btn-icon="BookmarkLine" label="follow" />
        <BaseModuleButton
          v-for="(contact, idx) in contacts"
          :key="idx"
          :btn-icon="contact.icon"
          :label="contact.label"
          :to="contact.link"
        />
      </div>
      <div v-if="user?.sdgs?.length" class="main-sdgs">
        <SdgList
          :sdgs="user.sdgs.slice(0, 3) || []"
          :to="{
            name: 'PeopleSearch',
            query: {
              section: 'people',
            },
          }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TranslatedUserModel } from 'shared-projects-frontend/models'

import SdgList from '~/components/sdgs/SdgList.vue'

import { useUserFullName } from '~/composables/user/useUserFullName'
import { DEFAULT_USER_PATATOID } from '~/composables/usePatatoids'

// import IdentifierLink from '~/components/profile/modules/Documents/IdentifierLink.vue'
import { capitalize } from '~/functs/string'

const props = defineProps<{
  user: TranslatedUserModel
}>()

const userFullName = useUserFullName(computed(() => props.user))

const hasResearcherStat = computed(
  () =>
    props.user.researcher &&
    (props.user.researcher.modules.citations ||
      props.user.researcher.h_index ||
      props.user.researcher.i10_index)
)

const researcherRoles = ref([
  { label: 'Research Director, co-founder CRI and INSERM U1284 director', structure: 'INSERM' },
  { label: 'Co-Founder, Research Director of ELiS', structure: 'Learning Planet Institute' },
  { label: 'Member Board of Directors', structure: 'iGem' },
  { label: 'Member', structure: 'International Bioethics Committee (UNESCO)' },
])

const contacts = computed(() => {
  const res = []

  if (props.user.email) res.push({ icon: 'ExternalLink', label: 'Contact', link: props.user.email })
  if (props.user.website)
    res.push({ icon: 'ExternalLink', label: 'Website', link: props.user.website })
  // TODO
  res.push({ icon: 'ExternalLink', label: 'Google Scholar', link: 'https://google.com' })
  // TODO
  res.push({ icon: 'ExternalLink', label: 'ORCID', link: 'https://google.com' })
  // TODO
  res.push({ icon: 'ExternalLink', label: 'Scopus', link: 'https://google.com' })
  // TODO
  res.push({ icon: 'BlueSkyLine', label: '', link: 'https://google.com' })
  if (props.user.linkedin) res.push({ icon: 'Linkedin', label: '', link: props.user.linkedin })

  return res
})

const domains = computed(() => props.user?.researcher?.domains || [])
const sortedDomains = computed(() => domains.value.toSorted((a, b) => b.level - a.level))
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.profile-header {
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

    .job {
      font-size: variables.$font-size-l;
      font-weight: 400;
    }

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

.researcher-aside {
  grid-area: aside;
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
  width: 12rem;

  .researcher-aside-block {
    border: 1px solid variables.$lighter-gray;
    padding: 1rem;
  }

  .researcher-stats {
    display: flex;
    flex-flow: column nowrap;
    gap: 0.4rem;
  }

  .researcher-stat {
    display: flex;
    justify-content: space-between;

    .stat-metric {
      font-weight: 600;
    }
  }

  .researcher-short-bio {
    font-size: 0.8rem;
    padding-bottom: 0.8rem;
  }
}

.researcher-roles {
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;

  .researcher-role {
    display: inline-flex;
    flex-flow: row wrap;
    justify-content: flex-start;

    .role-label {
      font-weight: 600;
    }
  }
}

.domain-list {
  display: flex;
  flex-flow: row wrap;
  gap: 0.6rem;
  align-items: flex-start;
}

.profile-footer {
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
  }

  .main-sdgs {
    display: flex;
    gap: 1rem;
    justify-content: flex-start;
  }
}

.profile-title {
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

  .pronouns {
    font-size: variables.$font-size-l;
    font-weight: 400;
  }
}

@media screen and (min-width: variables.$max-tablet) {
  .profile-header {
    display: grid;
    grid-template: min-content 1fr min-content / min-content 1fr min-content;
    grid-template-areas:
      'picture title aside'
      'picture main aside'
      'footer footer footer';
    gap: 1rem;
    padding: 1rem;

    .short-bio {
      font-size: variables.$font-size-s;
      margin-bottom: variables.$space-m;
    }
  }
}
</style>
