declare module 'vue' {
    import { CompatVue } from 'vue'
    const Vue: CompatVue
    export default Vue
    // eslint-disable-next-line vue/prefer-import-from-vue
    export * from '@vue/runtime-dom'
    const { configureCompat } = Vue
    export { configureCompat }
}
