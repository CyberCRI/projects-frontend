import type { NewsfeedModel } from '~/models/newsfeed.model'

import { announcementSkeleton } from '~/skeletons/announcement.skeletons'
import { projectSkeleton } from '~/skeletons/project.skeletons'
import { newsSkeleton } from '~/skeletons/news.skeletons'
import { shuffle } from 'es-toolkit'

export const newsFeedSkeleton = (def?: Partial<NewsfeedModel>): Omit<NewsfeedModel, 'id'> => {
  const type = shuffle(['project', 'announcement', 'news'] as NewsfeedModel['type'][])[0]
  const data = {
    id: -1,
    type,
    ...def,
  }
  switch (type) {
    case 'project':
      // @ts-expect-error no id
      return { ...data, project: projectSkeleton() }
    case 'announcement':
      // @ts-expect-error no id
      return { ...data, announcement: announcementSkeleton() }
    case 'news':
      // @ts-expect-error no id
      return { ...data, news: newsSkeleton() }
  }
}
