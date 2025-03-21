import analytics from '@/analytics'
import { BlogEntryModel } from '@/models/blog-entry.model'

export interface BlogAnalytic {
  project: {
    id: string
  }
  blogEntry: BlogEntryModel
}
export default {
  /**
   * "Add blog post" analytic event
   * @param blog
   */
  addBlog(blog: BlogAnalytic): void {
    analytics.track('add_blog_project', blog)
  },
  /**
   * "Update blog post" analytic event
   * @param blog,
   */
  updateBlog(blog: BlogAnalytic): void {
    analytics.track('update_blog_project', blog)
  },
  /**
   * "remove blog post" analytic event
   * @param blog,
   */
  removeBlog(blog: BlogAnalytic): void {
    analytics.track('remove_blog_project', blog)
  },
}
