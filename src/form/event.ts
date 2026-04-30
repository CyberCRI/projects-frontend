import type { EventForm } from '~/models/event.model'
import { NULL_CONTENT } from '~/functs/constants'

export const defaultForm = (): EventForm => ({
  title: '',
  content: NULL_CONTENT,
  start_date: null,
  end_date: null,
  // TODO rework that (people group is a object only for used in MultiGroupPicker)
  people_groups: {},
  visible_by_all: true,
  location: null,
})
