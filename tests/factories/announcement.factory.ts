import { createFactory } from 'faker-create-factory'
import { ProjectFactory } from './project.factory'
import { AnnouncementInput, AnnouncementOutput } from '@/models/announcement.model'
import BaseFactory from './base.factory'
import { shuffle } from 'es-toolkit'

export const AnnouncementFactory = createFactory<AnnouncementOutput>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  updated_at: faker.datatype.datetime().toISOString(),
  create_at: faker.datatype.datetime().toISOString(),
  description: faker.lorem.paragraph(),
  title: faker.datatype.string(),
  type: shuffle(['na', 'participant', 'job', 'traineeship'] as AnnouncementOutput['type'][])[0],
  status: shuffle(['open', 'closed'] as AnnouncementOutput['status'][])[0],
  deadline: faker.datatype.datetime().toISOString(),
  is_remunerated: faker.datatype.boolean(),
  project: ProjectFactory.generate(),
}))

export const AnnouncementInputFactory = createFactory<AnnouncementInput>((faker) => ({
  ...AnnouncementFactory.generate(),
  project_id: faker.datatype.string(),
}))
