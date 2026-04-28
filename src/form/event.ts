import { EventForm } from '~/models/event.model'

export const defaultForm = (): EventForm => ({
  title: '',
  content: '<p></p>',
  start_date: null,
  end_date: null,
  // TODO rework that (people group is a object only for used in MultiGroupPicker)
  people_groups: {},
  visible_by_all: true,
  location: null,
})
