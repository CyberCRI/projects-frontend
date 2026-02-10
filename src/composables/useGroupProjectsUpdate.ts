import { getGroupProject, postGroupProjects, removeGroupProject } from '@/api/groups.service'

export default function useGroupProjectsUpdate(orgCode, groupId, form) {
  const groupProjectData = ref(null)

  const isSaving = ref(false)
  const isLoading = ref(false)

  const { translateProjects } = useAutoTranslate()

  const setProjectsData = async () => {
    isLoading.value = true
    const _groupProjectData = (await getGroupProject(orgCode.value, groupId)).results
    const _translatedGroupProjectData = translateProjects(_groupProjectData)

    groupProjectData.value = _translatedGroupProjectData.value.map((project) => ({ ...project })) // mapping and destructiring to avoid updating both arrays/object at the same time
    form.value.featuredProjects = _translatedGroupProjectData.value.map((project) => ({
      ...project,
    })) // this.groupProjectData  will serve as reference for add/delete ops
    isLoading.value = false
  }

  const updateGroupProjects = async () => {
    isSaving.value = true

    // TODO: check if featured projects are changed and triage add/remove
    const previousProjectsIndex = (groupProjectData.value || []).reduce((acc, curr) => {
      acc[curr.id] = curr
      return acc
    }, {})

    const currentProjectsIndex = (form.value.featuredProjects || []).reduce((acc, curr) => {
      acc[curr.id] = curr
      return acc
    }, {})

    const projectsToAdd = (form.value.featuredProjects || []).filter(
      (project) => !previousProjectsIndex[project.id]
    )

    const projectsToRemove = (groupProjectData.value || []).filter(
      (project) => !currentProjectsIndex[project.id]
    )

    if (projectsToAdd.length > 0) {
      const payloadProjects = {
        featured_projects: projectsToAdd.map((project) => project.id),
      }
      await postGroupProjects(orgCode.value, groupId, payloadProjects)
    }
    if (projectsToRemove.length > 0) {
      const payloadProjects = {
        featured_projects: projectsToRemove.map((project) => project.id),
      }
      await removeGroupProject(orgCode.value, groupId, payloadProjects as any)
    }
    isSaving.value = false

    return {
      removed: projectsToRemove.length,
      added: projectsToAdd.length,
    }
  }

  return { groupProjectData, isSaving, setProjectsData, updateGroupProjects, isLoading }
}
