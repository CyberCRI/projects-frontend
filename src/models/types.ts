export type LanguageType = string

export type AttachmentType = 'file' | 'image' | 'video'

export type ProjectPublicationStatusType = 'public' | 'private' | 'org'

export type ProjectStatusType = 'running' | 'completed' | 'canceled' | 'toreview'

export type SearchObjectType = 'project' | 'people_group' | 'user'

export type Roles =
  | 'superadmins'
  | 'default'
  | 'reviewers'
  | 'owners'
  | 'reviewer_groups'
  | 'owner_groups'
  | 'member_groups'
  | 'leaders'
  | 'managers'
  | 'members'
  | 'admins'
  | 'facilitators'
  | 'users'
  | 'viewers'

export type GroupDataRole = Roles

export type NotificationType =
  | 'comment'
  | 'reply'
  | 'review'
  | 'project_message'
  | 'ready_for_review'
  | 'project_created'
  | 'project_updated'
  | 'member_added_self'
  | 'group_member_added_self'
  | 'member_updated_self'
  | 'member_added'
  | 'member_updated'
  | 'member_removed'
  | 'group_member_removed'
  | 'group_member_added'
  | 'announcement'
  | 'application'
  | 'blog_entry'
  | 'invitation_today_reminder'
  | 'invitation_week_reminder'
  | 'access_request'
  | 'pending_access_requests'
  | 'new_instruction'

export type ProjectMemberRoleType = 'owners' | 'members' | 'reviewers'
export type ProjectGroupRoleType = 'owner_groups' | 'member_groups' | 'reviewer_groups'

export type GroupMemberRoleType = 'leaders' | 'managers' | 'members'

export type ProjectRoleType = ProjectMemberRoleType | ProjectGroupRoleType

export type TagType = 'Wikipedia' | 'ESCO' | 'Custom'
export type SecondaryTagType = 'skill' | 'occupation' | 'tag'

export type StatusType = 'na' | 'ongoing' | 'complete' | 'cancel'

export type LocationType = 'team' | 'impact' | 'address' | 'news' | 'event'

export type Language = 'en' | 'fr' | 'de' | 'nl' | 'et' | 'ca' | 'es'

export type ProjectTabType = 'text' | 'blog'
