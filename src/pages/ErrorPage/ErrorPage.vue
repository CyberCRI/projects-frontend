<script setup lang="ts">
import useUsersStore from '~/stores/useUserStore'

import { useKeycloak } from '@dsb-norge/vue-keycloak-js'
import { usePublicURL } from '~/composables/usePublic'

const keycloak = useKeycloak()
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

const imageFullUrl = computed(() => usePublicURL(illustrationSrc.value))

const illustrationText = computed(() => {
  return isConnected.value
    ? t('page404.illustration-text')
    : t('page404.not-connected.illustration-text')
})

// watchEffect(() => {
//   useLpiHead2({
//     title: title.value,
//     description: title.value,
//     image: imageFullUrl.value,
//   })
// })
// TODO: check this
useLpiHead(useRequestURL().toString(), title.value, title.value, imageFullUrl.value)
</script>

<template>
  <div class="page404">
    <div class="content">
      <div class="banner-404">
        <h1 class="title">
          {{ title }}
        </h1>
        <I18nT :keypath="searchDescriptionPath" class="notice" tag="p">
          <NuxtLink v-if="isConnected" :to="{ name: 'Search' }">
            {{ t('page404.search-again') }}
          </NuxtLink>
          <a v-else href="" @click="login">{{ t('page404.not-connected.login') }}</a>
        </I18nT>
        <I18nT class="notice" keypath="page404.contact" tag="p">
          <a :href="`mailto:${t('page404.contact-mail')}`">
            {{ t('page404.contact-mail') }}
          </a>
        </I18nT>
        <LpiButton v-if="!isConnected" :label="t('common.login')" @click="keycloak.login" />
        <div class="illustration">
          <img :src="imageFullUrl" />
          <a :class="{ 'text--connected': !isConnected }" class="text" @click="keycloak.login">
            {{ illustrationText }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '~/design/scss/variables';

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
    margin-top: variables.pxtorem(92px);
    margin-bottom: variables.pxtorem(92px);
  }

  .banner-404 {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    flex-shrink: 1;
    width: variables.pxtorem(832px);

    .title {
      font-size: variables.pxtorem(40px);
      font-weight: 900;
      color: variables.$primary-dark;
      line-height: variables.$line-height-tight;
      margin-bottom: variables.pxtorem(28px);
    }

    .notice {
      text-align: center;

      & + .notice {
        margin-top: 1em;
        font-size: variables.$font-size-m;
        line-height: variables.$line-height-tight;
        margin-bottom: variables.$space-l;
      }

      a {
        font-weight: 700;
        color: variables.$primary-dark;
        text-decoration: underline;
      }
    }

    .illustration {
      margin: variables.pxtorem(42px) variables.pxtorem(62px) 0;
      position: relative;

      img {
        border-radius: variables.pxtorem(16px);
      }

      .text {
        position: absolute;
        left: variables.pxtorem(88px);
        right: variables.pxtorem(88px);
        bottom: variables.pxtorem(57px);
        font-size: variables.pxtorem(40px);
        line-height: 0.75;
        text-align: center;
        color: variables.$primary;
        font-weight: 700;
        filter: drop-shadow(8px 0 0 #20393d) drop-shadow(-8px 0 0 #20393d)
          drop-shadow(0 8px 0 #20393d) drop-shadow(0 -8px 0 #20393d);

        &--connected {
          bottom: variables.pxtorem(313px);
        }
      }
    }
  }
}
</style>
