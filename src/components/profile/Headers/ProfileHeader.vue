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

      <p
        v-if="user.short_description"
        class="short-description skeletons-text"
        v-html="user.short_description"
      />

      <div v-if="user.researcher" class="sdg-ctn">
        <IdentifierLink
          v-for="identifier in user.researcher.identifiers"
          :key="identifier.value"
          :identifier="identifier"
          type="researcher"
        />
      </div>
    </div>

    <div v-if="user.researcher" class="researcher-aside">
      <div class="researcher-stats researcher-aside-block">
        <dl class="researcher-stat">
          <dt class="stat-label">Citations</dt>
          <dd class="stat-metric">3 376</dd>
        </dl>
        <dl class="researcher-stat">
          <dt class="stat-label">h-index</dt>
          <dd class="stat-metric">34</dd>
        </dl>
        <dl class="researcher-stat">
          <dt class="stat-label">i10-index</dt>
          <dd class="stat-metric">51</dd>
        </dl>
      </div>

      <div class="researcher-aside-block">
        <p class="researcher-short-bio">
          Ariel Lindner is a researcher in biology (INSERM) and co-founder of the Learning Planet
          Institute. He uses synthetic biology to study the fundamental mechanisms of aging at the
          cellular level.
        </p>
        <AIGeneratedMark />
      </div>
    </div>

    <div class="profile-footer">
      <div class="contacts">
        <LinkButton btn-icon="BookmarkLine" label="follow" />
        <LinkButton
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

import IdentifierLink from '~/components/profile/modules/Documents/IdentifierLink.vue'
import { capitalize } from '~/functs/string'

const props = defineProps<{
  user: TranslatedUserModel
}>()

const userFullName = useUserFullName(computed(() => props.user))

const contacts = ref([
  { icon: 'ExternalLink', label: 'Contact', link: 'https://google.com' },
  { icon: 'ExternalLink', label: 'Website', link: 'https://google.com' },
  { icon: 'ExternalLink', label: 'Google Scholar', link: 'https://google.com' },
  { icon: 'ExternalLink', label: 'ORCID', link: 'https://google.com' },
  { icon: 'ExternalLink', label: 'Scopus', link: 'https://google.com' },
  { icon: 'BlueSkyLine', label: '', link: 'https://google.com' },
  { icon: 'Linkedin', label: '', link: 'https://google.com' },
])
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
    flex-grow: 1;
    flex-basis: 100%;
    display: flex;
    flex-flow: column;

    > *:last-child {
      margin-bottom: 0 !important;
    }

    .job {
      font-size: variables.$font-size-l;
      font-weight: 400;
      margin-bottom: variables.$space-l;
    }

    .short-description {
      font-weight: 400;
      font-size: variables.$font-size-m;
      margin-bottom: variables.$space-l;
    }

    .short-bio {
      font-size: variables.$font-size-m;
      margin-bottom: variables.$space-l;
      display: flex;
    }

    .group-ctn {
      display: flex;
      gap: variables.$space-m;
      flex-wrap: wrap;
      margin-bottom: variables.$space-l;
    }

    .group-anim {
      transition: transform 0.3s ease-in-out;
      transform-origin: center bottom;
      display: inline-block;
      transform: translateZ(0);

      &:hover {
        transform: translateZ(0) scaleY(1.3);
      }
    }

    .group {
      cursor: pointer;
    }

    .sdg-ctn {
      display: flex;
      flex-wrap: wrap;
      gap: variables.$space-s;
      margin-top: variables.$space-l;

      .sdg-img {
        width: variables.pxtorem(40px);
        height: variables.pxtorem(40px);
        transition: all 0.2s ease-in-out;
        transform: translateZ(0);

        &:hover {
          transform: translateZ(0) scale(1.2);
        }
      }
    }
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
    gap: 1rem;
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
  }
}

.profile-footer {
  grid-area: footer;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  border: variables.$border-width-s solid variables.$primary;
  border-radius: variables.$border-radius-l;
  padding: 0.5rem 1rem;

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
    font-size: variables.$font-size-5xl;
    font-weight: 700;
    margin-bottom: variables.$space-l;
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

    .name {
      margin-bottom: variables.$space-s;
    }

    .short-bio {
      font-size: variables.$font-size-s;
      margin-bottom: variables.$space-m;
    }
  }
}
</style>
