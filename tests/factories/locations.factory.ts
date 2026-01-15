import { createFactory } from 'faker-create-factory'
import { LocationModel, LocationInput } from '@/models/location.model'
import BaseFactory from './base.factory'

export const LocationsFactory = createFactory<LocationModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  title: faker.lorem.text(),
  description: faker.lorem.text(),
  lat: faker.datatype.number(),
  lng: faker.datatype.number(),
  type: 'team',
  project: {
    id: faker.datatype.string(),
  },
}))

export const LocationsInputFactory = createFactory<LocationInput>((faker) => ({
  ...LocationsFactory.generate(),
  project_id: faker.datatype.string(),
}))
