import { createFactory } from 'faker-create-factory'

import BaseFactory from './base.factory'
import {
    ProjectMembersAddEntry,
    ProjectMembersAddInput,
    ProjectMemberModel,
    ProjectMembersDeleteInput,
    ProjectMemberPeopleGroupOutput,
    ProjectTeamModel,
} from '@/models/project-member.model'

export const ProjectMemberFactory = createFactory<ProjectMemberModel>((faker) => ({
    ...BaseFactory.generate(),
    project: faker.datatype.string(),
    user: {
        id: faker.datatype.number(),
        keycloak_id: faker.datatype.uuid(),
        people_id: faker.datatype.uuid(),
    },
    group: 'members',
}))

export const ProjectTeamOutputFactory = createFactory<ProjectTeamModel>((faker) => ({
    ...BaseFactory.generate(),
    reviewers: ProjectMemberFactory.generateMany(2),
    members: ProjectMemberFactory.generateMany(2),
    owners: ProjectMemberFactory.generateMany(2),
    people_groups: ProjectMemberPeopleGroupOutputFactory.generateMany(2),
}))

export const ProjectMemberAddEntryFactory = createFactory<ProjectMembersAddEntry>((faker) => ({
    user: faker.datatype.uuid(), // keycloak id
    name: 'members',
}))

export const ProjectMemberAddInputFactory = createFactory<ProjectMembersAddInput>(() => ({
    members: [...ProjectMemberAddEntryFactory.generateMany(2)],
}))

export const ProjectMemberDeleteInputFactory = createFactory<ProjectMembersDeleteInput>(
    (faker) => ({
        user: faker.datatype.string(),
        name: faker.datatype.string(),
    })
)

export const ProjectMemberPeopleGroupOutputFactory = createFactory<ProjectMemberPeopleGroupOutput>(
    (faker) => ({
        id: faker.datatype.number(),
        description: faker.datatype.string(),
        name: faker.datatype.string(),
    })
)

export default ProjectMemberFactory
