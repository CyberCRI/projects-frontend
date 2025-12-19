import { getGroupMember, postGroupMembers, removeGroupMember } from '@/api/groups.service'

export default function useGroupMembersUpdate(orgCode, groupId, form) {
  const groupMemberData = ref(null)

  const isSaving = ref(false)

  const setMembersData = async () => {
    // fetch members
    console.log('fooo')
    const _groupMemberData = (await getGroupMember(orgCode.value, groupId)).results
    groupMemberData.value = _groupMemberData.map((member) => ({ ...member })) // mapping and destructiring to avoid updating both arrays/object at the same time
    form.value.members = _groupMemberData.map((member) => ({ ...member })) // this.groupMemberData will serve as reference for add/delete ops
  }

  const updateGroupMembers = async () => {
    isSaving.value = true

    const previousMembersIndex = (groupMemberData.value || []).reduce((acc, curr) => {
      acc[curr.id] = curr
      return acc
    }, {})

    const currentMembersIndex = (form.value.members || []).reduce((acc, curr) => {
      acc[curr.id] = curr
      return acc
    }, {})

    const membersToAdd = []
    const membersToRemove = []
    const leadersToAdd = []
    const leadersToRemove = []
    const managersToAdd = []
    const managersToRemove = []

    // a user is a manager OR a member
    // in both case it can ALSO be leader

    ;(form.value.members || []).forEach((member) => {
      const previous = previousMembersIndex[member.id]
      // if its a new user
      if (!previous) {
        if (member.is_leader) {
          leadersToAdd.push(member.id)
        } else if (member.is_manager) {
          managersToAdd.push(member.id)
        } else {
          membersToAdd.push(member.id)
        }
      } else {
        // old roles are now removed automacally on backend
        // when adding a new one

        if (member.is_leader && !previous.is_leader) {
          leadersToAdd.push(member.id)
        }

        if (member.is_manager && !previous.is_manager) {
          managersToAdd.push(member.id)
        }

        if (
          !member.is_leader &&
          !member.is_manager &&
          (previous.is_leader || previous.is_manager)
        ) {
          membersToAdd.push(member.id)
        }
      }
    })
    ;(groupMemberData.value || []).forEach((member) => {
      // if user is to be removed
      if (!currentMembersIndex[member.id]) {
        // if was leader remove from leaders independently of other roles
        if (member.is_leader) leadersToRemove.push(member.id)
        // if was manager remove from managers else remove from members
        if (member.is_manager) managersToRemove.push(member.id)
        else membersToRemove.push(member.id)
      }
    })

    // remove before adding to accomodate for role changes
    if (membersToRemove.length > 0 || leadersToRemove.length > 0 || managersToRemove.length > 0) {
      const toRemove = [...membersToRemove, ...leadersToRemove, ...managersToRemove]
      const body = {
        users: toRemove,
      }
      await removeGroupMember(orgCode.value, groupId, body as any)
    }

    if (membersToAdd.length > 0 || leadersToAdd.length > 0 || managersToAdd.length > 0) {
      const payloadMembers = {
        members: membersToAdd,
        leaders: leadersToAdd,
        managers: managersToAdd,
      }
      await postGroupMembers(orgCode.value, groupId, payloadMembers)
    }
    isSaving.value = false

    return {
      removed: membersToRemove.length + leadersToRemove.length + managersToRemove.length,
      added: membersToAdd.length + leadersToAdd.length + managersToAdd.length,
    }
  }

  return { groupMemberData, isSaving, setMembersData, updateGroupMembers }
}
