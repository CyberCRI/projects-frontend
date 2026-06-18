import useOrganizationsStore from '~/stores/useOrganizations'
import useUsersStore from '~/stores/useUsers'

export const hasPermission = (permissions, scope, action, pk?) => {
  if (permissions[`${scope}.${action}`] && !pk) return permissions[`${scope}.${action}`]
  else if (pk) return permissions[`${scope}.${action}.${pk}`]
  return false
}

export const isAdminOrFacilitator = () => {
  const usersStore = useUsersStore()
  const organizationsStore = useOrganizationsStore()
  function _hasPermission(scope, action, pk?) {
    const permissions = usersStore.permissions
    return hasPermission(permissions, scope, action, pk)
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

export const isAdmin = () => {
  const usersStore = useUsersStore()
  const organizationsStore = useOrganizationsStore()
  function _hasPermission(scope, action, pk?) {
    const permissions = usersStore.permissions
    return hasPermission(permissions, scope, action, pk)
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
