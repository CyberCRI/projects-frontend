import { ProjectMemberOutput } from '@/models/project-member.model'

export interface PeopleGroupOutput {
    id: number
    name: string
    description: string
    email: string
    type: string
    organization: string
    managers: ProjectMemberOutput[]
    members: ProjectMemberOutput[]
    hierarchy: {
        additionalProp1: string
        additionalProp2: string
        additionalProp3: string
    }
    projects: {
        additionalProp1: string
        additionalProp2: string
        additionalProp3: string
    }
}
