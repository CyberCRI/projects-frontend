import { createFactory } from 'faker-create-factory'

import BaseModel from '@/models/base.model'

export const BaseFactory = createFactory<Required<BaseModel>>((faker) => ({
  id: faker.datatype.number(),
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: new Date(),
}))

export default BaseFactory
