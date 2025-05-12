import useOrganizationsStore from '@/stores/useOrganizations'

export default defineNuxtRouteMiddleware(async function checkAccessRequestEnabled(to) {
  if (!to.meta?.checkAccessRequestEnabled || to.name == 'page404') return
  const organizationsStore = useOrganizationsStore()
  // check if access request is enabled and redirects to 404 if not
  if (!organizationsStore.current?.access_request_enabled) {
    // TODO: for some reason redirecting to 404 create infinite llop of redirection
    // return navigateTo({
    //   name: 'page404',
    //   params: { pathMatch: to.path.substring(1).split('/') },
    // })
    return navigateTo({
      name: 'HomeRoot',
    })
  }
})
