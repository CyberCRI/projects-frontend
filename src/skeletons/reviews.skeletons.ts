import { userSkeleton } from '@/skeletons/user.skeletons'
import type { ReviewModel } from '@/models/review.model'

export const projectReviewsSkeleton = (def?: Partial<ReviewModel>): ReviewModel => ({
  id: -1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  description:
    'Velit id fugiat sint occaecat ad laborum reprehenderit eu minim ut Lorem pariatur nulla voluptate.',
  title: 'Velit id fugiat sint occaecat',
  reviewer: userSkeleton(),
  ...(def ?? {}),
})
