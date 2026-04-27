import { UserModel } from '@/models/user.model'

export const userSkeleton = (def?: Partial<UserModel>): UserModel => ({
  id: -1,
  slug: 'slug',
  roles: [],
  name: {
    firstname: 'firstname',
    lastname: 'lastname',
  },
  orgs: [],
  resources: {
    files: 0,
    links: 0,
  },
  permissions: [],
  people_groups: [],
  notifications: 0,
  privacy_settings: {
    email: 'hide',
    mobile_phone: 'hide',
    profile_picture: 'hide',
    publication_status: 'hide',
    skills: 'hide',
    socials: 'hide',
  },
  skills: [],
  email: 'email',
  given_name: 'given_name',
  family_name: 'family_name',
  pronouns: 'pronouns?',
  short_description: 'short_description?',
  description: 'description?',
  job: 'job',
  sdgs: [],
  ...(def || {}),
})
