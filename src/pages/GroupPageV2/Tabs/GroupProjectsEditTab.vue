<script setup lang="ts">
import { postGroupProjects, removeGroupProject } from '@/api/groups.service'
import { getGroupProject } from '@/api/v2/group.service'
import { useGroupProjectForm } from '@/form/group'
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

// use group's org code if availabe
// to allow edition of groups on the meta portal (PROJ-1032)
const organizationCode = computed(() => props.group?.organization || useOrganizationCode())
const props = defineProps<{ group: TranslatedPeopleGroupModel }>()
const isSaving = ref(false)
const router = useRouter()
const { data, status } = getGroupProject(organizationCode, props.group.id, {
  paginatedConfig: { limit: 999 },
})

const { form, cleanedData } = useGroupProjectForm()
const { startEditWatcher, stopEditWatcher } = useEditWatcher(form)

watch(data, () => {
  if (data.value) {
    form.value = {
      featured_projects: Array.from(new Set([...form.value.featured_projects, ...data.value])),
    }
  }
})

const redirectProject = () => {
  router.push({
    name: 'groupProjects',
    params: { groupId: props.group.id },
  })
}

const redirectHome = () => {
  router.push({
    name: 'groupSnapshot',
    params: { groupId: props.group.id },
  })
}

const redirect = (numberProject) => {
  if (numberProject) {
    redirectProject()
  } else {
    redirectHome()
  }
}

const save = async () => {
  isSaving.value = true
  const exists = data.value.map((el) => el.id)

  const toRemove = exists.filter((id) => !cleanedData.value.featured_projects.includes(id))
  const toAdd = cleanedData.value.featured_projects.filter((id) => !exists.includes(id))
  const actualProjectCount = exists.length - toRemove.length + toAdd.length

  try {
    await removeGroupProject(organizationCode.value, props.group.id, {
      featured_projects: toRemove,
    })
    await postGroupProjects(organizationCode.value, props.group.id, {
      featured_projects: toAdd,
    })
    stopEditWatcher()
    await refreshNuxtData(`people-group::${props.group.id}`)
    redirect(actualProjectCount)
  } catch (e) {
    console.log(e)
  }
  isSaving.value = false
}

onMounted(() => startEditWatcher())
</script>

<template>
  <div class="group-projects">
    <FetchLoader :status="status">
      <FormPanel
        :confirm-action-name="$t('common.save')"
        :asyncing="isSaving"
        @close="redirect(data)"
        @confirm="save"
      >
        <ProjectSection v-model="form.featured_projects" />
      </FormPanel>
    </FetchLoader>
  </div>
</template>
