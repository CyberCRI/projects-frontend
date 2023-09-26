import utils from '@/functs/functions'
import permissions from '@/mixins/permissions'

const isAdmin = (store) => {
    return !!(
        utils.isConnected() &&
        (permissions.methods.hasPermission('organization', 'delete_organization') ||
            store.getters['users/getUserRoles'].some((role) => role === 'superadmins') ||
            store.getters['users/getUserRoles'].some(
                (role) =>
                    role === `organization:#${store.getters['organizations/current'].id}:admins`
            ))
    )
}

export default isAdmin
