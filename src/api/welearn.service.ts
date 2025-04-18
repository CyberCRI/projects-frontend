import useAPI from '@/composables/useAPI'

export async function getSuggestedProjects(id, orgCode) {
  const url = `/project/${id}/similar/`
  const payload = {
    params: {
      organizations: orgCode,
    },
    noError: true, // silent 404 errors
  }
  try {
    const response = await useAPI(url, payload)
    return response //.data.value
  } catch {
    return []
  }
}
