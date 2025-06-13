import useProjectsStore from '@/stores/useProjects'
import useUsersStore from '@/stores/useUsers'
import { HocuspocusProvider } from '@hocuspocus/provider'
import useToasterStore from '@/stores/useToaster'
import useOrganizationsStore from '@/stores/useOrganizations'

export default function useProjectSocket({ project, reloadProject, getBlogEntries }) {
  const runtimeConfig = useRuntimeConfig()

  const organizationsStore = useOrganizationsStore()
  const projectsStore = useProjectsStore()
  const usersStore = useUsersStore()
  const { canEditProject } = usePermissions()

  const { t } = useI18n()
  const toaster = useToasterStore()

  // computed

  const accessToken = computed(() => usersStore.accessToken)

  // data
  const sockerserver = ref(runtimeConfig.public.appWssHost)
  const provider = ref(null)

  // methods

  const cleanupProvider = () => {
    if (provider.value) {
      provider.value.destroy()
      provider.value = null
    }
  }

  const onProjectUpdate = async () => {
    const projectUpdates = provider.value.document.getMap('projectUpdates')
    const data = projectUpdates.get('data')

    // skip if we are the ones who updated the description
    if (provider.value.document.clientID == data.clientID) return

    // skip if update is before current project / blog data update time
    if (data.type == 'blog-entry-create' || data.type == 'blog-entry-update') {
      const old = (project.value.blog_entries || []).find((b) => b.id == data.id)
      if (old && old.updated_at >= data.updated_at) {
        return
      }
    } else if (data.type === 'description-update') {
      if (project.value.updated_at >= data.updated_at) {
        return
      }
    }

    // update project (yes, the whole project... TODO: fine grain this)
    reloadProject()
    if (data.type == 'blog-entry-create' || data.type == 'blog-entry-update') {
      getBlogEntries()
    }

    // real update, notify user
    const message = data.author_name + ' ' + t(data.scope)

    toaster.pushInfo(message)
  }

  const connectToSocket = () => {
    // listen for description updates
    // TODO permission
    if (canEditProject.value) {
      try {
        const providerParams = {
          projectId: projectsStore.currentProjectId,
          organizationId: organizationsStore.current.id,
        }

        provider.value = new HocuspocusProvider({
          url: sockerserver.value,
          name: 'description_update_' + project.value.id,
          token: accessToken.value,
          parameters: providerParams,
        })

        const projectUpdates = toRaw(provider.value).document.getMap('projectUpdates')

        // Listen for changes
        projectUpdates.observe(onProjectUpdate)
      } catch (e) {
        console.error('socket error', e)
      }
    }
  }

  const projectPatched = (data) => {
    if (provider.value?.document) {
      const projectUpdates = provider.value.document.getMap('projectUpdates')
      projectUpdates.set('data', { ...data, clientID: provider.value.document.clientID })
    }
  }

  return { connectToSocket, cleanupProvider, projectPatched }
}
