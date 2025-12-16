<script setup>
import useOrganizationsStore from '@/stores/useOrganizations.ts'

const props = defineProps({
  groupId: { type: Number, required: true },
  groupData: { type: Object, required: true },
})

const emit = defineEmits('reload-group-projects')

const organizationsStore = useOrganizationsStore()
const orgCode = computed(() => {
  // use group's org code if availabe
  // to allow edition of groups on the meta portal (PROJ-1032)
  return props.groupData?.organization || organizationsStore.current.code
})

const form = ref({
  featuredProjects: [],
})

const { setProjectsData, updateGroupProjects, isSaving } = useGroupProjectsUpdate(
  orgCode,
  props.groupId,
  form
)

const { startEditWatcher } = useEditWatcher(form)

const save = async () => {
  try {
    await updateGroupProjects()
    startEditWatcher()
    emit('reload-group-projects')
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
    <ClientOnly>
      <FormPanel
        :confirm-action-name="$t('common.save')"
        :asyncing="isSaving"
        @close="
          $router.push({
            name: 'groupMembers',
            params: { groupId: groupData.slug || groupData.id },
          })
        "
        @confirm="save"
      >
        <ProjectSection v-model="form.featuredProjects" />
      </FormPanel>
    </ClientOnly>
  </div>
</template>
