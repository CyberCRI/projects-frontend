import { axios } from './api.config'
import { handleAsyncError } from './api.config'

export async function getSuggestedProjects(id, orgCode) {
    const url = `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${id}/similar/`
    const payload = {
        params: {
            organizations: orgCode,
        },
    }
    try {
        const response = await axios.get(url, payload)
        return response.data
    } catch (error) {
        handleAsyncError(error)
        return []
    }
}
