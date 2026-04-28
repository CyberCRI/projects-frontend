import { EventModel } from '~/models/event.model'
import BaseFactory from './base.factory'
import { createFactory } from 'faker-create-factory'

export const EventFactory = createFactory<EventModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  title: faker.lorem.text(),
  content: faker.lorem.paragraphs(),
  start_date: faker.datatype.datetime().toISOString(),
  end_date: faker.datatype.datetime().toISOString(),
  location: null,
  visible_by_all: faker.datatype.boolean(),
  people_groups: [],
}))
