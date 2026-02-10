import { ProjectModel } from '@/models/project.model'
import { TagModel } from '@/models/tag.model'
import { factoriesSkeleton } from '@/skeletons/base.skeletons'
import { randomInt } from 'es-toolkit'

export const tagSkeleton = (def?: Partial<ProjectModel>): Omit<TagModel, 'id'> => ({
  title: 'Occaecat',
  title_fr: 'Occaecat',
  title_en: 'Occaecat',
  description: 'Adipisicing magna qui est esse do ipsum nostrud ut dolor.',
  description_en: 'Anim cupidatat nulla deserunt aliqua magna enim occaecat quis cupidatat Lorem.',
  description_fr:
    'Velit id fugiat sint occaecat ad laborum reprehenderit eu minim ut Lorem pariatur nulla voluptate.',
  ...(def || {}),
})

export const projectSkeleton = (def?: Partial<ProjectModel>): Omit<ProjectModel, 'id'> => ({
  title: 'title',
  description: 'Elit veniam consectetur sunt officia.',
  header_image: null,
  is_locked: false,
  is_shareable: false,
  purpose: 'Elit veniam consectetur sunt officia.',
  language: 'fr',
  locations: [],
  publication_status: 'public',
  life_status: 'completed',
  reviews: [],
  // @ts-expect-error no id in tags
  tags: factoriesSkeleton(tagSkeleton, randomInt(3)),
  is_followed: {
    is_followed: false,
    follow_id: null,
  },
  follows: [],
  links: [],
  files: [],
  announcements: [],
  blog_entries: [],
  goals: [],
  slug: 'slug',
  updated_at: '',
  ...(def || {}),
})
