import { createFactory } from 'faker-create-factory'

import { OrganizationTagOutput } from '@/models/organization-tag.model'
import BaseFactory from './base.factory'

const OrganizationTagFactory = createFactory<OrganizationTagOutput>((faker) => ({
    ...BaseFactory.generate(),
    name: faker.name.title(),
    organization: faker.datatype.string(),
}))

export default OrganizationTagFactory
