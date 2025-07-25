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
            {{ $filters.capitalize(user.job) }}
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
    </div>
  </div>
</template>

<script>
import useOrganizationsStore from '@/stores/useOrganizations.ts'
export default {
  name: 'ProfileHeaderV2',

  props: {
    user: {
      type: Object,
      default: () => {},
    },
  },

  emits: ['edit-profile'],
  setup() {
    const organizationsStore = useOrganizationsStore()
    const runtimeConfig = useRuntimeConfig()
    return {
      organizationsStore,
      runtimeConfig,
    }
  },

  computed: {
    displayableGroups() {
      return this.user?.people_groups
        ? this.user.people_groups.filter(
            (group) => group.organization === this.organizationsStore.current?.code
          )
        : []
    },
  },
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
  }
}
</style>
