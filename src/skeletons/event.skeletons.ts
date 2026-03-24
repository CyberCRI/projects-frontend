import { EventModel } from '@/models/event.model'

export const eventSkeleton = (def?: Partial<EventModel>): Omit<EventModel, 'id'> => ({
  id: -1,
  title: 'title',
  content: 'Ipsum nostrud officia dolor esse exercitation mollit',
  event_date: '2020-01-01',
  people_groups: [],
  created_at: '2020-01-01',
  updated_at: '2020-01-01',
  visible_by_all: true,
  ...(def || {}),
})
