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

const { setMembersData, updateGroupMembers, isSaving } = useGroupMembersUpdate(
  orgCode,
  props.group?.id,
  form
)

const { startEditWatcher } = useEditWatcher(form)

const save = async () => {
  try {
    await updateGroupMembers()
    startEditWatcher()
    await refreshNuxtData(`people-group::${props.group.id}`)
    router.push({ name: 'groupMembers', params: { groupId: props.group.id } })
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
        @close="
          $router.push({
            name: 'groupMembers',
            params: { groupId: group.id },
          })
        "
        @confirm="save"
      >
        <GroupTeamSection v-model="form.members" />
      </FormPanel>
    </ClientOnly>
  </div>
</template>
