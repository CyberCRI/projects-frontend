// import analytics from '@/analytics'

export default defineNuxtPlugin(async () => {
  useRouter().afterEach((to) => {
    // console.log('AFTER EACH')
    const isProjectPage = to.path.includes('projects') && !!to.params.slugOrId
    const additionalProperties = {
      // Only add project properties if it's a project page
      ...(isProjectPage && {
        project: {
          id: to.params.slugOrId,
        },
      }),
    }

    const scrollView = document.getElementById('scrollview')
    if (scrollView) scrollView.scrollTop = 0

    const analytics = useAnalytics()
    analytics.page.viewed(
      {
        name: String(to.name), // TODO this is a cheap fix, inverstigate the issue with typescript
        url: window.location.href,
      },
      additionalProperties
    )
  })
})
