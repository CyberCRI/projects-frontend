<template>
  <div class="page-section-medium introduction" data-test="home-organization-header">
    <div class="banner">
      <h1 class="mobile-not-connected-main-title">
        {{ organization?.dashboard_title }}
      </h1>
      <div v-if="hasBannerImage" class="banner-wrapper">
        <CroppedApiImage
          alt="welcome image"
          class="organization-banner"
          :ratio="1 / 1"
          :picture-data="organization?.banner_image"
          picture-size="medium"
          :default-picture="DEFAULT_USER_PATATOID"
        />
      </div>
      <div
        class="introduction-container"
        :class="{
          'with-image': hasBannerImage,
          'without-image': !hasBannerImage,
          'without-description': !hasDescription,
        }"
      >
        <h1 class="image-main-title">
          {{ organization?.$t?.dashboard_title }}
        </h1>
        <template v-if="hasDescription">
          <div v-if="showLessDescription" :style="styleDescription" class="description-limited">
            <HtmlLimiter
              :html="organization?.$t?.description || ''"
              :striped-tags="['table']"
              class="introduction-text homepage-introduction-text"
              @computed="descriptionLayoutComputed"
              @computing="computeDescriptionLayout"
            />
          </div>
          <div
            v-else
            class="introduction-text homepage-introduction-text"
            v-html="organization.description || ''"
          />
          <div class="description-toggle">
            <LinkButton
              v-if="!descriptionComputed || isDescriptionLimited"
              class="toggle-description-button"
              :label="showLessDescription ? $t('common.see-more') : $t('common.see-less')"
              :secondary="false"
              :btn-icon="showLessDescription ? 'ChevronDown' : 'ChevronUp'"
              @click="showLessDescription = !showLessDescription"
            />
          </div>
        </template>
        <div class="image-account-buttons">
          <LpiButton :label="$t('home.login')" :secondary="false" @click="logInUser" />
          <LpiButton
            v-if="isAccessRequestEnabled"
            :label="$t('home.account-request')"
            :secondary="true"
            class="login-button"
            @click="$router.push({ name: 'RequestAccess' })"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
import CroppedApiImage from '@/components/base/media/CroppedApiImage.vue'
import HtmlLimiter from '@/components/base/HtmlLimiter.vue'
import LpiButton from '@/components/base/button/LpiButton.vue'
import LinkButton from '@/components/base/button/LinkButton.vue'
import useOrganizationsStore from '@/stores/useOrganizations'
import { DEFAULT_USER_PATATOID } from '@/composables/usePatatoids'

const organizationsStore = useOrganizationsStore()
const styleDescription = ref({})
const isDescriptionLimited = ref(false)
const showLessDescription = ref(true)
const descriptionComputed = ref(false)

const organization = computed(() => organizationsStore.current)
const hasBannerImage = computed(() => organization.value && organization.value.banner_image)
const hasDescription = computed(() => !!organization.value?.description)
const isAccessRequestEnabled = computed(() => organization.value?.access_request_enabled)

// TODO(remi): heightLimit is not defined before refacto
const heightLimit = 0
const computeDescriptionLayout = () => {
  styleDescription.value = { height: `${heightLimit}px` }
  descriptionComputed.value = false
}
const descriptionLayoutComputed = (event) => {
  styleDescription.value = { height: event.height + 'px' }
  isDescriptionLimited.value = event.croppedHtml != organization.value?.$t?.description
  descriptionComputed.value = true
}
const logInUser = () => goToKeycloakLoginPage()
</script>
<style lang="scss" scoped>
.introduction {
  margin-top: $space-3xl;
  margin-bottom: $space-2xl;

  .mobile-not-connected-main-title {
    font-size: $font-size-xl;
    text-align: center;
    margin-bottom: $space-m;

    @media screen and (min-width: $min-tablet) {
      display: none;
    }
  }

  .banner {
    display: flex;
    flex-direction: column;
    gap: $space-l;

    @media screen and (min-width: $min-tablet) {
      flex-direction: row;
      gap: $space-2xl;
      align-items: stretch;
    }

    .banner-wrapper {
      @media screen and (min-width: $min-tablet) {
        flex-basis: 30%;
        flex-shrink: 0;
        .organization-banner {
          width: 17rem;
          height: 17rem;
        }
      }
    }

    .organization-banner {
      width: 100%;
      aspect-ratio: 1;
      border-radius: pxToRem(8px);

      @media screen and (max-width: $min-tablet) {
        width: 80%;
        margin: 0 auto;
      }

      @media screen and (min-width: $min-tablet) {
        margin-bottom: 0;
        margin-right: $space-2xl;
      }
    }

    .introduction-container {
      display: flex;
      flex-flow: column nowrap;
      flex-grow: 1;

      &.without-description {
        justify-content: center;
      }

      &.without-image {
        align-items: center;
        max-width: 50rem;
        margin: 0 auto;
      }

      .image-main-title {
        display: none;
      }

      @media screen and (min-width: $min-tablet) {
        .image-main-title {
          display: flex;
          font-weight: 700;
          font-size: $font-size-4xl;
          margin-bottom: $space-l;
        }
      }

      .image-account-buttons {
        display: flex;
        margin-top: $space-l;

        @media screen and (max-width: $min-tablet) {
          justify-content: center;
        }
      }
    }
  }
}

.login-button {
  margin-left: $space-s;
}

.description-toggle {
  display: flex;
  justify-content: flex-start;

  .toggle-description-button {
    padding-left: 0 !important;
  }
}

.description-limited {
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  flex-grow: 1;
  align-self: stretch;

  @media screen and (max-width: $min-tablet) {
    min-height: 8rem;
    height: 8rem;
  }
}

.without-image .description-limited {
  height: 6rem;
}
</style>
