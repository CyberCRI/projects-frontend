import utils from '@/functs/functions'
// import permissions from '@/mixins/permissions'
import useOrganizationsStore from '@/stores/useOrganizations'
// const isAdmin = (store) => {
//     const organizationsStore = useOrganizationsStore()
//     return !!(
//         utils.isConnected() &&
//         (permissions.methods.hasPermission('organization', 'delete_organization') ||
//             usersStore.getUserRoles.some((role) => role === 'superadmins') ||
//             usersStore.getUserRoles.some(
//                 (role) => role === `organization:#${organizationsStore.current.id}:admins`
//             ))
//     )
// }

const isAdmin = (store) => {
    const organizationsStore = useOrganizationsStore()
    function _hasPermission(scope, action, pk?) {
        const permissions = usersStore.getPermissions
        return utils.hasPermission(permissions, scope, action, pk)
    }
    return !!(
        utils.isConnected() &&
        (_hasPermission('organization', 'delete_organization') ||
            usersStore.getUserRoles.some((role) => role === 'superadmins') ||
            usersStore.getUserRoles.some(
                (role) => role === `organization:#${organizationsStore.current.id}:admins`
            ))
    )
}
export default isAdmin
