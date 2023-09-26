import { createFactory } from 'faker-create-factory'

import { WikipediaTagOutput } from '@/models/wikipedia-tag.model'
import BaseFactory from './base.factory'

const WikipediaTagFactory = createFactory<WikipediaTagOutput>((faker) => ({
    ...BaseFactory.generate(),
    project_id: faker.datatype.number(),
    name: faker.name.title(),
    name_fr: faker.name.title(),
    name_en: faker.name.title(),
    wikipedia_qid: faker.datatype.string(),
}))

export default WikipediaTagFactory
