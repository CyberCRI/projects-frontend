import useUsersStore from '@/stores/useUsers'

export const PROJECTS_DEFAULT_VECTOR_STORE_KEY = 'ProjectsDefaultVectorStoreKey'

export default function useVecorStore() {
  const usersStore = useUsersStore()
  const fetchAll = async () => {
    let headers = {}
    const accessToken = usersStore.accessToken // localStorage?.getItem('ACCESS_TOKEN')
    if (accessToken) headers = { Authorization: `Bearer ${accessToken}` }

    const response = await fetch(`/api/vector-store/list`, {
      headers,
    })

    if (!response.ok) {
      console.error(
        `Failed to fetch vector store documents: ${response.status} ${response.statusText}`
      )
      return []
    }

    const text = await response.text()

    if (!text) {
      // Empty response body; treat as no documents
      return []
    }

    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      console.error('Failed to parse vector store list response as JSON:', parseError)
      return []
    }

    return Array.isArray(data)
      ? data.map((d) => ({ ...d, vectorStoreKey: PROJECTS_DEFAULT_VECTOR_STORE_KEY }))
      : []
  }

  return {
    fetchAll,
    projectsDefaultVectorStore: PROJECTS_DEFAULT_VECTOR_STORE_KEY,
  }
}
