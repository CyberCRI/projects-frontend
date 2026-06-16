import type { TagModel } from '~/models/tag.model'

export const tagMapper = (t: TagModel) => ({ id: t.id, title: t.title, description: t.description })
