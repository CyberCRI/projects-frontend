import { CommentModel } from '@/models/comment.model'

export const projectCommentSkeleton = (def?: Partial<CommentModel>): CommentModel => ({
  id: -1,
  content: 'Laborum labore commodo commodo do tempor incididunt ex nulla nulla laborum.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: new Date().toISOString(),
  author: {
    email: 'email@email.fr',
    family_name: 'jean',
    given_name: 'bombeur',
    id: -1,
    people_id: -1,
  },
  images: [],
  ...(def ?? {}),
})
