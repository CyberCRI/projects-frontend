export default function useProjectModals() {
  const modals = ref({
    project: {
      visible: false,
      editedItem: null,
    },
    goal: {
      visible: false,
      editedItem: null,
    },
    sdg: {
      visible: false,
    },
    goalOrSdg: {
      visible: false,
    },
    teamMember: {
      visible: false,
    },
    bug: {
      visible: false,
    },
    abuse: {
      visible: false,
    },
    announcement: {
      visible: false,
      editedItem: null,
    },
    resource: {
      visible: false,
      editedItem: null,
    },
    comment: {
      visible: false,
      editedItem: {
        originalComment: null,
        repliedComment: null,
      },
    },
    linkedProject: {
      visible: false,
      editedItem: null,
    },
    blogEntry: {
      visible: false,
      editedItem: null,
    },
    location: {
      visible: false,
      editedItem: null,
    },
  })

  const toggleAddModal = (modalType, editedItem = null) => {
    if (editedItem) {
      modals.value[modalType].editedItem = editedItem
    } else modals.value[modalType].editedItem = null

    modals.value[modalType].visible = !modals.value[modalType].visible
  }
  return { modals, toggleAddModal }
}
