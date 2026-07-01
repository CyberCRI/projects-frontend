import type { PeopleGroupModel } from '@/models/people-group.model'
import { userSkeleton } from '~/skeletons/user.skeletons'
import type { GroupMember } from '~/models/group.model'

export const groupSkeleton = (def?: Partial<PeopleGroupModel>): PeopleGroupModel => ({
  id: -1,
  slug: 'slug',
  name: 'name',
  description: 'Esse culpa qui quis ea aliqua commodo reprehenderit minim elit dolore amet Lorem.',
  short_description:
    'Esse culpa qui quis ea aliqua commodo reprehenderit minim elit dolore amet Lorem.',
  email: '',
  type: 'type',
  role: 'owner_groups',
  header_image: null,
  publication_status: 'public',
  organization: null,
  hierarchy: [],
  sdgs: [],
  tags: [],
  locations: [],
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
    news: 0,
    event: 0,
  },
  ...def,
})

export const memberSkeleton = (def?: Partial<GroupMember>): Omit<GroupMember, 'id'> => ({
  ...userSkeleton(),
  role: 'members',
  ...def,
})
