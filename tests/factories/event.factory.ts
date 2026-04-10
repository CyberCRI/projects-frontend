import { EventModel } from '@/models/event.model'
import BaseFactory from './base.factory'
import { createFactory } from 'faker-create-factory'

export const EventFactory = createFactory<EventModel>((faker) => ({
  ...BaseFactory.generate(),
  id: 1,
  title: 'title',
  content: 'content',
  start_date: new Date().toISOString(),
  end_date: new Date().toISOString(),
  location: null,
  visible_by_all: true,
  people_groups: [],
}))
