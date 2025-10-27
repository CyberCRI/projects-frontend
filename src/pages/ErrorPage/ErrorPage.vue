<script setup>
import { goToKeycloakLoginPage } from '@/api/auth/auth.service'
import useUsersStore from '@/stores/useUsers.ts'

const runtimeConfig = useRuntimeConfig()
const usersStore = useUsersStore()
const { t } = useNuxtI18n()

const isConnected = computed(() => {
  return usersStore.isConnected
})

const title = computed(() => {
  return isConnected.value ? t('page404.title') : t('page404.not-connected.title')
})

const searchDescriptionPath = computed(() => {
  return isConnected.value ? 'page404.search' : 'page404.not-connected.connect'
})

const illustrationSrc = computed(() => {
  return isConnected.value ? '/page404/page-404.png' : '/page404/not-connected-page-404.png'
})

const imageFullUrl = computed(() => {
  return runtimeConfig.public.appPublicBinariesPrefix + illustrationSrc.value
})

const illustrationText = computed(() => {
  return isConnected.value
    ? t('page404.illustration-text')
    : t('page404.not-connected.illustration-text')
})

const login = () => {
  goToKeycloakLoginPage()
}

useLpiHead(useRequestURL().toString(), title.value, title.value, imageFullUrl.value)
</script>
<template>
  <div class="page404">
    <div class="content">
      <div class="banner-404">
        <h1 class="title">
          {{ title }}
        </h1>
        <i18n-t :keypath="searchDescriptionPath" class="notice" tag="p">
          <NuxtLink v-if="isConnected" :to="{ name: 'Search' }">
            {{ $t('page404.search-again') }}
          </NuxtLink>
          <a v-else href="" @click="login">{{ $t('page404.not-connected.login') }}</a>
        </i18n-t>
        <i18n-t class="notice" keypath="page404.contact" tag="p">
          <a :href="`mailto:${$t('page404.contact-mail')}`">
            {{ $t('page404.contact-mail') }}
          </a>
        </i18n-t>
        <LpiButton v-if="!isConnected" :label="$t('common.login')" @click="login" />
        <div class="illustration">
          <img :src="imageFullUrl" />
          <a :class="{ 'text--connected': !isConnected }" class="text" @click="login">
            {{ illustrationText }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page404 {
  display: flex;
  flex-flow: column nowrap;

  .content {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    background: #fff;
    flex: 1 1 50%;
    margin-top: pxToRem(92px);
    margin-bottom: pxToRem(92px);
  }

  .banner-404 {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    flex-shrink: 1;
    width: pxToRem(832px);

    .title {
      font-size: pxToRem(40px);
      font-weight: 900;
      color: $primary-dark;
      line-height: $line-height-tight;
      margin-bottom: pxToRem(28px);
    }

    .notice {
      text-align: center;

      & + .notice {
        margin-top: 1em;
        font-size: $font-size-m;
        line-height: $line-height-tight;
        margin-bottom: $space-l;
      }

      a {
        font-weight: 700;
        color: $primary-dark;
        text-decoration: underline;
      }
    }

    .illustration {
      margin: pxToRem(42px) pxToRem(62px) 0;
      position: relative;

      img {
        border-radius: pxToRem(16px);
      }

      .text {
        position: absolute;
        left: pxToRem(88px);
        right: pxToRem(88px);
        bottom: pxToRem(57px);
        font-size: pxToRem(40px);
        line-height: 0.75;
        text-align: center;
        color: $primary;
        font-weight: 700;
        filter: drop-shadow(8px 0 0 #20393d) drop-shadow(-8px 0 0 #20393d)
          drop-shadow(0 8px 0 #20393d) drop-shadow(0 -8px 0 #20393d);

        &--connected {
          bottom: pxToRem(313px);
        }
      }
    }
  }
}
</style>
