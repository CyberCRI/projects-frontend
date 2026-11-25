import { addPluginTemplate, defineNuxtModule } from '@nuxt/kit'

// this a a polyfill to method 'Array.toSorted'
export default defineNuxtModule({
  setup() {
    addPluginTemplate({
      filename: 'shim-tosorted.mjs',
      getContents: () => `
      import 'core-js/actual/array/to-sorted';
      export default defineNuxtPlugin(() => {});
      `,
    })
  },
})
