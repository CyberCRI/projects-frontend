<template>
  <div class="profile-header">
    <div class="profile-content">
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

      <div class="user-info-ctn">
        <div class="main">
          <div class="name-ctn">
            <div class="name skeletons-text">
              {{ userFullName }}
              <span v-if="user.pronouns && user.pronouns.length" class="pronouns">
                ({{ user.pronouns }})
              </span>
            </div>
          </div>

          <div class="job skeletons-text">
            {{ capitalize(user.$t.job) }}
          </div>

          <p
            v-if="user.short_description"
            class="short-description skeletons-text"
            v-html="user.short_description"
          />

          <div v-if="user && user.sdgs && user.sdgs.length" class="sdg-ctn">
            <SdgList
              :sdgs="user.sdgs || []"
              :to="{
                name: 'PeopleSearch',
                query: {
                  section: 'people',
                },
              }"
            />
          </div>

          <div v-if="user.researcher" class="sdg-ctn">
            <IdentifierLink
              v-for="identifier in user.researcher.identifiers"
              :key="identifier.value"
              :identifier="identifier"
              type="researcher"
            />
          </div>
        </div>
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
</script>

<style lang="scss" scoped>
@use '~/design/scss/variables';

.profile-header {
  position: relative;

  .img-block {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 variables.pxtorem(240px);
    width: variables.pxtorem(240px);
    margin: 0 auto variables.$space-xl;

    .img-ctn {
      width: variables.pxtorem(240px);
      height: variables.pxtorem(240px);
      border-radius: 100%;
      overflow: hidden;
      flex-shrink: 0;

      .cropped-image {
        width: 100%;
        height: 100%;
      }
    }
  }

  .user-info-ctn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .main {
      flex-grow: 1;
      flex-basis: 100%;
      display: flex;
      flex-flow: column;
      margin-bottom: variables.$layout-size-5xl;

      > *:last-child {
        margin-bottom: 0 !important;
      }

      .name-ctn {
        display: flex;
        flex-basis: 100%;
        align-items: center;
      }

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
}

@media screen and (min-width: variables.$max-tablet) {
  .profile-header {
    border: variables.$border-width-s solid variables.$primary;
    border-radius: variables.$border-radius-l;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .profile-content {
      display: flex;
      align-items: center;
      gap: variables.$space-l;
    }

    .img-block {
      padding: variables.$space-xl 0 variables.$space-xl variables.$space-l;
      margin: 0;
    }

    .user-info-ctn {
      flex-grow: 1;
      padding: variables.$space-xl 0;

      .main {
        margin-bottom: 0;
      }

      .name {
        margin-bottom: variables.$space-s;
      }

      .short-bio {
        font-size: variables.$font-size-s;
        margin-bottom: variables.$space-m;
      }
    }
  }
}
</style>
