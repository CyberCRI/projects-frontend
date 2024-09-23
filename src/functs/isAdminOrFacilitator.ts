import utils from '@/functs/functions'
import permissions from '@/mixins/permissions'
import useOrganizationsStore from '@/stores/useOrganizations'
const isAdminOrFacilitator = (store) => {
    const organizationsStore = useOrganizationsStore()
    const orgId = organizationsStore.current.id
    return !!(
        utils.isConnected() &&
        (permissions.methods.hasPermission('organization', 'delete_organization') ||
            store.getters['users/getUserRoles'].some(
                (role) =>
                    role === 'superadmins' ||
                    role === `organization:#${orgId}:admins` ||
                    role === `organization:#${orgId}:facilitators`
            ))
    )
}

export default isAdminOrFacilitator
