export type LanguageType = string

export type AttachmentType = 'file' | 'image' | 'video'

export type ProjectPublicationStatusType = 'public' | 'private' | 'org'

export type ProjectStatusType = 'running' | 'completed' | 'canceled' | 'toreview'

export type GroupDataRole =
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

export type ProjectMemberRoleType = GroupDataRole

export type TagType = 'Wikipedia' | 'ESCO' | 'Custom'
export type SecondaryTagType = 'skill' | 'occupation' | 'tag'

export type StatusType = 'na' | 'ongoing' | 'complete' | 'cancel'

export type LocationType = 'team' | 'impact' | 'address' | 'news' | 'event'

export type Language = 'en' | 'fr' | 'de' | 'nl' | 'et' | 'ca' | 'es'
