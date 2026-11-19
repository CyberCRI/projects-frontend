import type {
  LinkedProject,
  ProjectModel,
  ProjectMemberModel,
  TagModel,
} from 'shared-projects-frontend/models'
import { factoriesSkeleton } from '@/skeletons/base.skeletons'
import { userSkeleton } from '~/skeletons/user.skeletons'
import { randomInt } from 'es-toolkit'

export const tagSkeleton = (def?: Partial<TagModel>): TagModel => ({
  id: -1,
  title: 'Occaecat',
  title_fr: 'Occaecat',
  title_en: 'Occaecat',
  description: 'Adipisicing magna qui est esse do ipsum nostrud ut dolor.',
  description_en: 'Anim cupidatat nulla deserunt aliqua magna enim occaecat quis cupidatat Lorem.',
  description_fr:
    'Velit id fugiat sint occaecat ad laborum reprehenderit eu minim ut Lorem pariatur nulla voluptate.',
  ...def,
})

export const projectSkeleton = (def?: Partial<ProjectModel>): ProjectModel => ({
  title: 'title',
  description: 'Elit veniam consectetur sunt officia.',
  header_image: null,
  is_locked: false,
  is_shareable: false,
  purpose: 'Elit veniam consectetur sunt officia.',
  language: 'fr',
  categories: [],
  organizations: [],
  publication_status: 'public',
  life_status: 'completed',
  tags: factoriesSkeleton(tagSkeleton, randomInt(3)),
  is_followed: {
    is_followed: false,
    follow_id: null,
  },
  sdgs: [],
  slug: 'slug',
  updated_at: '',
  modules: {
    members: 0,
    groups: 0,
    linked_projects: 0,
    similars: 0,
    locations: 0,
    comments: 0,
    goals: 0,
    blogs: 0,
    links: 0,
    files: 0,
    announcements: 0,
    reviews: 0,
    messages: 0,
    tabs: 0,
  },
  created_at: null,
  id: '',
  ...(def || {}),
})

export const projectLinkedSkeleton = (def?: Partial<LinkedProject>): LinkedProject => ({
  id: -1,
  project: projectSkeleton(),
  ...(def || {}),
})

export const projectMemberSkeleton = (def?: Partial<ProjectMemberModel>): ProjectMemberModel => ({
  ...userSkeleton(),
  role: 'owners',
  ...(def || {}),
})
