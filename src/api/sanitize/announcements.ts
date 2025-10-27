import { Announcement } from '@/api/Swagger'

/**
 * filter announcement (remove private and deadline)
 *
 * @function
 * @name sanitizeAnnouncementsList
 * @kind variable
 * @param {Announcement[]} data
 * @returns {Announcement[]}
 * @exports
 */
export const sanitizeAnnouncementsList = (data: Announcement[]): Announcement[] => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return data.filter(
    (announcement) =>
      announcement.project.publication_status !== 'private' &&
      (!announcement.deadline || new Date(announcement.deadline) >= now)
  )
}
