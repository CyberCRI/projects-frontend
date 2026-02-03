import { GroupMember } from '@/models/group.model'
import { PeopleGroupModel } from '@/models/invitation.model'

export const groupSkeleton = (): Omit<PeopleGroupModel, 'id'> => ({
  slug: 'slug',
  name: 'name',
  description: 'Esse culpa qui quis ea aliqua commodo reprehenderit minim elit dolore amet Lorem.',
  short_description:
    'Esse culpa qui quis ea aliqua commodo reprehenderit minim elit dolore amet Lorem.',
  email: 'email@email.fr',
  type: 'type',
  header_image: null,
  publication_status: 'public',
  organization: null,
  hierarchy: [],
  sdgs: [],
  tags: [],
  location: null,
  children: [],
  modules: {
    members: 0,
    featured_projects: 0,
    publications: 0,
    conferences: 0,
    similars: 0,
    subgroups: 0,
    locations: 0,
    gallery: 0,
  },
})

export const memberSkeleton = (): Omit<GroupMember, 'id'> => ({
  name: {
    firstname: 'firstname',
    lastname: 'lastname',
  },
  slug: 'string',
  email: 'email@email.fr',
  roles: [],
  orgs: [],
  given_name: 'given_name',
  family_name: 'family_name',
  permissions: [],
  description: 'description',
  resources: {
    files: 0,
    links: 0,
  },
  is_manager: false,
  is_leader: false,
})
