import type { APIResponseList } from '@/api/types'
import useAPI from '@/composables/useAPI'

export async function getOrgUnits() {
    return await useAPI(`google/org-units/`, {}) //.data.value
}
