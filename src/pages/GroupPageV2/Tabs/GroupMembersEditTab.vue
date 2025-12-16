<script setup lang="ts">
import { TranslatedPeopleGroupModel } from '@/models/invitation.model'

const props = defineProps<{ group: TranslatedPeopleGroupModel }>()
const router = useRouter()

const organizationCode = useOrganizationCode()
const orgCode = computed(() => {
  // use group's org code if availabe
  // to allow edition of groups on the meta portal (PROJ-1032)
  return props.group?.organization || organizationCode
})

const form = ref({
  members: [],
})

const { setMembersData, updateGroupMembers, isSaving, groupMemberData } = useGroupMembersUpdate(
  orgCode,
  props.group?.id,
  form
)

const { startEditWatcher, stopEditWatcher } = useEditWatcher(form)

const redirectMember = () => {
  router.push({
    name: 'groupMembers',
    params: { groupId: props.group.id },
  })
}

const redirectHome = () => {
  router.push({
    name: 'groupSnapshot',
    params: { groupId: props.group.id },
  })
}

const redirect = (numberMembers) => {
  if (numberMembers) {
    redirectMember()
  } else {
    redirectHome()
  }
}

const save = async () => {
  try {
    const { removed, added } = await updateGroupMembers()
    console.log(removed, added, groupMemberData.value.length)
    const actualMembersCount = groupMemberData.value.length - removed + added
    stopEditWatcher()
    await refreshNuxtData(`people-group::${props.group.id}`)
    redirect(actualMembersCount)
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
