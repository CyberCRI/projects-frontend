<template>
  <div class="team">
    <ClientOnly>
      <FormPanel
        :confirm-action-name="$t('common.save')"
        :asyncing="isSaving"
        @close="redirect(groupMemberData)"
        @confirm="save"
      >
        <GroupTeamSection v-model="form.members" />
      </FormPanel>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

const props = defineProps<{ group: TranslatedPeopleGroupModel }>()
const router = useRouter()

// use group's org code if availabe
// to allow edition of groups on the meta portal (PROJ-1032)
const originalOrganizationCode = useOrganizationCode()
const organizationCode = computed(() => props.group?.organization.code || originalOrganizationCode)

const form = ref({
  members: [],
})

const { setMembersData, updateGroupMembers, isSaving, groupMemberData } = useGroupMembersUpdate(
  organizationCode,
  props.group?.id,
  form
)

const { startEditWatcher, stopEditWatcher } = useEditWatcher(form)

const redirect = (numberMembers) => {
  router.push({
    name: numberMembers ? 'groupMembers' : 'groupSnapshot',
    params: { groupId: props.group.id },
  })
}

const save = async () => {
  try {
    const { removed, added } = await updateGroupMembers()
    stopEditWatcher()
    // refresh group parent info
    await refreshNuxtData(`${organizationCode.value}::group::${props.group.id}`)
    redirect(groupMemberData.value.length - removed + added)
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  await setMembersData()
  startEditWatcher()
})
</script>
