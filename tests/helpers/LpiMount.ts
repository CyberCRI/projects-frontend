import type { RouteLocationRaw, RouteRecordRaw } from 'vue-router'
import type { ComponentMountingOptions } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { mount, shallowMount } from '@vue/test-utils'

import { mountSuspended } from '@nuxt/test-utils/runtime'
import { clickOutside, disableFocus } from '~/directives'
import routerOptions from '~/app/router.options'
import { createI18n, I18nT } from 'vue-i18n'
import type { I18nOptions } from 'vue-i18n'
import { NuxtLink } from '#components'
import type { Component } from 'vue'

// create globaly i18n
import MockComponent from './MockComponent.vue'
import english from '~/i18n/locales/en.json'
import french from '~/i18n/locales/fr.json'
import { setActivePinia } from 'pinia'
import { beforeAll } from 'vitest'
import pinia from '~/stores'

type OptionsMount<T extends Component> = ComponentMountingOptions<T> & {
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

beforeAll(() => {
  setActivePinia(pinia)
})

let routes
const defaultRoutes = () => {
  if (!routes) {
    routes = routerOptions.routes()
  }
  return routes
}

/**
 * build options for mount utils (auto create router/locale)
 *
 * @constant
 * @name buildOptions
 * @kind variable
 * @type {<T>(options?: OptionsMount<C>) => ComponentMountingOptions<T>}
 */
const buildOptions = <T>(options: OptionsMount<T> = {}): ComponentMountingOptions<T> => {
  const plugins = []

  const router = createRouter({
    history: createWebHistory(),
    routes: options.router || defaultRoutes(),
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
        I18nT,
      },
      ...options.global,
    },
  }
}

export const lpiMount = <C extends Component>(component: C, options: OptionsMount<C> = {}) => {
  return mount(component, buildOptions(options))
}

export const lpiShallowMount = <C extends Component>(
  component: C,
  options: OptionsMount<C> = {}
) => {
  return shallowMount(component, buildOptions(options))
}

export const lpiMountSuspended = <C extends Component>(
  component: C,
  options: OptionsMount<C> = {}
) => {
  return mountSuspended(component, buildOptions(options))
}

export const lpiShallowMountSuspended = <C extends Component>(
  component: C,
  options: OptionsMount<C> = {}
) => {
  return mountSuspended(component, { ...buildOptions(options), shallow: true })
}
