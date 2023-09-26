import { createFactory } from 'faker-create-factory'
import { ProjectFactory } from './project.factory'
import { AnnouncementInput, AnnouncementOutput } from '@/models/announcement.model'
import BaseFactory from './base.factory'

export const AnnouncementFactory = createFactory<AnnouncementOutput>((faker) => ({
    ...BaseFactory.generate(),
    description: faker.lorem.paragraph(),
    title: faker.datatype.string(),
    type: ['na', 'job', 'traineeship'][Math.floor(Math.random() * 3)],
    status: faker.datatype.string(),
    deadline: new Date(),
    is_remunerated: faker.datatype.boolean(),
    project: ProjectFactory.generate(),
}))

export const AnnouncementInputFactory = createFactory<AnnouncementInput>((faker) => ({
    ...AnnouncementFactory.generate(),
    project_id: faker.datatype.string(),
}))
