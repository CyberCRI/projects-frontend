import { createRouter, createWebHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { mount, shallowMount } from '@vue/test-utils'
import { clickOutside, disableFocus } from '@/directives'
import pinia from './test-pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import english from '@/i18n/locales/en.json'
import { MockRouter } from './router'

const defaultI18nOptions = () => {
  return {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: english,
    },
  }
}

function buildOptions(options: any = {}) {
  const plugins = []

  plugins.push(pinia)

  const i18n = createI18n({ legacy: false, ...(options?.i18n || defaultI18nOptions()) })
  plugins.push(i18n)

  const router = createRouter({
    history: createWebHistory(),
    routes: options.router || MockRouter(),
  })

  const props = options.props || {}

  const mixins = options.mixins || []

  const stubs = options.stubs || {}
  const provide = options.provide || {}

  const directives = { 'click-outside': clickOutside, 'disable-focus': disableFocus }

  return {
    options: {
      ...options,
      props,
      global: {
        plugins,
        mixins,
        directives,
        stubs,
        provide,
        ...options.global,
      },
    },
    plugins: {
      i18n,
      router,
    },
  }
}

export function lpiMount(component, options: any = {}) {
  return mount(component, buildOptions(options).options)
}

export function lpiShallowMount(component, options: any = {}) {
  return shallowMount(component, buildOptions(options).options)
}

export function lpiMountSuspended(component, options: any = {}) {
  return mountSuspended(component, buildOptions(options).options)
}

export function lpiShallowMountSuspended(component, options: any = {}) {
  return mountSuspended(component, { ...buildOptions(options).options, shallow: true })
}

export function lpiMountExtra(component, options: any = {}) {
  const _options = buildOptions(options)
  return {
    wrapper: mount(component, _options.options),
    ..._options.plugins,
  }
}

export function lpiShallowMountExtra(component, options: any = {}) {
  const _options = buildOptions(options)
  return {
    wrapper: shallowMount(component, _options.options),
    ..._options.plugins,
  }
}
