import utils from '@/functs/functions'
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'

const isAdminOrFacilitator = () => {
  const usersStore = useUsersStore()
  const organizationsStore = useOrganizationsStore()
  function _hasPermission(scope, action, pk?) {
    const permissions = usersStore.permissions
    return utils.hasPermission(permissions, scope, action, pk)
  }
  const orgId = organizationsStore.current.id
  return !!(
    usersStore.isConnected &&
    (_hasPermission('organization', 'delete_organization') ||
      usersStore.roles.some(
        (role) =>
          role === 'superadmins' ||
          role === `organization:#${orgId}:admins` ||
          role === `organization:#${orgId}:facilitators`
      ))
  )
}
export default isAdminOrFacilitator
