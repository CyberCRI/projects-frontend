import analytics from '@/analytics/index'
import { CommentModel } from '@/models/comment.model'

export interface CommentAnalytic {
  project: {
    id: string
  }
  comment: CommentModel
}

export default {
  /**
   * "Comment project" analytic event
   * @param comment
   */
  comment(comment: CommentAnalytic): void {
    analytics.track('comment_project', comment)
  },
  /**
   * "Update Comment project" analytic event
   * @param comment
   */
  updateComment(comment: CommentAnalytic): void {
    analytics.track('update_comment_project', comment)
  },
  /**
   * "Delete Comment project" analytic event
   * @param comment
   */
  deleteComment(comment: CommentAnalytic): void {
    analytics.track('delete_comment_project', comment)
  },
}
