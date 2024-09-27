import useOrganizationsStore from '@/stores/useOrganizations'

export default async function initOrganization() {
    // Get org information on init
    const organizationsStore = useOrganizationsStore()
    await organizationsStore.getCurrentOrganization(import.meta.env.VITE_APP_API_ORG_CODE)
}
