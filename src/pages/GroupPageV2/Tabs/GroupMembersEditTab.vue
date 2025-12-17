<script setup lang="ts">
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

const props = defineProps<{ group: TranslatedPeopleGroupModel }>()
const router = useRouter()

// use group's org code if availabe
// to allow edition of groups on the meta portal (PROJ-1032)
const orgCode = computed(() => props.group.organization || useOrganizationCode())

const form = ref({
  members: [],
})

const { setMembersData, updateGroupMembers, isSaving, groupMemberData } = useGroupMembersUpdate(
  orgCode,
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
    await refreshNuxtData(`people-group::${props.group.id}`)
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
