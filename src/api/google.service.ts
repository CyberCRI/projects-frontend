import { axios } from '@/api/api.config'
import { APIResponseList } from '@/api/types'

export async function getOrgUnits(): Promise<APIResponseList<string>> {
    return (await axios.get(`${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/google/org-units/`))
        .data
}
