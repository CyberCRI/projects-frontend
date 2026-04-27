import { CommentModel } from '@/models/comment.model'
import { UserFactory } from '../../tests/factories/user.factory'

export const projectCommentSkeleton = (def?: Partial<CommentModel>): CommentModel => ({
  id: -1,
  content: 'Laborum labore commodo commodo do tempor incididunt ex nulla nulla laborum.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: new Date().toISOString(),
  author: UserFactory.generate(),
  images: [],
  replies: [],
  ...(def ?? {}),
})
