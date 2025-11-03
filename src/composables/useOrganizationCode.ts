import { useRuntimeConfig } from '#imports'
import useOrganizationsStore from '@/stores/useOrganizations'

const useOrganizationCode = () => {
  const store = useOrganizationsStore()
  // If no organization set in the param use default one
  // TODO check why rootState.organizations.current is sometimes null
  // the fallback on env value is a temporary fix
  const runtimeConfig = useRuntimeConfig()

  return store.current?.code || runtimeConfig.public.appApiOrgCode
}
export default useOrganizationCode
