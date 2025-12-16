<script setup lang="ts">
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

const organizationCode = useOrganizationCode()
const props = defineProps<{ group: TranslatedPeopleGroupModel }>()
const router = useRouter()

const orgCode = computed(() => {
  // use group's org code if availabe
  // to allow edition of groups on the meta portal (PROJ-1032)
  return props.group?.organization || organizationCode
})

const form = ref({
  featuredProjects: [],
})

const { setProjectsData, updateGroupProjects, isSaving } = useGroupProjectsUpdate(
  orgCode,
  props.group?.id,
  form
)

const { startEditWatcher } = useEditWatcher(form)

const save = async () => {
  try {
    await updateGroupProjects()
    startEditWatcher()
    await refreshNuxtData(`people-group::${props.group.id}`)
    router.push({ name: 'groupProjects', params: { groupId: props.group.id } })
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  await setProjectsData()
  startEditWatcher()
})
</script>

<template>
  <div class="group-projects">
    <FormPanel
      :confirm-action-name="$t('common.save')"
      :asyncing="isSaving"
      @close="
        $router.push({
          name: 'groupMembers',
          params: { groupId: group.id },
        })
      "
      @confirm="save"
    >
      <ProjectSection v-model="form.featuredProjects" />
    </FormPanel>
  </div>
</template>
