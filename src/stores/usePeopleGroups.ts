import { defineStore } from 'pinia'

export interface PeopleGroupsState {
  currentId: number | null
}

const usePeopleGroupsStore = defineStore('peopleGroups', {
  state: (): PeopleGroupsState => ({
    currentId: null,
  }),
})

export default usePeopleGroupsStore
