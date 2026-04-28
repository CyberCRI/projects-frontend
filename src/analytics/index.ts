import projectMessage from './project-message.analytics'
import attachmentLink from './attachment-link.analytic'
import attachmentFile from './attachment-file.analytic'
import linkedProject from './linked-project.analytic'
import announcement from './announcement.analytic'
import location from './location.analytic'
import comment from './comment.analytics'
import project from './project.analytic'
import chatbot from './chatbot.analytic'
import * as analytics from './analytics'
import footer from './footer.analytic'
import follow from './follow.analytic'
import page from './page.analytic'
import goal from './goal.analytic'
import blog from './blog'

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
  chatbot,
}
