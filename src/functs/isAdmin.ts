import utils from '@/functs/functions'
// import permissions from '@/mixins/permissions'
import useOrganizationsStore from '@/stores/useOrganizations'
import useUsersStore from '@/stores/useUsers'

const isAdmin = () => {
  const usersStore = useUsersStore()
  const organizationsStore = useOrganizationsStore()
  function _hasPermission(scope, action, pk?) {
    const permissions = usersStore.permissions
    return utils.hasPermission(permissions, scope, action, pk)
  }
  return !!(
    usersStore.isConnected &&
    (_hasPermission('organization', 'delete_organization') ||
      usersStore.roles.some((role) => role === 'superadmins') ||
      usersStore.roles.some(
        (role) => role === `organization:#${organizationsStore.current.id}:admins`
      ))
  )
}
export default isAdmin
