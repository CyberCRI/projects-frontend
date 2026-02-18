<template>
  <div class="group-projects">
    <FetchLoader :status="isLoading ? 'pending' : 'success'">
      <FormPanel
        :confirm-action-name="$t('common.save')"
        :asyncing="isSaving"
        @close="redirect(groupProjectData.length)"
        @confirm="save"
      >
        <ProjectSection v-model="form.featuredProjects" />
      </FormPanel>
    </FetchLoader>
  </div>
</template>

<script setup lang="ts">
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

// use group's org code if availabe
// to allow edition of groups on the meta portal (PROJ-1032)
const originalOrganizationCode = useOrganizationCode()
const organizationCode = computed(() => props.group.organization?.code || originalOrganizationCode)
const props = defineProps<{ group: TranslatedPeopleGroupModel }>()
const router = useRouter()

const form = ref({
  featuredProjects: [],
})

const { groupProjectData, setProjectsData, updateGroupProjects, isSaving, isLoading } =
  useGroupProjectsUpdate(organizationCode, props.group.id, form)

const { startEditWatcher, stopEditWatcher } = useEditWatcher(form)

// redirect to projects page only if the group still has projects
const redirect = (numberProject: number) => {
  router.push({
    name: numberProject ? 'groupProjects' : 'groupSnapshot',
    params: { groupId: props.group.id },
  })
}

const save = async () => {
  try {
    const { removed, added } = await updateGroupProjects()
    stopEditWatcher()
    // refresh group parent info
    await refreshNuxtData(`${organizationCode.value}::group::${props.group.id}`)
    redirect(groupProjectData.value.length - removed + added)
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  await setProjectsData()
  startEditWatcher()
})
</script>
