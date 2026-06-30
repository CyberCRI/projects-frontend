import { createFactory } from 'faker-create-factory'

import { ProjectTab, ProjectTabItem, TranslatedProjectTab } from '~/models/projects-tabs.model'

export const ProjectTabFactory = createFactory<ProjectTab>((faker) => ({
  id: faker.datatype.number(),
  description: faker.lorem.text(),
  title: faker.lorem.text(),
  type: 'blog',
  show_preview: true,
  icon: 'Account',
  modules: {
    items: 0,
  },
}))

export const TranslatedProjectTabFactory = createFactory<TranslatedProjectTab>((faker) => ({
  ...ProjectTabFactory.generate(),
  $t: {
    description: faker.lorem.text(),
    title: faker.lorem.text(),
  },
}))

export const ProjectTabItemFactory = createFactory<ProjectTabItem>((faker) => ({
  content: faker.lorem.text(),
  title: faker.lorem.text(),
  id: faker.datatype.number(),
  created_at: faker.datatype.datetime().toISOString(),
  updated_at: faker.datatype.datetime().toISOString(),
}))
