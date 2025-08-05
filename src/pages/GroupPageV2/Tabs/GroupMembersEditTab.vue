<script setup>
import useOrganizationsStore from '@/stores/useOrganizations.ts'

const props = defineProps({ groupData: { type: Object, required: true } })

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

onMounted(setMembersData)
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
        @confirm="updateGroupMembers"
      >
        <GroupTeamSection v-model="form.members" />
      </FormPanel>
    </ClientOnly>
  </div>
</template>
