import { createFactory } from 'faker-create-factory'

import { SdgOutput } from '@/models/sdg.model'
import BaseFactory from './base.factory'

const SdgFactory = createFactory<SdgOutput>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  background_color: faker.datatype.string(),
}))

export default SdgFactory
