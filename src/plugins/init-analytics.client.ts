import initAnalytics from '@/app/initAnalytics'

export default defineNuxtPlugin(async () => {
  // console.log('analytic inited')
  await initAnalytics()
})
