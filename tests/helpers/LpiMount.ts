import { createRouter, createWebHistory, RouteLocationRaw, RouteRecordRaw } from 'vue-router'
import { ComponentMountingOptions, mount, shallowMount } from '@vue/test-utils'
import { clickOutside, disableFocus } from '@/directives'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import routerOptions from '@/app/router.options'
import { createI18n, I18nOptions } from 'vue-i18n'
import { createTestingPinia } from '@pinia/testing'
import { NuxtLink } from '#components'

// create globaly i18n
import english from '@/i18n/locales/en.json'
import french from '@/i18n/locales/fr.json'
import MockComponent from './MockComponent.vue'

type OptionsMount<T> = ComponentMountingOptions<T> & {
  route?: RouteLocationRaw
  router?: RouteRecordRaw[]
}

// @ts-expect-error ignore other languages
const DEFAULT_I18N_OPTIONS = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
    fr: french,
  },
} as I18nOptions

const i18n = createI18n({ legacy: false, globalInjection: true, ...DEFAULT_I18N_OPTIONS })

const pinia = createTestingPinia({ stubActions: false })

/**
 * build options for mount utils (auto create router/locale)
 *
 * @constant
 * @name buildOptions
 * @kind variable
 * @type {<T>(options?: OptionsMount<T>) => ComponentMountingOptions<T>}
 */
const buildOptions = <T>(options: OptionsMount<T> = {}): ComponentMountingOptions<T> => {
  const plugins = []

  const router = createRouter({
    history: createWebHistory(),
    routes: options.router || routerOptions.routes(),
  })
  if (options.route) {
    router.push(options.route)
  }

  plugins.push(i18n)
  plugins.push(pinia)

  const props = (options.props || {}) as ComponentMountingOptions<T>['props']

  const mixins = (options.mixins || []) as ComponentMountingOptions<T>['global']['mixins']

  const stubs = (options.stubs || {}) as ComponentMountingOptions<T>['global']['stubs']
  const provide = (options.provide || {}) as ComponentMountingOptions<T>['global']['provide']

  const directives = { 'click-outside': clickOutside, 'disable-focus': disableFocus }

  return {
    ...options,
    props,
    global: {
      plugins,
      mixins,
      directives,
      stubs,
      provide,
      // pre-import nuxtlink for correct resolve
      // and ignore RouterLink
      components: {
        RouterLink: MockComponent,
        NuxtLink,
      },
      ...options.global,
    },
  }
}

export const lpiMount = <T>(component, options: OptionsMount<T> = {}) => {
  return mount(component, buildOptions<T>(options))
}

export const lpiShallowMount = <T>(component, options: OptionsMount<T> = {}) => {
  return shallowMount(component, buildOptions<T>(options))
}

export const lpiMountSuspended = <T>(component, options: OptionsMount<T> = {}) => {
  return mountSuspended(component, buildOptions<T>(options))
}

export const lpiShallowMountSuspended = <T>(component, options: OptionsMount<T> = {}) => {
  return mountSuspended(component, { ...buildOptions<T>(options), shallow: true })
}
