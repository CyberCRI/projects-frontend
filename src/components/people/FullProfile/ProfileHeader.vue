<template>
  <div class="profile-header">
    <div class="profile-content">
      <div class="img-block">
        <div class="img-ctn">
          <CroppedApiImage
            :alt="`${user.given_name} ${user.family_name} image`"
            :picture-data="user.profile_picture"
            picture-size="medium"
            default-picture="/placeholders/user_placeholder.svg"
          />
        </div>
      </div>

      <div class="user-info-ctn">
        <div class="main">
          <div class="name-ctn">
            <div class="name">
              {{ user.given_name }} {{ user.family_name }}
              <span v-if="user.pronouns && user.pronouns.length" class="pronouns">
                ({{ user.pronouns }})
              </span>
            </div>
          </div>

          <div class="job">
            {{ capitalize(user.job) }}
          </div>

          <div v-if="displayableGroups.length" class="group-ctn">
            <div v-for="group in displayableGroups" :key="group.id">
              <NuxtLink
                :to="{
                  name: 'Group',
                  params: {
                    groupId: group.id,
                  },
                }"
                class="group-anim"
              >
                <BadgeItem
                  v-if="group && group.name"
                  :label="group.name"
                  class="group"
                  size="small"
                />
              </NuxtLink>
            </div>
          </div>

          <p
            v-if="user.short_description"
            class="short-description"
            v-html="user.short_description"
          />

          <div v-if="user && user.sdgs && user.sdgs.length" class="sdg-ctn">
            <NuxtLink
              v-for="sdg in user.sdgs"
              :key="sdg"
              :to="`/search/people?sdgs=${sdg}&section=people&page=1`"
            >
              <img
                :alt="sdg"
                :src="`${runtimeConfig.public.appPublicBinariesPrefix}/sdgs/logo/SDG-${sdg}.svg`"
                class="sdg-img"
              />
            </NuxtLink>
          </div>
        </div>
      </div>

      <div
        class="user-contacts-ctn"
        :class="{
          'mail-only':
            !user.mobile &&
            !user.location &&
            !user.facebook &&
            !user.twitter &&
            !user.linkedin &&
            !user.skype,
        }"
      >
        <div v-if="user && user.email" class="social">
          <IconImage class="icon" name="Email" />
          <span>{{ user.email }}</span>
        </div>

        <!-- TODO: Use privacy settings -->
        <div v-if="user.mobile_phone" class="social">
          <IconImage class="icon" name="Phone" />
          <span>{{ user.mobile_phone }}</span>
        </div>

        <div v-if="user.landline_phone" class="social">
          <IconImage class="icon" name="Phone" />
          <span>{{ user.landline_phone }}</span>
        </div>

        <div v-if="user && user.location" class="social">
          <IconImage class="icon" name="MapMarker" />
          <span v-html="fixLocation(user.location)" />
        </div>

        <SocialNetworks :user="user" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { capitalize } from 'es-toolkit'

import IconImage from '@/components/base/media/IconImage.vue'
import BadgeItem from '@/components/base/BadgeItem.vue'
import SocialNetworks from './SocialNetworks.vue'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import useOrganizationsStore from '@/stores/useOrganizations.ts'

defineOptions({ name: 'ProfileHeader' })

const props = defineProps({
  user: {
    type: Object,
    default: () => {},
  },
})

const organizationsStore = useOrganizationsStore()
const runtimeConfig = useRuntimeConfig()

const displayableGroups = computed(() => {
  return props.user?.people_groups
    ? props.user.people_groups.filter(
        (group) => group.organization === organizationsStore.current?.code
      )
    : []
})

const fixLocation = (l) => {
  return l.split('\n').join('<br />')
}
</script>

