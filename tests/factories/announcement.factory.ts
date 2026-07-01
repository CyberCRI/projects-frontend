import {
  AnnouncementInput,
  AnnouncementModel,
  TranslatedAnnouncement,
} from '~/models/announcement.model'
import { ProjectFactory, TranslatedProjectFactory } from './project.factory'
import { createFactory } from 'faker-create-factory'
import BaseFactory from './base.factory'
import { shuffle } from 'es-toolkit'

export const AnnouncementFactory = createFactory<AnnouncementModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  updated_at: faker.datatype.datetime().toISOString(),
  created_at: faker.datatype.datetime().toISOString(),
  description: faker.lorem.paragraph(),
  title: faker.datatype.string(),
  type: shuffle([
    'na',
    'participant',
    'job',
    'traineeship',
  ] satisfies AnnouncementModel['type'][])[0],
  status: shuffle(['open', 'closed'] satisfies AnnouncementModel['status'][])[0],
  deadline: faker.datatype.datetime().toISOString(),
  is_remunerated: faker.datatype.boolean(),
  project: ProjectFactory.generate(),
}))

export const TranslatedAnnouncementFactory = createFactory<TranslatedAnnouncement>(() => {
  const ann = AnnouncementFactory.generate()

  return {
    ...ann,
    project: TranslatedProjectFactory.generate(),
    $t: {
      title: ann.title,
      description: ann.description,
      project: TranslatedProjectFactory.generate(),
    },
  }
})
