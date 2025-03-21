import * as analytics from './analytics'
import project from './project.analytic'
import goal from './goal.analytic'
import page from './page.analytic'
import announcement from './announcement.analytic'
import footer from './footer.analytic'
import follow from './follow.analytic'
import location from './location.analytic'
import comment from './comment.analytics'
import projectMessage from './project-message.analytics'
import blog from './blog'
import attachmentFile from './attachment-file.analytic'
import attachmentLink from './attachment-link.analytic'
import linkedProject from './linked-project.analytic'

export default {
  ...analytics,
  project,
  goal,
  page,
  announcement,
  footer,
  follow,
  location,
  comment,
  projectMessage,
  blog,
  attachmentFile,
  attachmentLink,
  linkedProject,
}