<style lang="scss" scoped>
.profile-header {
  box-sizing: border-box;
  position: relative;

  .img-block {
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-basis: pxToRem(240px);
    width: pxToRem(240px);
    flex-shrink: 0;
    margin: 0 auto $space-xl;

    .img-ctn {
      width: pxToRem(240px);
      height: pxToRem(240px);
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
      width: 100%;
      margin-bottom: $layout-size-5xl;

      > *:last-child {
        margin-bottom: 0 !important;
      }

      .name-ctn {
        display: flex;
        width: 100%;
        align-items: center;
      }

      .name {
        flex-grow: 1;
        font-size: $font-size-5xl;
        font-weight: 700;
        margin-bottom: $space-l;
        text-transform: capitalize;
      }

      .pronouns {
        font-size: $font-size-l;
        font-weight: 400;
      }

      .job {
        font-size: $font-size-l;
        font-weight: 400;
        margin-bottom: $space-l;
      }

      .short-description {
        font-weight: 400;
        font-size: $font-size-m;
        margin-bottom: $space-l;
      }

      .short-bio {
        font-size: $font-size-m;
        margin-bottom: $space-l;
        display: flex;
      }

      .group-ctn {
        display: flex;
        gap: $space-m;
        flex-wrap: wrap;
        margin-bottom: $space-l;
      }

      .group-anim {
        transition: transform 0.3s ease-in-out;
        transform-origin: center bottom;
        display: inline-block;

        &:hover {
          transform: scaleY(1.3);
        }
      }

      .group {
        cursor: pointer;
      }

      .sdg-ctn {
        display: flex;
        flex-wrap: wrap;
        gap: $space-s;
        margin-top: $space-l;

        .sdg-img {
          width: pxToRem(40px);
          height: pxToRem(40px);
          transition: all 0.2s ease-in-out;

          &:hover {
            transform: scale(1.2);
          }
        }
      }
    }
  }

  .user-contacts-ctn {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    flex-basis: pxToRem(300px);
    justify-content: center;
    align-items: flex-start;
    padding: $layout-size-5xl;
    background-color: $primary-lighter;
    border-radius: $border-radius-l;
    border: $border-width-s solid $primary;
    align-self: stretch;

    &.mail-only {
      justify-content: center;
    }

    .social {
      display: flex;
      align-items: flex-start;

      span {
        padding-top: pxToRem(4px);
      }

      & ~ .social {
        margin-top: $space-m;
      }
    }

    .icon {
      width: 22px;
      height: 22px;
      fill: $primary-dark;
      margin-right: $space-xs;
      margin-top: 4px;
    }

    span {
      font-weight: 700;
      font-size: $font-size-m;
      color: $primary-dark;
    }
  }
}

@media screen and (min-width: $max-tablet) {
  .profile-header {
    border: $border-width-s solid $primary;
    border-radius: $border-radius-l;
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .profile-content {
      display: flex;
      align-items: center;
      gap: $space-l;
    }

    .img-block {
      padding: $space-xl 0 $space-xl $space-l;
      margin: 0;
    }

    .user-info-ctn {
      flex-grow: 1;
      align-items: flex-end;
      padding: $space-xl 0;

      .main {
        margin-bottom: 0;
      }

      .name {
        margin-bottom: $space-s;
      }

      .short-bio {
        font-size: $font-size-s;
        margin-bottom: $space-m;
      }
    }

    .user-contacts-ctn {
      padding: $space-xl $space-l;
      border-radius: 0 $border-radius-l $border-radius-l 0;
      border: 0 none;

      .mail-ctn {
        display: flex;
        align-items: center;
        margin-bottom: $space-m;

        svg {
          width: 10px;
          fill: $primary-dark;
          margin-right: $space-xs;
        }

        span {
          text-decoration: underline;
          font-weight: 700;
          font-size: $font-size-s;
          color: $primary-dark;
        }
      }

      .room {
        font-size: $font-size-s;
        margin-bottom: $space-m;
        display: flex;
        color: $primary-dark;
        font-weight: 700;

        .marker-icon {
          width: 14px;
          height: 14px;
          fill: $primary-dark;
        }
      }
    }
  }
}
</style>
