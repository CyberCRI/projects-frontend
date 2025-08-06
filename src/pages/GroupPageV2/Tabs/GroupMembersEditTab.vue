<script setup>
import useOrganizationsStore from '@/stores/useOrganizations.ts'

const props = defineProps({ groupData: { type: Object, required: true } })

const emit = defineEmits('reload-group-members')

const organizationsStore = useOrganizationsStore()
const orgCode = computed(() => {
  // use group's org code if availabe
  // to allow edition of groups on the meta portal (PROJ-1032)
  return props.groupData?.organization || organizationsStore.current.code
})

const form = ref({
  members: [],
})

const { setMembersData, updateGroupMembers, isSaving } = useGroupMembersUpdate(
  orgCode,
  props.groupData?.id,
  form
)

const { hasChange, isSetup } = useEditWatcher(form)

const save = async () => {
  try {
    await updateGroupMembers()
    hasChange.value = false
    emit('reload-group-members')
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  await setMembersData()
  isSetup.value = true
})
</script>

<template>
  <div class="team">
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
        <GroupTeamSection v-model="form.members" />
      </FormPanel>
    </ClientOnly>
  </div>
</template>
