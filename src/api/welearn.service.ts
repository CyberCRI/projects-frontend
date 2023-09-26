import { axios } from './api.config'
import { handleAsyncError } from './api.config'

export async function getSuggestedProjects(id) {
    const url = `${import.meta.env.VITE_APP_API_DEFAULT_VERSION}/project/${id}/similar/`

    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        handleAsyncError(error)
        return []
    }
}
