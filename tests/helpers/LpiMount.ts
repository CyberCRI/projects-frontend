import {
  createRouter,
  createWebHistory,
  RouteLocationRaw,
  Router,
  RouteRecordRaw,
} from 'vue-router'
import { createI18n, I18nOptions } from 'vue-i18n'
import { ComponentMountingOptions, mount, shallowMount } from '@vue/test-utils'
import { clickOutside, disableFocus } from '@/directives'
import pinia from './test-pinia'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import english from '@/i18n/locales/en.json'
import french from '@/i18n/locales/fr.json'
import routerOptions from '@/app/router.options'

// @ts-expect-error ignore other languages
const DEFAULT_I18N_OPTIONS = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: english,
    fr: french,
  },
} as I18nOptions

type OptionsMount<T> = ComponentMountingOptions<T> & {
  route?: RouteLocationRaw
  i18n?: I18nOptions
  router?: RouteRecordRaw[]
}

/**
 * build options for mount utils (auto create router/locale)
 *
 * @constant
 * @name buildOptions
 * @kind variable
 * @type {<T>(options?: OptionsMount<T>) => { options: ComponentMountingOptions<T>; plugins: { i18n: I18nOptions; router: Router; }; }}
 */
const buildOptions = <T>(
  options: OptionsMount<T> = {}
): {
  options: ComponentMountingOptions<T>
  plugins: { i18n: I18nOptions; router: Router }
} => {
  const plugins = []

  plugins.push(pinia)

  const i18n = createI18n({ legacy: false, ...(options?.i18n || DEFAULT_I18N_OPTIONS) })
  plugins.push(i18n)

  const router = createRouter({
    history: createWebHistory(),
    routes: options.router || routerOptions.routes(),
  })
  if (options.route) {
    router.push(options.route)
  }

  const props = (options.props || {}) as ComponentMountingOptions<T>['props']

  const mixins = (options.mixins || []) as ComponentMountingOptions<T>['global']['mixins']

  const stubs = (options.stubs || {}) as ComponentMountingOptions<T>['global']['stubs']
  const provide = (options.provide || {}) as ComponentMountingOptions<T>['global']['provide']

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
      // @ts-expect-error ignore other languages
      i18n,
      router,
    },
  }
}

export function lpiMount<T>(component, options: OptionsMount<T> = {}) {
  return mount(component, buildOptions<T>(options).options)
}

export function lpiShallowMount<T>(component, options: OptionsMount<T> = {}) {
  return shallowMount(component, buildOptions<T>(options).options)
}

export function lpiMountSuspended<T>(component, options: OptionsMount<T> = {}) {
  return mountSuspended(component, buildOptions<T>(options).options)
}

export function lpiShallowMountSuspended<T>(component, options: OptionsMount<T> = {}) {
  return mountSuspended(component, { ...buildOptions<T>(options).options, shallow: true })
}

export function lpiMountExtra<T>(component, options: OptionsMount<T> = {}) {
  const newOptions = buildOptions<T>(options)
  return {
    wrapper: mount(component, newOptions.options),
    ...newOptions.plugins,
  }
}

export function lpiShallowMountExtra<T>(component, options: OptionsMount<T> = {}) {
  const newOptions = buildOptions<T>(options)
  return {
    wrapper: shallowMount(component, newOptions.options),
    ...newOptions.plugins,
  }
}
