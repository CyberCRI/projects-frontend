import useUsersStore from '@/stores/useUsers'

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
      documentList.value = []
      return
    }

    const text = await response.text()

    if (!text) {
      // Empty response body; treat as no documents
      documentList.value = []
      return
    }

    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      console.error('Failed to parse vector store list response as JSON:', parseError)
      documentList.value = []
      return
    }

    return Array.isArray(data) ? data : []
  }

  return {
    fetchAll,
  }
}
