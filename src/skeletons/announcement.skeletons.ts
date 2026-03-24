import { AnnouncementModel } from '@/models/announcement.model'
import { projectSkeleton } from '@/skeletons/project.skeletons'

export const announcementSkeleton = (
  def?: Partial<AnnouncementModel>
): Omit<AnnouncementModel, 'id'> => ({
  id: -1,
  title: 'title',
  description: 'Ipsum nostrud officia dolor esse exercitation mollit',
  type: 'na',
  status: 'open',
  // @ts-expect-error ignore id
  project: projectSkeleton(),
  deadline: '2020-05-01',
  is_remunerated: false,
  updated_at: '2020-05-01',
  create_at: '2020-05-01',
  ...(def || {}),
})
