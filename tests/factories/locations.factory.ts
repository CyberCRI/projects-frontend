import { createFactory } from 'faker-create-factory'
import { LocationModel, LocationInput } from '@/models/location.model'
import BaseFactory from './base.factory'

export const LocationsFactory = createFactory<LocationModel>((faker) => ({
  ...BaseFactory.generate(),
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
