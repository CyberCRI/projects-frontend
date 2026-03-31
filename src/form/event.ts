import { EventForm } from '@/models/event.model'

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

/**
 * safe convert date with not grid incrementation minutes ( modulo 15 )
 *
 * @function
 * @name sanitizeDate
 * @kind variable
 * @param {Date} date
 * @returns {Date}
 * @exports
 */
export const sanitizeDate = (date: Date) => {
  const minutes = Math.floor(date.getMinutes() / 15) * 15
  date.setHours(date.getHours(), minutes, 0, 0)

  return date
}
