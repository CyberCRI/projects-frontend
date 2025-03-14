import useOrganizationsStore from '@/stores/useOrganizations'
import { useRuntimeConfig } from '#imports'
export default async function initOrganization() {
  const runtimeConfig = useRuntimeConfig()
  // Get org information on init
  const organizationsStore = useOrganizationsStore()
  await organizationsStore.getCurrentOrganization(runtimeConfig.public.appApiOrgCode)
}
