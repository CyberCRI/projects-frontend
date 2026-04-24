import { ReviewModel } from '@/models/review.model'

export const projectReviewsSkeleton = (def?: Partial<ReviewModel>): ReviewModel => ({
  id: -1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  description:
    'Velit id fugiat sint occaecat ad laborum reprehenderit eu minim ut Lorem pariatur nulla voluptate.',
  title: 'Velit id fugiat sint occaecat',
  reviewer: {
    email: 'email@email.fr',
    family_name: 'jean',
    given_name: 'bonbeur',
    id: -1,
  },
  ...(def ?? {}),
})
