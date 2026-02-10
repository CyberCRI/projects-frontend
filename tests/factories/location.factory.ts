import { createFactory } from 'faker-create-factory'

import { BaseTranslatedLocationModel, LocationModel } from '@/models/location.model'
import BaseFactory from './base.factory'

const LocationFactory = createFactory<LocationModel>((faker) => ({
  ...BaseFactory.generate(),
  id: faker.datatype.number(),
  title: faker.lorem.text(),
  description: faker.lorem.text(),
  lat: Number(faker.address.latitude()),
  lng: Number(faker.address.longitude()),
  type: 'team',
  project: null,
}))

export const BaseTranslatedLocationFactory = createFactory<BaseTranslatedLocationModel>(
  (faker) => ({
    ...BaseFactory.generate(),
    id: faker.datatype.number(),
    title: faker.lorem.text(),
    description: faker.lorem.text(),
    lat: Number(faker.address.latitude()),
    lng: Number(faker.address.longitude()),
    type: 'team',
    project: null,
    $t: {
      title: faker.lorem.text(),
      description: faker.lorem.text(),
    },
  })
)

export default LocationFactory
