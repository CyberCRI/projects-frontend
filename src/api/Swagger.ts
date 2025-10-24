/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum TypeD3EEnum {
  Skill = 'skill',
  Hobby = 'hobby',
}

export enum Type06EEnum {
  Wikipedia = 'Wikipedia',
  ESCO = 'ESCO',
  Custom = 'Custom',
}

export enum TimeEstimationEnum {
  Value110Hrs = '1-10hrs',
  Value1140Hrs = '11-40hrs',
  Value41120Hrs = '41-120hrs',
  Over120Hrs = 'Over 120hrs',
}

export enum TemplateEnum {
  EmailWithName = 'email_with_name',
  EmailWithoutName = 'email_without_name',
}

export enum StatusD3DEnum {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

export enum SendToEnum {
  Primary = 'primary',
  Personal = 'personal',
}

export enum SecondaryTypeEnum {
  Skill = 'skill',
  Occupation = 'occupation',
  Tag = 'tag',
}

export enum SearchObjectTypeEnum {
  Project = 'project',
  PeopleGroup = 'people_group',
  User = 'user',
}

export enum SdgsEnum {
  Value1 = 1,
  Value2 = 2,
  Value3 = 3,
  Value4 = 4,
  Value5 = 5,
  Value6 = 6,
  Value7 = 7,
  Value8 = 8,
  Value9 = 9,
  Value10 = 10,
  Value11 = 11,
  Value12 = 12,
  Value13 = 13,
  Value14 = 14,
  Value15 = 15,
  Value16 = 16,
  Value17 = 17,
}

export enum PublicationStatus {
  Public = 'public',
  Private = 'private',
  Org = 'org',
}

export enum ProjectTabTypeEnum {
  Text = 'text',
  Blog = 'blog',
}

export enum PrivacySettingsChoices {
  Hide = 'hide',
  Org = 'org',
  Pub = 'pub',
}

export type NullEnum = null

export enum NotificationsTypeEnum {
  Comment = 'comment',
  Reply = 'reply',
  Review = 'review',
  ProjectMessage = 'project_message',
  ReadyForReview = 'ready_for_review',
  ProjectUpdated = 'project_updated',
  MemberAddedSelf = 'member_added_self',
  GroupMemberAddedSelf = 'group_member_added_self',
  MemberUpdatedSelf = 'member_updated_self',
  MemberAdded = 'member_added',
  MemberUpdated = 'member_updated',
  MemberRemoved = 'member_removed',
  GroupMemberRemoved = 'group_member_removed',
  GroupMemberAdded = 'group_member_added',
  Announcement = 'announcement',
  Application = 'application',
  BlogEntry = 'blog_entry',
  InvitationTodayReminder = 'invitation_today_reminder',
  InvitationWeekReminder = 'invitation_week_reminder',
  AccessRequest = 'access_request',
  PendingAccessRequests = 'pending_access_requests',
  NewInstruction = 'new_instruction',
}

export enum LocationTypeEnum {
  Team = 'team',
  Impact = 'impact',
}

export enum LifeStatusEnum {
  Running = 'running',
  Completed = 'completed',
  Canceled = 'canceled',
  Toreview = 'toreview',
}

export enum LanguagesEnum {
  En = 'en',
  Fr = 'fr',
  De = 'de',
  Nl = 'nl',
  Et = 'et',
  Ca = 'ca',
  Es = 'es',
}

export enum LanguageEnum {
  En = 'en',
  Fr = 'fr',
  De = 'de',
  Nl = 'nl',
  Et = 'et',
  Ca = 'ca',
  Es = 'es',
}

export enum GoalStatusEnum {
  Na = 'na',
  Ongoing = 'ongoing',
  Complete = 'complete',
  Cancel = 'cancel',
}

export enum CategoryEnum {
  ProjectWebsite = 'project_website',
  DocumentaryResource = 'documentary_resource',
  Inspiration = 'inspiration',
  Data = 'data',
  Publication = 'publication',
  SourceCode = 'source_code',
  Tool = 'tool',
  Other = 'other',
}

export enum BlankEnum {
  Value = '',
}

export enum AudienceEnum {
  Primary = 'primary',
  Middle = 'middle',
  High = 'high',
  Bachelor = 'bachelor',
  Master = 'master',
  Phd = 'phd',
  Work = 'work',
}

export enum AttachmentTypeEnum {
  File = 'file',
  Image = 'image',
  Video = 'video',
  Link = 'link',
}

export enum AnnouncementTypeEnum {
  Na = 'na',
  Participant = 'participant',
  Job = 'job',
  Traineeship = 'traineeship',
}

export enum AnnouncementStatusEnum {
  Open = 'open',
  Closed = 'closed',
}

export enum AccessStatusEnum {
  Pending = 'pending',
  Accepted = 'accepted',
  Declined = 'declined',
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface AccessRequest {
  id: number
  /** @format date-time */
  created_at: string
  status: AccessStatusEnum
  organization: string
  /** @format uuid */
  user: string | null
  /** @maxLength 255 */
  email?: string
  /** @maxLength 255 */
  given_name?: string
  /** @maxLength 255 */
  family_name?: string
  /** @maxLength 255 */
  job?: string
  message?: string
  message_detected_language: string | null
  message_en: string | null
  message_fr: string | null
  message_de: string | null
  message_nl: string | null
  message_et: string | null
  message_ca: string | null
  message_es: string | null
}

/** Used to accept or decline several access requests at once. */
export interface AccessRequestManyRequest {
  access_requests: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface AccessRequestRequest {
  /** @minLength 1 */
  organization: string
  /** @format uuid */
  user: string | null
  /** @maxLength 255 */
  email?: string
  /** @maxLength 255 */
  given_name?: string
  /** @maxLength 255 */
  family_name?: string
  /** @maxLength 255 */
  job?: string
  message?: string
}

export interface AccessRequestResult {
  id: number
  /** @format email */
  email: string
  message: string
}

export interface AccessToken {
  /** @maxLength 2048 */
  access_token: string
  expires_in: number
  refresh_expires_in: number
  /** @maxLength 2048 */
  refresh_token: string
  /** @maxLength 255 */
  token_type: string
  /** @maxLength 255 */
  session_state: string
  /** @maxLength 255 */
  scope: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Announcement {
  id: number
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  /** @maxLength 100 */
  title: string
  title_detected_language: string | null
  title_en: string | null
  title_fr: string | null
  title_de: string | null
  title_nl: string | null
  title_et: string | null
  title_ca: string | null
  title_es: string | null
  type?: AnnouncementTypeEnum
  status?: AnnouncementStatusEnum
  /** @format date */
  deadline?: string | null
  is_remunerated?: boolean
  /** @format date-time */
  created_at: string
  /** @format date-time */
  updated_at: string
  project: ProjectAnnouncement
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface AnnouncementRequest {
  description?: string
  /**
   * @minLength 1
   * @maxLength 100
   */
  title: string
  type?: AnnouncementTypeEnum
  status?: AnnouncementStatusEnum
  /** @format date */
  deadline?: string | null
  is_remunerated?: boolean
  /** @minLength 1 */
  project_id: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ApplyToAnnouncementRequest {
  /** @minLength 1 */
  project_id: string
  /** @minLength 1 */
  applicant_name: string
  /** @minLength 1 */
  applicant_firstname: string
  /**
   * @format email
   * @minLength 1
   */
  applicant_email: string
  /** @minLength 1 */
  applicant_message: string
  /** @minLength 1 */
  recaptcha: string
  announcement_id: number
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface AttachmentFile {
  id: number
  /** @format uri */
  file: string
  /** @maxLength 255 */
  title: string
  title_detected_language: string | null
  title_en: string | null
  title_fr: string | null
  title_de: string | null
  title_nl: string | null
  title_et: string | null
  title_ca: string | null
  title_es: string | null
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  attachment_type?: AttachmentTypeEnum
  /** @maxLength 100 */
  mime: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface AttachmentFileRequest {
  /** @minLength 1 */
  project_id: string
  /** @format binary */
  file: File
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
  description?: string
  attachment_type?: AttachmentTypeEnum
  /**
   * @minLength 1
   * @maxLength 100
   */
  mime: string
  /** @minLength 1 */
  hashcode?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface AttachmentLink {
  id: number
  attachment_type?: AttachmentTypeEnum
  category?: CategoryEnum
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  /**
   * @format uri
   * @maxLength 2048
   */
  site_url: string
  /**
   * @format uri
   * @maxLength 2048
   */
  preview_image_url: string
  /** @maxLength 255 */
  site_name: string
  /** @maxLength 255 */
  title?: string
  title_detected_language: string | null
  title_en: string | null
  title_fr: string | null
  title_de: string | null
  title_nl: string | null
  title_et: string | null
  title_ca: string | null
  title_es: string | null
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface AttachmentLinkRequest {
  /** @minLength 1 */
  project_id: string
  attachment_type?: AttachmentTypeEnum
  category?: CategoryEnum
  description?: string
  /**
   * @format uri
   * @minLength 1
   * @maxLength 2048
   */
  site_url: string
  /** @maxLength 255 */
  title?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface BlogEntry {
  id: number
  /** @maxLength 255 */
  title: string
  title_detected_language: string | null
  title_en: string | null
  title_fr: string | null
  title_de: string | null
  title_nl: string | null
  title_et: string | null
  title_ca: string | null
  title_es: string | null
  content?: string
  content_detected_language: string | null
  content_en: string | null
  content_fr: string | null
  content_de: string | null
  content_nl: string | null
  content_et: string | null
  content_ca: string | null
  content_es: string | null
  /** @format date-time */
  created_at: string
  /** @format date-time */
  updated_at: string
  images: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface BlogEntryRequest {
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
  content?: string
  /** @minLength 1 */
  project_id: string
  images_ids?: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Comment {
  id: number
  content?: string
  content_detected_language: string | null
  content_en: string | null
  content_fr: string | null
  content_de: string | null
  content_nl: string | null
  content_et: string | null
  content_ca: string | null
  content_es: string | null
  /** @format date-time */
  created_at: string
  /** @format date-time */
  updated_at: string
  /** @format date-time */
  deleted_at?: string | null
  author: UserLighter
  images: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface CommentRequest {
  content?: string
  /** @format date-time */
  deleted_at?: string | null
  /** @minLength 1 */
  project_id: string
  reply_on_id?: number | null
  images_ids?: number[]
}

export interface Contact {
  subject: string
  content: string
  /** @format email */
  email: string
}

export interface ContactRequest {
  /** @minLength 1 */
  subject: string
  /** @minLength 1 */
  content: string
  /**
   * @format email
   * @minLength 1
   */
  email: string
}

export interface CredentialsRequest {
  /**
   * @minLength 1
   * @maxLength 255
   */
  username: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  password: string
}

export interface Email {
  id: number
  /** @maxLength 255 */
  subject?: string
  /**
   * Subject [en]
   * @maxLength 255
   */
  subject_en?: string | null
  /**
   * Subject [fr]
   * @maxLength 255
   */
  subject_fr?: string | null
  /**
   * Subject [de]
   * @maxLength 255
   */
  subject_de?: string | null
  /**
   * Subject [nl]
   * @maxLength 255
   */
  subject_nl?: string | null
  /**
   * Subject [et]
   * @maxLength 255
   */
  subject_et?: string | null
  /**
   * Subject [ca]
   * @maxLength 255
   */
  subject_ca?: string | null
  /**
   * Subject [es]
   * @maxLength 255
   */
  subject_es?: string | null
  content?: string
  /** Content [en] */
  content_en?: string | null
  /** Content [fr] */
  content_fr?: string | null
  /** Content [de] */
  content_de?: string | null
  /** Content [nl] */
  content_nl?: string | null
  /** Content [et] */
  content_et?: string | null
  /** Content [ca] */
  content_ca?: string | null
  /** Content [es] */
  content_es?: string | null
  send_to?: SendToEnum
  template?: TemplateEnum
  /** @format date-time */
  created_at: string
  images?: number[]
  recipients?: number[]
  sent_to?: number[]
}

export interface EmailAddressRequest {
  /**
   * @format email
   * @minLength 1
   */
  email: string
}

export interface EmailAvailable {
  available: boolean
}

export interface EmailReport {
  title: string
  message: string
  /** @format email */
  reported_by: string
  /** @format uri */
  url: string
}

export interface EmailReportRequest {
  /** @minLength 1 */
  title: string
  /** @minLength 1 */
  message: string
  /**
   * @format email
   * @minLength 1
   */
  reported_by: string
  /**
   * @format uri
   * @minLength 1
   */
  url: string
}

export interface EmailRequest {
  /** @maxLength 255 */
  subject?: string
  /**
   * Subject [en]
   * @minLength 1
   * @maxLength 255
   */
  subject_en?: string | null
  /**
   * Subject [fr]
   * @minLength 1
   * @maxLength 255
   */
  subject_fr?: string | null
  /**
   * Subject [de]
   * @minLength 1
   * @maxLength 255
   */
  subject_de?: string | null
  /**
   * Subject [nl]
   * @minLength 1
   * @maxLength 255
   */
  subject_nl?: string | null
  /**
   * Subject [et]
   * @minLength 1
   * @maxLength 255
   */
  subject_et?: string | null
  /**
   * Subject [ca]
   * @minLength 1
   * @maxLength 255
   */
  subject_ca?: string | null
  /**
   * Subject [es]
   * @minLength 1
   * @maxLength 255
   */
  subject_es?: string | null
  content?: string
  /**
   * Content [en]
   * @minLength 1
   */
  content_en?: string | null
  /**
   * Content [fr]
   * @minLength 1
   */
  content_fr?: string | null
  /**
   * Content [de]
   * @minLength 1
   */
  content_de?: string | null
  /**
   * Content [nl]
   * @minLength 1
   */
  content_nl?: string | null
  /**
   * Content [et]
   * @minLength 1
   */
  content_et?: string | null
  /**
   * Content [ca]
   * @minLength 1
   */
  content_ca?: string | null
  /**
   * Content [es]
   * @minLength 1
   */
  content_es?: string | null
  send_to?: SendToEnum
  template?: TemplateEnum
  images?: number[]
  recipients?: number[]
  sent_to?: number[]
}

export interface EmptyPayloadResponse {
  detail: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Event {
  id: number
  /** @maxLength 255 */
  title: string
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_de: string | null
  /** Title */
  title_nl: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_ca: string | null
  /** Title */
  title_es: string | null
  content?: string
  content_detected_language: string | null
  content_en: string | null
  content_fr: string | null
  content_de: string | null
  content_nl: string | null
  content_et: string | null
  content_ca: string | null
  content_es: string | null
  /** @format date-time */
  event_date: string
  organization: string
  people_groups: number[]
  /** @format date-time */
  created_at: string
  /** @format date-time */
  updated_at: string
  visible_by_all?: boolean
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Follow {
  id: number
  follower: UserLighter
  /** @format date-time */
  created_at: string
  /** @format date-time */
  updated_at: string
  project: ProjectLight
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface FollowRequest {
  /** @minLength 1 */
  project_id: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Goal {
  id: number
  /** @maxLength 255 */
  title?: string
  title_detected_language: string | null
  title_en: string | null
  title_fr: string | null
  title_de: string | null
  title_nl: string | null
  title_et: string | null
  title_ca: string | null
  title_es: string | null
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  /** @format date */
  deadline_at?: string | null
  status?: GoalStatusEnum
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface GoalRequest {
  /** @maxLength 255 */
  title?: string
  description?: string
  /** @format date */
  deadline_at?: string | null
  status?: GoalStatusEnum
  /** @minLength 1 */
  project_id: string
}

export interface IdentityProvider {
  id: number
  /** @maxLength 255 */
  alias: string
  logo: Image
  enabled?: boolean
}

export interface IdentityProviderRequest {
  /**
   * @minLength 1
   * @maxLength 255
   */
  alias: string
  enabled?: boolean
}

export interface Image {
  id: number
  /** @maxLength 255 */
  name: string
  url: string | null
  /**
   * @min -2147483648
   * @max 2147483647
   */
  height?: number | null
  /**
   * @min -2147483648
   * @max 2147483647
   */
  width?: number | null
  /** @format double */
  natural_ratio?: number | null
  /** @format double */
  scale_x?: number | null
  /** @format double */
  scale_y?: number | null
  /** @format double */
  left?: number | null
  /** @format double */
  top?: number | null
  /** @format date-time */
  created_at: string
  /** @format uri */
  variations: string
}

export interface ImageRequest {
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string
  /**
   * @min -2147483648
   * @max 2147483647
   */
  height?: number | null
  /**
   * @min -2147483648
   * @max 2147483647
   */
  width?: number | null
  /** @format double */
  natural_ratio?: number | null
  /** @format double */
  scale_x?: number | null
  /** @format double */
  scale_y?: number | null
  /** @format double */
  left?: number | null
  /** @format double */
  top?: number | null
  /** @format binary */
  file: File
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Instruction {
  id: number
  /** @maxLength 255 */
  title: string
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_de: string | null
  /** Title */
  title_nl: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_ca: string | null
  /** Title */
  title_es: string | null
  content?: string
  content_detected_language: string | null
  content_en: string | null
  content_fr: string | null
  content_de: string | null
  content_nl: string | null
  content_et: string | null
  content_ca: string | null
  content_es: string | null
  /** @format date-time */
  publication_date: string
  organization: string
  people_groups: PeopleGroupLight[]
  language?: LanguageEnum
  has_to_be_notified?: boolean
  /** @format date-time */
  created_at: string
  /** @format date-time */
  updated_at: string
  visible_by_all?: boolean
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Invitation {
  /** @format uuid */
  token: string
  /** @format date-time */
  created_at: string
  people_group: PeopleGroupLight
  id: number
  owner: UserLighter
  /** @maxLength 255 */
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  /** @format date-time */
  expire_at: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface InvitationRequest {
  people_group_id: number
  /** @maxLength 255 */
  description?: string
  /** @format date-time */
  expire_at: string
}

export interface LinkedProject {
  id: number
  project: ProjectLight
}

export interface LinkedProjectRequest {
  /** @minLength 1 */
  project_id: string
  /** @minLength 1 */
  target_id: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Location {
  id: number
  /** @maxLength 255 */
  title?: string
  title_detected_language: string | null
  title_en: string | null
  title_fr: string | null
  title_de: string | null
  title_nl: string | null
  title_et: string | null
  title_ca: string | null
  title_es: string | null
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  /** @format double */
  lat: number
  /** @format double */
  lng: number
  type?: LocationTypeEnum
  project: LocationProject
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface LocationProject {
  /** @maxLength 8 */
  id?: string
  /**
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /** @maxLength 255 */
  title: string
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_de: string | null
  /** Title */
  title_nl: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_ca: string | null
  /** Title */
  title_es: string | null
  /** Main goal */
  purpose?: string
  purpose_detected_language: string | null
  /** Main goal */
  purpose_en: string | null
  /** Main goal */
  purpose_fr: string | null
  /** Main goal */
  purpose_de: string | null
  /** Main goal */
  purpose_nl: string | null
  /** Main goal */
  purpose_et: string | null
  /** Main goal */
  purpose_ca: string | null
  /** Main goal */
  purpose_es: string | null
  header_image: Image
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface LocationProjectRequest {
  /**
   * @minLength 1
   * @maxLength 8
   */
  id?: string
  /**
   * @minLength 1
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
  /** Main goal */
  purpose?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface LocationRequest {
  /** @maxLength 255 */
  title?: string
  description?: string
  /** @format double */
  lat: number
  /** @format double */
  lng: number
  type?: LocationTypeEnum
  /** @minLength 1 */
  project_id: string
}

export interface Mentoring {
  id: number
  mentor: UserLighter
  mentoree: UserLighter
  skill: SkillLight
  status: StatusD3DEnum | NullEnum | null
  created_by: number
  /** @format date-time */
  created_at: string
}

export interface MentoringContactRequest {
  /** @minLength 1 */
  content: string
  /**
   * @format email
   * @minLength 1
   */
  reply_to?: string | null
}

export interface MentoringResponseRequest {
  status: StatusD3DEnum
  /** @minLength 1 */
  content: string
  /**
   * @format email
   * @minLength 1
   */
  reply_to?: string | null
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface News {
  id: number
  /** @maxLength 255 */
  title: string
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_de: string | null
  /** Title */
  title_nl: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_ca: string | null
  /** Title */
  title_es: string | null
  content?: string
  content_detected_language: string | null
  content_en: string | null
  content_fr: string | null
  content_de: string | null
  content_nl: string | null
  content_et: string | null
  content_ca: string | null
  content_es: string | null
  /** @format date-time */
  publication_date: string
  header_image: Image
  organization: string
  people_groups: number[]
  language?: LanguageEnum
  /** @format date-time */
  created_at: string
  /** @format date-time */
  updated_at: string
  visible_by_all?: boolean
}

export interface Newsfeed {
  id: number
  project: ProjectLight
  announcement: Announcement
  news: News
  /** @maxLength 50 */
  type: string
  /** @format date-time */
  updated_at: string
}

export interface NotificationSettings {
  id: number
  notify_added_to_project?: boolean
  announcement_published?: boolean
  announcement_has_new_application?: boolean
  followed_project_has_been_edited?: boolean
  project_has_been_commented?: boolean
  project_has_been_edited?: boolean
  project_ready_for_review?: boolean
  project_has_been_reviewed?: boolean
  project_has_new_private_message?: boolean
  comment_received_a_response?: boolean
  organization_has_new_access_request?: boolean
  invitation_link_will_expire?: boolean
  new_instruction?: boolean
}

export interface NotificationSettingsRequest {
  notify_added_to_project?: boolean
  announcement_published?: boolean
  announcement_has_new_application?: boolean
  followed_project_has_been_edited?: boolean
  project_has_been_commented?: boolean
  project_has_been_edited?: boolean
  project_ready_for_review?: boolean
  project_has_been_reviewed?: boolean
  project_has_new_private_message?: boolean
  comment_received_a_response?: boolean
  organization_has_new_access_request?: boolean
  invitation_link_will_expire?: boolean
  new_instruction?: boolean
}

/** Automatically translate model fields for model with registered translation */
export interface Notifications {
  id: number
  sender: UserLighter
  project: ProjectSuperLight
  type: NotificationsTypeEnum
  context: Record<string, any>
  /** @format date-time */
  created: string
  invitation: Invitation
  organization: string
  count: number
  is_viewed?: boolean
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Organization {
  id: number
  /** @maxLength 50 */
  code: string
  /** @maxLength 255 */
  name: string
  name_detected_language: string | null
  name_en: string | null
  name_fr: string | null
  name_de: string | null
  name_nl: string | null
  name_et: string | null
  name_ca: string | null
  name_es: string | null
  parent_code?: string
  /**
   * @format email
   * @maxLength 255
   */
  contact_email?: string
  /** @maxLength 255 */
  dashboard_title: string
  dashboard_title_detected_language: string | null
  dashboard_title_en: string | null
  dashboard_title_fr: string | null
  dashboard_title_de: string | null
  dashboard_title_nl: string | null
  dashboard_title_et: string | null
  dashboard_title_ca: string | null
  dashboard_title_es: string | null
  /** @maxLength 255 */
  dashboard_subtitle: string
  dashboard_subtitle_detected_language: string | null
  dashboard_subtitle_en: string | null
  dashboard_subtitle_fr: string | null
  dashboard_subtitle_de: string | null
  dashboard_subtitle_nl: string | null
  dashboard_subtitle_et: string | null
  dashboard_subtitle_ca: string | null
  dashboard_subtitle_es: string | null
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  /**
   * @format uri
   * @maxLength 255
   */
  chat_url?: string
  /** @maxLength 255 */
  chat_button_text?: string
  chat_button_text_detected_language: string | null
  chat_button_text_en: string | null
  chat_button_text_fr: string | null
  chat_button_text_de: string | null
  chat_button_text_nl: string | null
  chat_button_text_et: string | null
  chat_button_text_ca: string | null
  chat_button_text_es: string | null
  languages?: LanguagesEnum[]
  language?: LanguageEnum
  is_logo_visible_on_parent_dashboard?: boolean
  /** @maxLength 9 */
  background_color?: string
  access_request_enabled?: boolean
  onboarding_enabled?: boolean
  force_login_form_display?: boolean
  /** @maxLength 255 */
  website_url: string
  /** @format date-time */
  created_at: string
  /** @format date-time */
  updated_at: string
  enabled_projects_tag_classifications?: string[]
  enabled_skills_tag_classifications?: string[]
  default_projects_tag_classification?: string
  default_skills_tag_classification?: string
  default_projects_tags?: string[]
  default_skills_tags?: string[]
  terms_and_conditions: TermsAndConditions
  banner_image: Image
  logo_image: Image
  children: string[]
  google_sync_enabled: boolean
  identity_providers: IdentityProvider[]
  attachment_files_count: number
}

export interface OrganizationAddFeaturedProjectsRequest {
  featured_projects_ids?: string[]
}

export interface OrganizationAddTeamMembersRequest {
  admins?: string[]
  facilitators?: string[]
  users?: string[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface OrganizationAttachmentFile {
  id: number
  /** @format uri */
  file: string
  /** @maxLength 255 */
  title: string
  title_detected_language: string | null
  title_en: string | null
  title_fr: string | null
  title_de: string | null
  title_nl: string | null
  title_et: string | null
  title_ca: string | null
  title_es: string | null
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  attachment_type?: AttachmentTypeEnum
  /** @maxLength 100 */
  mime: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface OrganizationAttachmentFileRequest {
  /** @format binary */
  file: File
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
  description?: string
  attachment_type?: AttachmentTypeEnum
  /**
   * @minLength 1
   * @maxLength 100
   */
  mime: string
  /** @minLength 1 */
  hashcode?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface OrganizationLight {
  id: number
  /** @maxLength 50 */
  code: string
  is_logo_visible_on_parent_dashboard?: boolean
  /** @maxLength 9 */
  background_color?: string
  /** @maxLength 255 */
  website_url: string
  /** @maxLength 255 */
  name: string
  name_detected_language: string | null
  name_en: string | null
  name_fr: string | null
  name_de: string | null
  name_nl: string | null
  name_et: string | null
  name_ca: string | null
  name_es: string | null
  logo_image: Image
}

export interface OrganizationRemoveFeaturedProjectsRequest {
  featured_projects_ids?: string[]
}

export interface OrganizationRemoveTeamMembersRequest {
  users?: string[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface OrganizationRequest {
  /**
   * @minLength 1
   * @maxLength 50
   */
  code: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string
  /** @minLength 1 */
  parent_code?: string
  /**
   * @format email
   * @maxLength 255
   */
  contact_email?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  dashboard_title: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  dashboard_subtitle: string
  description?: string
  /**
   * @format uri
   * @maxLength 255
   */
  chat_url?: string
  /** @maxLength 255 */
  chat_button_text?: string
  languages?: LanguagesEnum[]
  language?: LanguageEnum
  is_logo_visible_on_parent_dashboard?: boolean
  /** @maxLength 9 */
  background_color?: string
  access_request_enabled?: boolean
  onboarding_enabled?: boolean
  force_login_form_display?: boolean
  /**
   * @minLength 1
   * @maxLength 255
   */
  website_url: string
  enabled_projects_tag_classifications?: string[]
  enabled_skills_tag_classifications?: string[]
  default_projects_tag_classification?: string
  default_skills_tag_classification?: string
  default_projects_tags?: string[]
  default_skills_tags?: string[]
  banner_image_id?: number
  logo_image_id: number
  team?: OrganizationAddTeamMembersRequest
}

export interface PaginatedAccessRequestList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: AccessRequest[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedAnnouncementList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: Announcement[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedAttachmentFileList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: AttachmentFile[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedAttachmentLinkList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: AttachmentLink[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedBlogEntryList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: BlogEntry[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedCommentList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: Comment[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedEmailList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: Email[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedEventList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: Event[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedFollowList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: Follow[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedGoalList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: Goal[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedInstructionList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: Instruction[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedInvitationList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: Invitation[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedMentoringList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: Mentoring[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedNewsList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: News[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedNewsfeedList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: Newsfeed[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedNotificationsList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: Notifications[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedOrganizationAttachmentFileList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: OrganizationAttachmentFile[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedOrganizationLightList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: OrganizationLight[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedPeopleGroupLightList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: PeopleGroupLight[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedProjectCategoryList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: ProjectCategory[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedProjectLightList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: ProjectLight[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedProjectMessageList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: ProjectMessage[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedProjectTabItemList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: ProjectTabItem[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedProjectTabList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: ProjectTab[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedProjectVersionListList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: ProjectVersionList[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedReviewList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: Review[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedSearchObjectList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: SearchObject[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedStatsList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: Stats[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedTagClassificationList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: TagClassification[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedTagList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: Tag[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedTemplateList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: Template[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

export interface PaginatedUserLightList {
  /** @example 123 */
  count: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  results: UserLight[]
  /** @example 123 */
  total_page?: number
  /** @example 123 */
  current_page?: number
  /** @example 123 */
  next_page?: number
  /** @example 123 */
  previous_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedAnnouncementRequest {
  description?: string
  /**
   * @minLength 1
   * @maxLength 100
   */
  title?: string
  type?: AnnouncementTypeEnum
  status?: AnnouncementStatusEnum
  /** @format date */
  deadline?: string | null
  is_remunerated?: boolean
  /** @minLength 1 */
  project_id?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedAttachmentFileRequest {
  /** @minLength 1 */
  project_id?: string
  /** @format binary */
  file?: File
  /**
   * @minLength 1
   * @maxLength 255
   */
  title?: string
  description?: string
  attachment_type?: AttachmentTypeEnum
  /**
   * @minLength 1
   * @maxLength 100
   */
  mime?: string
  /** @minLength 1 */
  hashcode?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedAttachmentLinkRequest {
  /** @minLength 1 */
  project_id?: string
  attachment_type?: AttachmentTypeEnum
  category?: CategoryEnum
  description?: string
  /**
   * @format uri
   * @minLength 1
   * @maxLength 2048
   */
  site_url?: string
  /** @maxLength 255 */
  title?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedBlogEntryRequest {
  /**
   * @minLength 1
   * @maxLength 255
   */
  title?: string
  content?: string
  /** @minLength 1 */
  project_id?: string
  images_ids?: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedCommentRequest {
  content?: string
  /** @format date-time */
  deleted_at?: string | null
  /** @minLength 1 */
  project_id?: string
  reply_on_id?: number | null
  images_ids?: number[]
}

export interface PatchedEmailRequest {
  /** @maxLength 255 */
  subject?: string
  /**
   * Subject [en]
   * @minLength 1
   * @maxLength 255
   */
  subject_en?: string | null
  /**
   * Subject [fr]
   * @minLength 1
   * @maxLength 255
   */
  subject_fr?: string | null
  /**
   * Subject [de]
   * @minLength 1
   * @maxLength 255
   */
  subject_de?: string | null
  /**
   * Subject [nl]
   * @minLength 1
   * @maxLength 255
   */
  subject_nl?: string | null
  /**
   * Subject [et]
   * @minLength 1
   * @maxLength 255
   */
  subject_et?: string | null
  /**
   * Subject [ca]
   * @minLength 1
   * @maxLength 255
   */
  subject_ca?: string | null
  /**
   * Subject [es]
   * @minLength 1
   * @maxLength 255
   */
  subject_es?: string | null
  content?: string
  /**
   * Content [en]
   * @minLength 1
   */
  content_en?: string | null
  /**
   * Content [fr]
   * @minLength 1
   */
  content_fr?: string | null
  /**
   * Content [de]
   * @minLength 1
   */
  content_de?: string | null
  /**
   * Content [nl]
   * @minLength 1
   */
  content_nl?: string | null
  /**
   * Content [et]
   * @minLength 1
   */
  content_et?: string | null
  /**
   * Content [ca]
   * @minLength 1
   */
  content_ca?: string | null
  /**
   * Content [es]
   * @minLength 1
   */
  content_es?: string | null
  send_to?: SendToEnum
  template?: TemplateEnum
  images?: number[]
  recipients?: number[]
  sent_to?: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedGoalRequest {
  /** @maxLength 255 */
  title?: string
  description?: string
  /** @format date */
  deadline_at?: string | null
  status?: GoalStatusEnum
  /** @minLength 1 */
  project_id?: string
}

export interface PatchedImageRequest {
  /**
   * @minLength 1
   * @maxLength 255
   */
  name?: string
  /**
   * @min -2147483648
   * @max 2147483647
   */
  height?: number | null
  /**
   * @min -2147483648
   * @max 2147483647
   */
  width?: number | null
  /** @format double */
  natural_ratio?: number | null
  /** @format double */
  scale_x?: number | null
  /** @format double */
  scale_y?: number | null
  /** @format double */
  left?: number | null
  /** @format double */
  top?: number | null
  /** @format binary */
  file?: File
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedInvitationRequest {
  people_group_id?: number
  /** @maxLength 255 */
  description?: string
  /** @format date-time */
  expire_at?: string
}

export interface PatchedLinkedProjectRequest {
  /** @minLength 1 */
  project_id?: string
  /** @minLength 1 */
  target_id?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedLocationRequest {
  /** @maxLength 255 */
  title?: string
  description?: string
  /** @format double */
  lat?: number
  /** @format double */
  lng?: number
  type?: LocationTypeEnum
  /** @minLength 1 */
  project_id?: string
}

export interface PatchedNotificationSettingsRequest {
  notify_added_to_project?: boolean
  announcement_published?: boolean
  announcement_has_new_application?: boolean
  followed_project_has_been_edited?: boolean
  project_has_been_commented?: boolean
  project_has_been_edited?: boolean
  project_ready_for_review?: boolean
  project_has_been_reviewed?: boolean
  project_has_new_private_message?: boolean
  comment_received_a_response?: boolean
  organization_has_new_access_request?: boolean
  invitation_link_will_expire?: boolean
  new_instruction?: boolean
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedOrganizationAttachmentFileRequest {
  /** @format binary */
  file?: File
  /**
   * @minLength 1
   * @maxLength 255
   */
  title?: string
  description?: string
  attachment_type?: AttachmentTypeEnum
  /**
   * @minLength 1
   * @maxLength 100
   */
  mime?: string
  /** @minLength 1 */
  hashcode?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedOrganizationRequest {
  /**
   * @minLength 1
   * @maxLength 50
   */
  code?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  name?: string
  /** @minLength 1 */
  parent_code?: string
  /**
   * @format email
   * @maxLength 255
   */
  contact_email?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  dashboard_title?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  dashboard_subtitle?: string
  description?: string
  /**
   * @format uri
   * @maxLength 255
   */
  chat_url?: string
  /** @maxLength 255 */
  chat_button_text?: string
  languages?: LanguagesEnum[]
  language?: LanguageEnum
  is_logo_visible_on_parent_dashboard?: boolean
  /** @maxLength 9 */
  background_color?: string
  access_request_enabled?: boolean
  onboarding_enabled?: boolean
  force_login_form_display?: boolean
  /**
   * @minLength 1
   * @maxLength 255
   */
  website_url?: string
  enabled_projects_tag_classifications?: string[]
  enabled_skills_tag_classifications?: string[]
  default_projects_tag_classification?: string
  default_skills_tag_classification?: string
  default_projects_tags?: string[]
  default_skills_tags?: string[]
  banner_image_id?: number
  logo_image_id?: number
  team?: OrganizationAddTeamMembersRequest
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedPeopleGroupRequest {
  /** @maxLength 255 */
  name?: string
  description?: string
  short_description?: string
  /**
   * @format email
   * @maxLength 254
   */
  email?: string
  parent?: number | null
  /** @minLength 1 */
  organization?: string
  /** Visibility */
  publication_status?: PublicationStatus
  team?: PeopleGroupAddTeamMembersRequest
  featured_projects?: string[]
}

export interface PatchedPrivacySettingsRequest {
  publication_status?: PrivacySettingsChoices
  profile_picture?: PrivacySettingsChoices
  skills?: PrivacySettingsChoices
  mobile_phone?: PrivacySettingsChoices
  email?: PrivacySettingsChoices
  socials?: PrivacySettingsChoices
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedProjectCategoryRequest {
  /**
   * name of the category
   * @minLength 1
   * @maxLength 100
   */
  name?: string
  /** description of the category */
  description?: string
  /** @maxLength 9 */
  background_color?: string
  /** @maxLength 9 */
  foreground_color?: string
  is_reviewable?: boolean
  /**
   * @min -32768
   * @max 32767
   */
  order_index?: number
  only_reviewer_can_publish?: boolean
  parent?: number | null
  tags?: string[]
  background_image_id?: number
  templates_ids?: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedProjectMessageRequest {
  content?: string
  /** @format date-time */
  deleted_at?: string | null
  reply_on?: number | null
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedProjectRequest {
  /**
   * @minLength 1
   * @maxLength 8
   */
  id?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  title?: string
  description?: string
  is_shareable?: boolean
  /** Main goal */
  purpose?: string
  language?: LanguageEnum
  /** Visibility */
  publication_status?: PublicationStatus
  life_status?: LifeStatusEnum
  /**
   * Sustainable development goals
   * @maxItems 17
   */
  sdgs?: SdgsEnum[]
  /** @format date-time */
  deleted_at?: string | null
  tags?: string[]
  project_categories_ids?: number[]
  header_image_id?: number
  template_id?: number
  organizations_codes?: string[]
  images_ids?: number[]
  team?: ProjectAddTeamMembersRequest
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedProjectTabItemRequest {
  /**
   * @minLength 1
   * @maxLength 255
   */
  title?: string
  content?: string
  images?: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedProjectTabRequest {
  type?: ProjectTabTypeEnum
  /**
   * @minLength 1
   * @maxLength 255
   */
  title?: string
  description?: string
  /** @maxLength 255 */
  icon?: string
  images?: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedReviewRequest {
  description?: string
  /**
   * @minLength 1
   * @maxLength 100
   */
  title?: string
  /** @minLength 1 */
  project_id?: string
}

export interface PatchedSkillRequest {
  tag?: string
  /**
   * @min -32768
   * @max 32767
   */
  level?: number
  /**
   * @min -32768
   * @max 32767
   */
  level_to_reach?: number
  /** @maxLength 255 */
  category?: string
  type?: TypeD3EEnum
  can_mentor?: boolean
  needs_mentor?: boolean
  comment?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedTagClassificationRequest {
  /**
   * @minLength 1
   * @maxLength 50
   */
  title?: string
  /** @maxLength 500 */
  description?: string
  is_public?: boolean
}

/** Automatically translate model fields for model with registered translation */
export interface PatchedTagRequest {
  /**
   * @minLength 1
   * @maxLength 255
   */
  title?: string
  /**
   * Title [en]
   * @minLength 1
   * @maxLength 255
   */
  title_en?: string | null
  /**
   * Title [fr]
   * @minLength 1
   * @maxLength 255
   */
  title_fr?: string | null
  /**
   * Title [de]
   * @minLength 1
   * @maxLength 255
   */
  title_de?: string | null
  /**
   * Title [nl]
   * @minLength 1
   * @maxLength 255
   */
  title_nl?: string | null
  /**
   * Title [et]
   * @minLength 1
   * @maxLength 255
   */
  title_et?: string | null
  /**
   * Title [ca]
   * @minLength 1
   * @maxLength 255
   */
  title_ca?: string | null
  /**
   * Title [es]
   * @minLength 1
   * @maxLength 255
   */
  title_es?: string | null
  description?: string
  /**
   * Description [en]
   * @minLength 1
   */
  description_en?: string | null
  /**
   * Description [fr]
   * @minLength 1
   */
  description_fr?: string | null
  /**
   * Description [de]
   * @minLength 1
   */
  description_de?: string | null
  /**
   * Description [nl]
   * @minLength 1
   */
  description_nl?: string | null
  /**
   * Description [et]
   * @minLength 1
   */
  description_et?: string | null
  /**
   * Description [ca]
   * @minLength 1
   */
  description_ca?: string | null
  /**
   * Description [es]
   * @minLength 1
   */
  description_es?: string | null
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedTemplateRequest {
  /** @maxLength 255 */
  name?: string
  description?: string
  language?: LanguageEnum
  /** @maxLength 255 */
  project_title?: string
  project_description?: string
  project_purpose?: string
  project_tags?: string[]
  /** @maxLength 255 */
  blogentry_title?: string
  blogentry_content?: string
  /** @maxLength 255 */
  goal_title?: string
  goal_description?: string
  /** @maxLength 255 */
  review_title?: string
  review_description?: string
  comment_content?: string
  audience?: AudienceEnum | BlankEnum
  time_estimation?: TimeEstimationEnum | BlankEnum
  share_globally?: boolean
  categories_ids?: number[]
}

/**
 * Serializer for TermsAndConditions model.
 *
 * One default Terms and Conditions can be defined for the whole platform.
 * If an organization does not have its own Terms and Conditions, the default one will be used.
 * If the default one is updated, all organizations using it will see the changes.
 *
 * The fields `displayed_content_organization`, `displayed_content` and `displayed_version`
 * are read-only and represent the actual Terms and Conditions that will be displayed to users.
 *
 * The field `content` is write-only and allows to set the content of the Terms and Conditions.
 */
export interface PatchedTermsAndConditionsRequest {
  /** @minLength 1 */
  content?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedUserRequest {
  roles_to_add?: string[]
  roles_to_remove?: string[]
  language?: LanguageEnum
  onboarding_status?: Record<string, any>
  signed_terms_and_conditions?: Record<string, any>
  /**
   * id of user in people
   * @format uuid
   */
  people_id?: string | null
  /** @format email */
  email?: string
  /** @maxLength 255 */
  given_name?: string
  /** @maxLength 255 */
  family_name?: string
  /** @format date */
  birthdate?: string | null
  /** @maxLength 32 */
  pronouns?: string
  short_description?: string
  description?: string
  location?: string
  /** @maxLength 255 */
  job?: string
  mobile_phone?: string
  /** @format email */
  personal_email?: string
  sdgs?: number[]
  facebook?: string
  linkedin?: string
  medium?: string
  website?: string
  skype?: string
  landline_phone?: string
  twitter?: string
  /** @format binary */
  profile_picture_file?: File | null
  /** @format double */
  profile_picture_scale_x?: number | null
  /** @format double */
  profile_picture_scale_y?: number | null
  /** @format double */
  profile_picture_left?: number | null
  /** @format double */
  profile_picture_top?: number | null
  /** @format double */
  profile_picture_natural_ratio?: number | null
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PeopleGroup {
  is_root: boolean
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
  id: number
  /** @maxLength 255 */
  name?: string
  name_detected_language: string | null
  name_en: string | null
  name_fr: string | null
  name_de: string | null
  name_nl: string | null
  name_et: string | null
  name_ca: string | null
  name_es: string | null
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  short_description?: string
  short_description_detected_language: string | null
  short_description_en: string | null
  short_description_fr: string | null
  short_description_de: string | null
  short_description_nl: string | null
  short_description_et: string | null
  short_description_ca: string | null
  short_description_es: string | null
  /**
   * @format email
   * @maxLength 254
   */
  email?: string
  organization: string
  hierarchy: Record<string, string | number>[]
  children: Record<string, string | number>[]
  header_image: Image
  logo_image: Image
  roles: string[]
  /** Visibility */
  publication_status?: PublicationStatus
}

export interface PeopleGroupAddFeaturedProjectsRequest {
  featured_projects?: string[]
}

export interface PeopleGroupAddTeamMembersRequest {
  leaders?: string[]
  managers?: string[]
  members?: string[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PeopleGroupLight {
  organization: string
  is_root: boolean
  /** Visibility */
  publication_status: PublicationStatus
  id: number
  /**
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /** @maxLength 255 */
  name?: string
  name_detected_language: string | null
  name_en: string | null
  name_fr: string | null
  name_de: string | null
  name_nl: string | null
  name_et: string | null
  name_ca: string | null
  name_es: string | null
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  short_description?: string
  short_description_detected_language: string | null
  short_description_en: string | null
  short_description_fr: string | null
  short_description_de: string | null
  short_description_nl: string | null
  short_description_et: string | null
  short_description_ca: string | null
  short_description_es: string | null
  /**
   * @format email
   * @maxLength 254
   */
  email?: string
  header_image: Image
  members_count: number
  roles: string[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PeopleGroupLightRequest {
  /**
   * @minLength 1
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /** @maxLength 255 */
  name?: string
  description?: string
  short_description?: string
  /**
   * @format email
   * @maxLength 254
   */
  email?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PeopleGroupLightSerializerPrimaryKeyRelatedField {
  organization: string
  is_root: boolean
  /** Visibility */
  publication_status: PublicationStatus
  id: number
  /**
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /** @maxLength 255 */
  name?: string
  name_detected_language: string | null
  name_en: string | null
  name_fr: string | null
  name_de: string | null
  name_nl: string | null
  name_et: string | null
  name_ca: string | null
  name_es: string | null
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  short_description?: string
  short_description_detected_language: string | null
  short_description_en: string | null
  short_description_fr: string | null
  short_description_de: string | null
  short_description_nl: string | null
  short_description_et: string | null
  short_description_ca: string | null
  short_description_es: string | null
  /**
   * @format email
   * @maxLength 254
   */
  email?: string
  header_image: Image
  members_count: number
  roles: string[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PeopleGroupLightSerializerPrimaryKeyRelatedFieldRequest {
  /**
   * @minLength 1
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /** @maxLength 255 */
  name?: string
  description?: string
  short_description?: string
  /**
   * @format email
   * @maxLength 254
   */
  email?: string
}

export interface PeopleGroupRemoveFeaturedProjectsRequest {
  featured_projects?: string[]
}

export interface PeopleGroupRemoveTeamMembersRequest {
  users?: string[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PeopleGroupRequest {
  /** @maxLength 255 */
  name?: string
  description?: string
  short_description?: string
  /**
   * @format email
   * @maxLength 254
   */
  email?: string
  parent?: number | null
  /** @minLength 1 */
  organization: string
  /** Visibility */
  publication_status?: PublicationStatus
  team?: PeopleGroupAddTeamMembersRequest
  featured_projects?: string[]
}

export interface PrivacySettings {
  id: number
  publication_status?: PrivacySettingsChoices
  profile_picture?: PrivacySettingsChoices
  skills?: PrivacySettingsChoices
  mobile_phone?: PrivacySettingsChoices
  email?: PrivacySettingsChoices
  socials?: PrivacySettingsChoices
}

export interface PrivacySettingsRequest {
  publication_status?: PrivacySettingsChoices
  profile_picture?: PrivacySettingsChoices
  skills?: PrivacySettingsChoices
  mobile_phone?: PrivacySettingsChoices
  email?: PrivacySettingsChoices
  socials?: PrivacySettingsChoices
}

export interface ProcessAccessRequest {
  success?: AccessRequestResult[]
  error?: AccessRequestResult[]
  warning?: AccessRequestResult[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Project {
  is_locked: boolean
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
  /** @maxLength 8 */
  id?: string
  /** @maxLength 255 */
  title: string
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_de: string | null
  /** Title */
  title_nl: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_ca: string | null
  /** Title */
  title_es: string | null
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  is_shareable?: boolean
  /** Main goal */
  purpose?: string
  purpose_detected_language: string | null
  /** Main goal */
  purpose_en: string | null
  /** Main goal */
  purpose_fr: string | null
  /** Main goal */
  purpose_de: string | null
  /** Main goal */
  purpose_nl: string | null
  /** Main goal */
  purpose_et: string | null
  /** Main goal */
  purpose_ca: string | null
  /** Main goal */
  purpose_es: string | null
  language?: LanguageEnum
  /** Visibility */
  publication_status?: PublicationStatus
  life_status?: LifeStatusEnum
  /**
   * Sustainable development goals
   * @maxItems 17
   */
  sdgs?: SdgsEnum[]
  /** @format date-time */
  created_at: string
  /** @format date-time */
  updated_at: string
  /** @format date-time */
  deleted_at?: string | null
  tags?: string[]
  header_image: Image
  categories: ProjectCategoryLight[]
  last_comment: Record<string, any>
  organizations: Organization[]
  goals: Goal[]
  reviews: Review[]
  locations: Location[]
  announcements: Announcement[]
  links: AttachmentLink[]
  files: AttachmentFile[]
  images: Image[]
  blog_entries: BlogEntry[]
  linked_projects: Record<string, any>
  views: number
  template: ProjectTemplate
  is_followed: Record<string, any>
  team?: ProjectAddTeamMembers
}

/** Used to link projects to another one. */
export interface ProjectAddLinkedProjectRequest {
  projects: LinkedProjectRequest[]
}

export interface ProjectAddTeamMembers {
  members?: UserLighterSerializerKeycloakRelatedField[]
  owners?: UserLighterSerializerKeycloakRelatedField[]
  reviewers?: UserLighterSerializerKeycloakRelatedField[]
  member_groups?: PeopleGroupLightSerializerPrimaryKeyRelatedField[]
  owner_groups?: PeopleGroupLightSerializerPrimaryKeyRelatedField[]
  reviewer_groups?: PeopleGroupLightSerializerPrimaryKeyRelatedField[]
}

export interface ProjectAddTeamMembersRequest {
  members?: UserLighterSerializerKeycloakRelatedFieldRequest[]
  owners?: UserLighterSerializerKeycloakRelatedFieldRequest[]
  reviewers?: UserLighterSerializerKeycloakRelatedFieldRequest[]
  member_groups?: PeopleGroupLightSerializerPrimaryKeyRelatedFieldRequest[]
  owner_groups?: PeopleGroupLightSerializerPrimaryKeyRelatedFieldRequest[]
  reviewer_groups?: PeopleGroupLightSerializerPrimaryKeyRelatedFieldRequest[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectAnnouncement {
  /** @maxLength 8 */
  id?: string
  /** @maxLength 255 */
  title: string
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_de: string | null
  /** Title */
  title_nl: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_ca: string | null
  /** Title */
  title_es: string | null
  /**
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /** Main goal */
  purpose?: string
  purpose_detected_language: string | null
  /** Main goal */
  purpose_en: string | null
  /** Main goal */
  purpose_fr: string | null
  /** Main goal */
  purpose_de: string | null
  /** Main goal */
  purpose_nl: string | null
  /** Main goal */
  purpose_et: string | null
  /** Main goal */
  purpose_ca: string | null
  /** Main goal */
  purpose_es: string | null
  /** Visibility */
  publication_status?: PublicationStatus
  header_image: Image
  language?: LanguageEnum
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectAnnouncementRequest {
  /**
   * @minLength 1
   * @maxLength 8
   */
  id?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
  /**
   * @minLength 1
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /** Main goal */
  purpose?: string
  /** Visibility */
  publication_status?: PublicationStatus
  language?: LanguageEnum
}

export interface ProjectByMonth {
  /** @format date */
  month: string
  created_count: number
  updated_count: number
}

export interface ProjectBySDG {
  sdg: number
  project_count: number
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectCategory {
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
  organization: string
  background_image: Image
  templates: TemplateLight[]
  id: number
  /**
   * name of the category
   * @maxLength 100
   */
  name: string
  name_detected_language: string | null
  /** name of the category */
  name_en: string | null
  /** name of the category */
  name_fr: string | null
  /** name of the category */
  name_de: string | null
  /** name of the category */
  name_nl: string | null
  /** name of the category */
  name_et: string | null
  /** name of the category */
  name_ca: string | null
  /** name of the category */
  name_es: string | null
  /** description of the category */
  description?: string
  description_detected_language: string | null
  /** description of the category */
  description_en: string | null
  /** description of the category */
  description_fr: string | null
  /** description of the category */
  description_de: string | null
  /** description of the category */
  description_nl: string | null
  /** description of the category */
  description_et: string | null
  /** description of the category */
  description_ca: string | null
  /** description of the category */
  description_es: string | null
  /** @maxLength 9 */
  background_color?: string
  /** @maxLength 9 */
  foreground_color?: string
  is_reviewable?: boolean
  /**
   * @min -32768
   * @max 32767
   */
  order_index?: number
  only_reviewer_can_publish?: boolean
  hierarchy: Record<string, string | number>[]
  children: Record<string, string | number>[]
  projects_count: number
  tags?: string[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectCategoryLight {
  id: number
  /**
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /**
   * name of the category
   * @maxLength 100
   */
  name: string
  name_detected_language: string | null
  /** name of the category */
  name_en: string | null
  /** name of the category */
  name_fr: string | null
  /** name of the category */
  name_de: string | null
  /** name of the category */
  name_nl: string | null
  /** name of the category */
  name_et: string | null
  /** name of the category */
  name_ca: string | null
  /** name of the category */
  name_es: string | null
  /** @maxLength 9 */
  background_color?: string
  /** @maxLength 9 */
  foreground_color?: string
  organization: string
  is_reviewable?: boolean
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectCategoryLightRequest {
  /**
   * @minLength 1
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /**
   * name of the category
   * @minLength 1
   * @maxLength 100
   */
  name: string
  /** @maxLength 9 */
  background_color?: string
  /** @maxLength 9 */
  foreground_color?: string
  is_reviewable?: boolean
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectCategoryRequest {
  /**
   * name of the category
   * @minLength 1
   * @maxLength 100
   */
  name: string
  /** description of the category */
  description?: string
  /** @maxLength 9 */
  background_color?: string
  /** @maxLength 9 */
  foreground_color?: string
  is_reviewable?: boolean
  /**
   * @min -32768
   * @max 32767
   */
  order_index?: number
  only_reviewer_can_publish?: boolean
  parent?: number | null
  tags?: string[]
  background_image_id?: number
  templates_ids?: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectLight {
  /** @maxLength 8 */
  id?: string
  /**
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /** @maxLength 255 */
  title: string
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_de: string | null
  /** Title */
  title_nl: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_ca: string | null
  /** Title */
  title_es: string | null
  /** Main goal */
  purpose?: string
  purpose_detected_language: string | null
  /** Main goal */
  purpose_en: string | null
  /** Main goal */
  purpose_fr: string | null
  /** Main goal */
  purpose_de: string | null
  /** Main goal */
  purpose_nl: string | null
  /** Main goal */
  purpose_et: string | null
  /** Main goal */
  purpose_ca: string | null
  /** Main goal */
  purpose_es: string | null
  categories: ProjectCategoryLight[]
  header_image: Image
  language?: LanguageEnum
  /** Visibility */
  publication_status?: PublicationStatus
  life_status?: LifeStatusEnum
  /** @format date-time */
  created_at: string
  /** @format date-time */
  updated_at: string
  is_followed: Record<string, any>
  is_featured: boolean
  is_group_project: boolean
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectLightRequest {
  /**
   * @minLength 1
   * @maxLength 8
   */
  id?: string
  /**
   * @minLength 1
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
  /** Main goal */
  purpose?: string
  language?: LanguageEnum
  /** Visibility */
  publication_status?: PublicationStatus
  life_status?: LifeStatusEnum
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectMessage {
  id: number
  content?: string
  content_detected_language: string | null
  content_en: string | null
  content_fr: string | null
  content_de: string | null
  content_nl: string | null
  content_et: string | null
  content_ca: string | null
  content_es: string | null
  /** @format date-time */
  created_at: string
  /** @format date-time */
  updated_at: string
  /** @format date-time */
  deleted_at?: string | null
  reply_on?: number | null
  author: UserLighter
  images: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectMessageRequest {
  content?: string
  /** @format date-time */
  deleted_at?: string | null
  reply_on?: number | null
}

export interface ProjectRemoveTeamMembersRequest {
  users?: string[]
  people_groups?: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectRequest {
  /**
   * @minLength 1
   * @maxLength 8
   */
  id?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
  description?: string
  is_shareable?: boolean
  /** Main goal */
  purpose?: string
  language?: LanguageEnum
  /** Visibility */
  publication_status?: PublicationStatus
  life_status?: LifeStatusEnum
  /**
   * Sustainable development goals
   * @maxItems 17
   */
  sdgs?: SdgsEnum[]
  /** @format date-time */
  deleted_at?: string | null
  tags?: string[]
  project_categories_ids?: number[]
  header_image_id?: number
  template_id?: number
  organizations_codes: string[]
  images_ids?: number[]
  team?: ProjectAddTeamMembersRequest
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectSearch {
  /** @maxLength 8 */
  id?: string
  /** @maxLength 255 */
  title: string
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_de: string | null
  /** Title */
  title_nl: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_ca: string | null
  /** Title */
  title_es: string | null
  /**
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /** Main goal */
  purpose?: string
  purpose_detected_language: string | null
  /** Main goal */
  purpose_en: string | null
  /** Main goal */
  purpose_fr: string | null
  /** Main goal */
  purpose_de: string | null
  /** Main goal */
  purpose_nl: string | null
  /** Main goal */
  purpose_et: string | null
  /** Main goal */
  purpose_ca: string | null
  /** Main goal */
  purpose_es: string | null
  language?: LanguageEnum
  header_image: Image
  categories: ProjectCategoryLight[]
  /** @format date-time */
  created_at: string
  /** @format date-time */
  updated_at: string
  /** Visibility */
  publication_status?: PublicationStatus
  /**
   * Sustainable development goals
   * @maxItems 17
   */
  sdgs?: SdgsEnum[]
  life_status?: LifeStatusEnum
  is_followed: Record<string, any>
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectSuperLight {
  /** @maxLength 8 */
  id?: string
  /**
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /** @maxLength 255 */
  title: string
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_de: string | null
  /** Title */
  title_nl: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_ca: string | null
  /** Title */
  title_es: string | null
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectTab {
  id: number
  type?: ProjectTabTypeEnum
  /** @maxLength 255 */
  title: string
  title_detected_language: string | null
  title_en: string | null
  title_fr: string | null
  title_de: string | null
  title_nl: string | null
  title_et: string | null
  title_ca: string | null
  title_es: string | null
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  /** @maxLength 255 */
  icon?: string
  images?: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectTabItem {
  id: number
  /** @format date-time */
  created_at: string
  /** @format date-time */
  updated_at: string
  /** @maxLength 255 */
  title: string
  title_detected_language: string | null
  title_en: string | null
  title_fr: string | null
  title_de: string | null
  title_nl: string | null
  title_et: string | null
  title_ca: string | null
  title_es: string | null
  content?: string
  content_detected_language: string | null
  content_en: string | null
  content_fr: string | null
  content_de: string | null
  content_nl: string | null
  content_et: string | null
  content_ca: string | null
  content_es: string | null
  images?: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectTabItemRequest {
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
  content?: string
  images?: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectTabRequest {
  type?: ProjectTabTypeEnum
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
  description?: string
  /** @maxLength 255 */
  icon?: string
  images?: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectTemplate {
  id: number
  name: string
  name_detected_language: string | null
  name_en: string | null
  name_fr: string | null
  name_de: string | null
  name_nl: string | null
  name_et: string | null
  name_ca: string | null
  name_es: string | null
  description: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  language: LanguageEnum
  project_title: string
  project_title_detected_language: string | null
  project_title_en: string | null
  project_title_fr: string | null
  project_title_de: string | null
  project_title_nl: string | null
  project_title_et: string | null
  project_title_ca: string | null
  project_title_es: string | null
  project_description: string
  project_description_detected_language: string | null
  project_description_en: string | null
  project_description_fr: string | null
  project_description_de: string | null
  project_description_nl: string | null
  project_description_et: string | null
  project_description_ca: string | null
  project_description_es: string | null
  project_purpose: string
  project_purpose_detected_language: string | null
  project_purpose_en: string | null
  project_purpose_fr: string | null
  project_purpose_de: string | null
  project_purpose_nl: string | null
  project_purpose_et: string | null
  project_purpose_ca: string | null
  project_purpose_es: string | null
  project_tags: string[]
  blogentry_title: string
  blogentry_title_detected_language: string | null
  blogentry_title_en: string | null
  blogentry_title_fr: string | null
  blogentry_title_de: string | null
  blogentry_title_nl: string | null
  blogentry_title_et: string | null
  blogentry_title_ca: string | null
  blogentry_title_es: string | null
  blogentry_content: string
  blogentry_content_detected_language: string | null
  blogentry_content_en: string | null
  blogentry_content_fr: string | null
  blogentry_content_de: string | null
  blogentry_content_nl: string | null
  blogentry_content_et: string | null
  blogentry_content_ca: string | null
  blogentry_content_es: string | null
  goal_title: string
  goal_title_detected_language: string | null
  goal_title_en: string | null
  goal_title_fr: string | null
  goal_title_de: string | null
  goal_title_nl: string | null
  goal_title_et: string | null
  goal_title_ca: string | null
  goal_title_es: string | null
  goal_description: string
  goal_description_detected_language: string | null
  goal_description_en: string | null
  goal_description_fr: string | null
  goal_description_de: string | null
  goal_description_nl: string | null
  goal_description_et: string | null
  goal_description_ca: string | null
  goal_description_es: string | null
  review_title: string
  review_title_detected_language: string | null
  review_title_en: string | null
  review_title_fr: string | null
  review_title_de: string | null
  review_title_nl: string | null
  review_title_et: string | null
  review_title_ca: string | null
  review_title_es: string | null
  review_description: string
  review_description_detected_language: string | null
  review_description_en: string | null
  review_description_fr: string | null
  review_description_de: string | null
  review_description_nl: string | null
  review_description_et: string | null
  review_description_ca: string | null
  review_description_es: string | null
  comment_content: string
  comment_content_detected_language: string | null
  comment_content_en: string | null
  comment_content_fr: string | null
  comment_content_de: string | null
  comment_content_nl: string | null
  comment_content_et: string | null
  comment_content_ca: string | null
  comment_content_es: string | null
  audience: AudienceEnum
  time_estimation: TimeEstimationEnum
  share_globally: boolean
}

export interface ProjectVersion {
  id: number
  project_id: string
  /** @format date-time */
  history_date: string
  /** @maxLength 100 */
  history_change_reason?: string | null
  delta: Record<string, string>
  /** @maxLength 255 */
  title: string
  /** Main goal */
  purpose?: string
  description?: string
  tags: string[]
  members: string[]
  comments: Record<string, any>
  linked_projects: Record<string, any>
  categories: string[]
}

export interface ProjectVersionList {
  id: number
  project_id: string
  /** @format date-time */
  history_date: string
  /** @maxLength 100 */
  history_change_reason?: string | null
  updated_fields: string[]
}

export interface Result {
  result: boolean
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Review {
  id: number
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  /** @maxLength 100 */
  title: string
  title_detected_language: string | null
  title_en: string | null
  title_fr: string | null
  title_de: string | null
  title_nl: string | null
  title_et: string | null
  title_ca: string | null
  title_es: string | null
  /** @format date-time */
  created_at: string
  /** @format date-time */
  updated_at: string
  project_id: string
  reviewer: UserLighter
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ReviewRequest {
  description?: string
  /**
   * @minLength 1
   * @maxLength 100
   */
  title: string
  /** @minLength 1 */
  project_id: string
}

export interface SearchObject {
  id: number
  type: SearchObjectTypeEnum
  project: ProjectSearch
  user: UserLighter
  people_group: PeopleGroupLight
  /** @format date-time */
  last_update: string | null
}

export interface Skill {
  id: number
  /** @format uuid */
  user: string
  tag: string
  /**
   * @min -32768
   * @max 32767
   */
  level: number
  /**
   * @min -32768
   * @max 32767
   */
  level_to_reach: number
  /** @maxLength 255 */
  category?: string
  type?: TypeD3EEnum
  can_mentor?: boolean
  needs_mentor?: boolean
  comment?: string
}

export interface SkillLight {
  id: number
  tag: Tag
  level: number
  level_to_reach: number
  category: string
  type: TypeD3EEnum
  can_mentor: boolean
  needs_mentor: boolean
  comment: string
}

export interface SkillRequest {
  tag: string
  /**
   * @min -32768
   * @max 32767
   */
  level: number
  /**
   * @min -32768
   * @max 32767
   */
  level_to_reach: number
  /** @maxLength 255 */
  category?: string
  type?: TypeD3EEnum
  can_mentor?: boolean
  needs_mentor?: boolean
  comment?: string
}

export interface Stats {
  by_sdg: ProjectBySDG[]
  by_month: ProjectByMonth[]
  top_tags: TagProject[]
  total: number
}

/** Automatically translate model fields for model with registered translation */
export interface Tag {
  id: number
  type: Type06EEnum
  secondary_type: SecondaryTypeEnum
  mentors_count: number
  mentorees_count: number
  highlight: Record<string, any>
  /** @maxLength 255 */
  title: string
  /**
   * Title [en]
   * @maxLength 255
   */
  title_en?: string | null
  /**
   * Title [fr]
   * @maxLength 255
   */
  title_fr?: string | null
  /**
   * Title [de]
   * @maxLength 255
   */
  title_de?: string | null
  /**
   * Title [nl]
   * @maxLength 255
   */
  title_nl?: string | null
  /**
   * Title [et]
   * @maxLength 255
   */
  title_et?: string | null
  /**
   * Title [ca]
   * @maxLength 255
   */
  title_ca?: string | null
  /**
   * Title [es]
   * @maxLength 255
   */
  title_es?: string | null
  description?: string
  /** Description [en] */
  description_en?: string | null
  /** Description [fr] */
  description_fr?: string | null
  /** Description [de] */
  description_de?: string | null
  /** Description [nl] */
  description_nl?: string | null
  /** Description [et] */
  description_et?: string | null
  /** Description [ca] */
  description_ca?: string | null
  /** Description [es] */
  description_es?: string | null
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface TagClassification {
  id: number
  type: Type06EEnum
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
  organization: string
  is_owned: boolean
  is_enabled_for_projects: boolean
  is_enabled_for_skills: boolean
  /** @maxLength 50 */
  title: string
  title_detected_language: string | null
  title_en: string | null
  title_fr: string | null
  title_de: string | null
  title_nl: string | null
  title_et: string | null
  title_ca: string | null
  title_es: string | null
  /** @maxLength 500 */
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  is_public?: boolean
}

export interface TagClassificationAddTagsRequest {
  tags?: number[]
}

export interface TagClassificationRemoveTagsRequest {
  tags?: number[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface TagClassificationRequest {
  /**
   * @minLength 1
   * @maxLength 50
   */
  title: string
  /** @maxLength 500 */
  description?: string
  is_public?: boolean
}

/** Automatically translate model fields for model with registered translation */
export interface TagProject {
  id: number
  /** @maxLength 255 */
  title: string
  /**
   * Title [en]
   * @maxLength 255
   */
  title_en?: string | null
  /**
   * Title [fr]
   * @maxLength 255
   */
  title_fr?: string | null
  /**
   * Title [de]
   * @maxLength 255
   */
  title_de?: string | null
  /**
   * Title [nl]
   * @maxLength 255
   */
  title_nl?: string | null
  /**
   * Title [et]
   * @maxLength 255
   */
  title_et?: string | null
  /**
   * Title [ca]
   * @maxLength 255
   */
  title_ca?: string | null
  /**
   * Title [es]
   * @maxLength 255
   */
  title_es?: string | null
  projects: string[]
  project_count: number
}

/** Automatically translate model fields for model with registered translation */
export interface TagRequest {
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
  /**
   * Title [en]
   * @minLength 1
   * @maxLength 255
   */
  title_en?: string | null
  /**
   * Title [fr]
   * @minLength 1
   * @maxLength 255
   */
  title_fr?: string | null
  /**
   * Title [de]
   * @minLength 1
   * @maxLength 255
   */
  title_de?: string | null
  /**
   * Title [nl]
   * @minLength 1
   * @maxLength 255
   */
  title_nl?: string | null
  /**
   * Title [et]
   * @minLength 1
   * @maxLength 255
   */
  title_et?: string | null
  /**
   * Title [ca]
   * @minLength 1
   * @maxLength 255
   */
  title_ca?: string | null
  /**
   * Title [es]
   * @minLength 1
   * @maxLength 255
   */
  title_es?: string | null
  description?: string
  /**
   * Description [en]
   * @minLength 1
   */
  description_en?: string | null
  /**
   * Description [fr]
   * @minLength 1
   */
  description_fr?: string | null
  /**
   * Description [de]
   * @minLength 1
   */
  description_de?: string | null
  /**
   * Description [nl]
   * @minLength 1
   */
  description_nl?: string | null
  /**
   * Description [et]
   * @minLength 1
   */
  description_et?: string | null
  /**
   * Description [ca]
   * @minLength 1
   */
  description_ca?: string | null
  /**
   * Description [es]
   * @minLength 1
   */
  description_es?: string | null
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Template {
  id: number
  organization: string
  categories: ProjectCategoryLight[]
  /** @maxLength 255 */
  name?: string
  name_detected_language: string | null
  name_en: string | null
  name_fr: string | null
  name_de: string | null
  name_nl: string | null
  name_et: string | null
  name_ca: string | null
  name_es: string | null
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  language?: LanguageEnum
  /** @maxLength 255 */
  project_title?: string
  project_title_detected_language: string | null
  project_title_en: string | null
  project_title_fr: string | null
  project_title_de: string | null
  project_title_nl: string | null
  project_title_et: string | null
  project_title_ca: string | null
  project_title_es: string | null
  project_description?: string
  project_description_detected_language: string | null
  project_description_en: string | null
  project_description_fr: string | null
  project_description_de: string | null
  project_description_nl: string | null
  project_description_et: string | null
  project_description_ca: string | null
  project_description_es: string | null
  project_purpose?: string
  project_purpose_detected_language: string | null
  project_purpose_en: string | null
  project_purpose_fr: string | null
  project_purpose_de: string | null
  project_purpose_nl: string | null
  project_purpose_et: string | null
  project_purpose_ca: string | null
  project_purpose_es: string | null
  project_tags?: string[]
  /** @maxLength 255 */
  blogentry_title?: string
  blogentry_title_detected_language: string | null
  blogentry_title_en: string | null
  blogentry_title_fr: string | null
  blogentry_title_de: string | null
  blogentry_title_nl: string | null
  blogentry_title_et: string | null
  blogentry_title_ca: string | null
  blogentry_title_es: string | null
  blogentry_content?: string
  blogentry_content_detected_language: string | null
  blogentry_content_en: string | null
  blogentry_content_fr: string | null
  blogentry_content_de: string | null
  blogentry_content_nl: string | null
  blogentry_content_et: string | null
  blogentry_content_ca: string | null
  blogentry_content_es: string | null
  /** @maxLength 255 */
  goal_title?: string
  goal_title_detected_language: string | null
  goal_title_en: string | null
  goal_title_fr: string | null
  goal_title_de: string | null
  goal_title_nl: string | null
  goal_title_et: string | null
  goal_title_ca: string | null
  goal_title_es: string | null
  goal_description?: string
  goal_description_detected_language: string | null
  goal_description_en: string | null
  goal_description_fr: string | null
  goal_description_de: string | null
  goal_description_nl: string | null
  goal_description_et: string | null
  goal_description_ca: string | null
  goal_description_es: string | null
  /** @maxLength 255 */
  review_title?: string
  review_title_detected_language: string | null
  review_title_en: string | null
  review_title_fr: string | null
  review_title_de: string | null
  review_title_nl: string | null
  review_title_et: string | null
  review_title_ca: string | null
  review_title_es: string | null
  review_description?: string
  review_description_detected_language: string | null
  review_description_en: string | null
  review_description_fr: string | null
  review_description_de: string | null
  review_description_nl: string | null
  review_description_et: string | null
  review_description_ca: string | null
  review_description_es: string | null
  comment_content?: string
  comment_content_detected_language: string | null
  comment_content_en: string | null
  comment_content_fr: string | null
  comment_content_de: string | null
  comment_content_nl: string | null
  comment_content_et: string | null
  comment_content_ca: string | null
  comment_content_es: string | null
  audience?: AudienceEnum | BlankEnum
  time_estimation?: TimeEstimationEnum | BlankEnum
  share_globally?: boolean
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface TemplateLight {
  id: number
  /** @maxLength 255 */
  name?: string
  name_detected_language: string | null
  name_en: string | null
  name_fr: string | null
  name_de: string | null
  name_nl: string | null
  name_et: string | null
  name_ca: string | null
  name_es: string | null
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  organization: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface TemplateLightRequest {
  /** @maxLength 255 */
  name?: string
  description?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface TemplateRequest {
  /** @maxLength 255 */
  name?: string
  description?: string
  language?: LanguageEnum
  /** @maxLength 255 */
  project_title?: string
  project_description?: string
  project_purpose?: string
  project_tags?: string[]
  /** @maxLength 255 */
  blogentry_title?: string
  blogentry_content?: string
  /** @maxLength 255 */
  goal_title?: string
  goal_description?: string
  /** @maxLength 255 */
  review_title?: string
  review_description?: string
  comment_content?: string
  audience?: AudienceEnum | BlankEnum
  time_estimation?: TimeEstimationEnum | BlankEnum
  share_globally?: boolean
  categories_ids?: number[]
}

/**
 * Serializer for TermsAndConditions model.
 *
 * One default Terms and Conditions can be defined for the whole platform.
 * If an organization does not have its own Terms and Conditions, the default one will be used.
 * If the default one is updated, all organizations using it will see the changes.
 *
 * The fields `displayed_content_organization`, `displayed_content` and `displayed_version`
 * are read-only and represent the actual Terms and Conditions that will be displayed to users.
 *
 * The field `content` is write-only and allows to set the content of the Terms and Conditions.
 */
export interface TermsAndConditions {
  id: number
  displayed_content_organization: string
  displayed_content: string
  displayed_version: number
  content_detected_language: string | null
  content_en: string | null
  content_fr: string | null
  content_de: string | null
  content_nl: string | null
  content_et: string | null
  content_ca: string | null
  content_es: string | null
}

/**
 * Serializer for TermsAndConditions model.
 *
 * One default Terms and Conditions can be defined for the whole platform.
 * If an organization does not have its own Terms and Conditions, the default one will be used.
 * If the default one is updated, all organizations using it will see the changes.
 *
 * The fields `displayed_content_organization`, `displayed_content` and `displayed_version`
 * are read-only and represent the actual Terms and Conditions that will be displayed to users.
 *
 * The field `content` is write-only and allows to set the content of the Terms and Conditions.
 */
export interface TermsAndConditionsRequest {
  /** @minLength 1 */
  content: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface User {
  id: number
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
  /** @format date-time */
  created_at: string
  permissions: string[]
  is_superuser: boolean
  people_groups: any[]
  notifications: number
  privacy_settings: PrivacySettings
  skills: Record<string, any>[]
  profile_picture: Record<string, any>
  language?: LanguageEnum
  onboarding_status?: Record<string, any>
  signed_terms_and_conditions?: Record<string, any>
  /** @format uuid */
  keycloak_id: string | null
  /**
   * id of user in people
   * @format uuid
   */
  people_id?: string | null
  /** @format email */
  email?: string
  /** @maxLength 255 */
  given_name?: string
  /** @maxLength 255 */
  family_name?: string
  /** @format date */
  birthdate?: string | null
  /** @maxLength 32 */
  pronouns?: string
  short_description?: string
  short_description_detected_language: string | null
  short_description_en: string | null
  short_description_fr: string | null
  short_description_de: string | null
  short_description_nl: string | null
  short_description_et: string | null
  short_description_ca: string | null
  short_description_es: string | null
  description?: string
  description_detected_language: string | null
  description_en: string | null
  description_fr: string | null
  description_de: string | null
  description_nl: string | null
  description_et: string | null
  description_ca: string | null
  description_es: string | null
  location?: string
  /** @maxLength 255 */
  job?: string
  job_detected_language: string | null
  job_en: string | null
  job_fr: string | null
  job_de: string | null
  job_nl: string | null
  job_et: string | null
  job_ca: string | null
  job_es: string | null
  mobile_phone?: string
  /** @format email */
  personal_email?: string
  sdgs?: number[]
  facebook?: string
  linkedin?: string
  medium?: string
  website?: string
  skype?: string
  landline_phone?: string
  twitter?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface UserAdminList {
  id: number
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
  /** @format uuid */
  keycloak_id: string | null
  email: string
  given_name: string
  family_name: string
  job: string
  job_detected_language: string | null
  job_en: string | null
  job_fr: string | null
  job_de: string | null
  job_nl: string | null
  job_et: string | null
  job_ca: string | null
  job_es: string | null
  current_org_role: string
  email_verified: boolean
  /** @format date-time */
  last_login: string | null
  people_groups: any[]
  /** @format date-time */
  created_at: string
}

/** Used to follow several projects at once. */
export interface UserFollowManyRequest {
  follows: FollowRequest[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface UserLight {
  id: number
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
  /** @format uuid */
  keycloak_id: string | null
  /**
   * id of user in people
   * @format uuid
   */
  people_id: string | null
  /** @format email */
  email?: string
  given_name: string
  family_name: string
  pronouns?: string
  job: string
  job_detected_language: string | null
  job_en: string | null
  job_fr: string | null
  job_de: string | null
  job_nl: string | null
  job_et: string | null
  job_ca: string | null
  job_es: string | null
  profile_picture: Record<string, any> | string
  current_org_role: string
  /** @format date-time */
  last_login: string | null
  people_groups: any[]
  /** @format date-time */
  created_at: string
  skills: Record<string, any>[]
  needs_mentor_on: Record<string, any>[]
  can_mentor_on: Record<string, any>[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface UserLighter {
  id: number
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
  /** @format uuid */
  keycloak_id: string | null
  /** @format email */
  email?: string
  given_name: string
  family_name: string
  pronouns: string
  job: string
  job_detected_language: string | null
  job_en: string | null
  job_fr: string | null
  job_de: string | null
  job_nl: string | null
  job_et: string | null
  job_ca: string | null
  job_es: string | null
  profile_picture: Record<string, any>
  is_manager: boolean
  is_leader: boolean
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface UserLighterRequest {
  /** @format email */
  email?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface UserLighterSerializerKeycloakRelatedField {
  id: number
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
  /** @format uuid */
  keycloak_id: string | null
  /** @format email */
  email?: string
  given_name: string
  family_name: string
  pronouns: string
  job: string
  job_detected_language: string | null
  job_en: string | null
  job_fr: string | null
  job_de: string | null
  job_nl: string | null
  job_et: string | null
  job_ca: string | null
  job_es: string | null
  profile_picture: Record<string, any>
  is_manager: boolean
  is_leader: boolean
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface UserLighterSerializerKeycloakRelatedFieldRequest {
  /** @format email */
  email?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface UserRequest {
  roles_to_add?: string[]
  roles_to_remove?: string[]
  language?: LanguageEnum
  onboarding_status?: Record<string, any>
  signed_terms_and_conditions?: Record<string, any>
  /**
   * id of user in people
   * @format uuid
   */
  people_id?: string | null
  /** @format email */
  email?: string
  /** @maxLength 255 */
  given_name?: string
  /** @maxLength 255 */
  family_name?: string
  /** @format date */
  birthdate?: string | null
  /** @maxLength 32 */
  pronouns?: string
  short_description?: string
  description?: string
  location?: string
  /** @maxLength 255 */
  job?: string
  mobile_phone?: string
  /** @format email */
  personal_email?: string
  sdgs?: number[]
  facebook?: string
  linkedin?: string
  medium?: string
  website?: string
  skype?: string
  landline_phone?: string
  twitter?: string
  /** @format binary */
  profile_picture_file?: File | null
  /** @format double */
  profile_picture_scale_x?: number | null
  /** @format double */
  profile_picture_scale_y?: number | null
  /** @format double */
  profile_picture_left?: number | null
  /** @format double */
  profile_picture_top?: number | null
  /** @format double */
  profile_picture_natural_ratio?: number | null
}

export interface ApiSchemaRetrieveParams {
  format?: 'json' | 'yaml'
  lang?: 'ca' | 'de' | 'en' | 'es' | 'et' | 'fr' | 'nl'
}

export type ApiSchemaRetrieveData = Record<string, any>

export type AccessTokenCreateData = AccessToken

export interface AnnouncementListParams {
  /** @format date */
  from_date?: string
  /** @format date */
  from_date_or_none?: string
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** Multiple values may be separated by commas. */
  organizations?: string[]
  /** @format date */
  to_date?: string
  /** @format date */
  to_date_or_none?: string
}

export type AnnouncementListData = PaginatedAnnouncementList

export interface AnnouncementRetrieveParams {
  /** @pattern ^[0-9]+$ */
  id: string
}

export type AnnouncementRetrieveData = Announcement

export interface EmailListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** A search term. */
  search?: string
}

export type EmailListData = PaginatedEmailList

export type EmailCreateData = Email

/** @format binary */
export type EmailImageCreatePayload = File

export interface EmailImageCreateParams {
  /** @pattern ^[^/]+$ */
  emailId: string
}

export type EmailImageCreateData = Image

export interface EmailImageRetrieveParams {
  /** @pattern ^[^/]+$ */
  emailId: string
  /** A unique integer value identifying this image. */
  id: number
}

export type EmailImageRetrieveData = Image

export interface EmailImageUpdateParams {
  /** @pattern ^[^/]+$ */
  emailId: string
  /** A unique integer value identifying this image. */
  id: number
}

export type EmailImageUpdateData = Image

export interface EmailImagePartialUpdateParams {
  /** @pattern ^[^/]+$ */
  emailId: string
  /** A unique integer value identifying this image. */
  id: number
}

export type EmailImagePartialUpdateData = Image

export interface EmailImageDestroyParams {
  /** @pattern ^[^/]+$ */
  emailId: string
  /** A unique integer value identifying this image. */
  id: number
}

export type EmailImageDestroyData = any

export interface EmailRetrieveParams {
  /** @pattern ^[0-9]+$ */
  id: string
}

export type EmailRetrieveData = Email

export interface EmailUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
}

export type EmailUpdateData = Email

export interface EmailPartialUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
}

export type EmailPartialUpdateData = Email

export interface EmailDestroyParams {
  /** @pattern ^[0-9]+$ */
  id: string
}

export type EmailDestroyData = any

export type GoogleGroupEmailAvailableCreateData = EmailAvailable

export type GoogleOrgUnitsRetrieveData = string[]

export type GoogleUserEmailAvailableCreateData = EmailAvailable

export type LanguagesRetrieveData = dict[]

export interface LocationListParams {
  /** Which field to use when ordering the results. */
  ordering?: string
  /** Multiple values may be separated by commas. */
  organizations?: string[]
  /** A search term. */
  search?: string
}

export type LocationListData = Location[]

export interface LocationRetrieveParams {
  /** @pattern ^[0-9]+$ */
  id: string
}

export type LocationRetrieveData = Location

export interface NotificationListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** A search term. */
  search?: string
}

export type NotificationListData = PaginatedNotificationsList

export interface NotificationsSettingRetrieveParams {
  userId: number
}

export type NotificationsSettingRetrieveData = NotificationSettings

export interface NotificationsSettingUpdateParams {
  userId: number
}

export type NotificationsSettingUpdateData = NotificationSettings

export interface NotificationsSettingPartialUpdateParams {
  userId: number
}

export type NotificationsSettingPartialUpdateData = NotificationSettings

export interface OrganizationListParams {
  /** Multiple values may be separated by commas. */
  codes?: string[]
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Multiple values may be separated by commas. */
  tags?: string[]
}

export type OrganizationListData = PaginatedOrganizationLightList

export type OrganizationCreateData = Organization

export interface OrganizationRetrieveParams {
  /** @pattern ^[a-zA-Z0-9_-]+$ */
  code: string
}

export type OrganizationRetrieveData = Organization

export interface OrganizationUpdateParams {
  /** @pattern ^[a-zA-Z0-9_-]+$ */
  code: string
}

export type OrganizationUpdateData = Organization

export interface OrganizationPartialUpdateParams {
  /** @pattern ^[a-zA-Z0-9_-]+$ */
  code: string
}

export type OrganizationPartialUpdateData = Organization

export interface OrganizationDestroyParams {
  /** @pattern ^[a-zA-Z0-9_-]+$ */
  code: string
}

export type OrganizationDestroyData = any

export interface OrganizationCategoriesHierarchyRetrieveParams {
  /** @pattern ^[a-zA-Z0-9_-]+$ */
  code: string
}

export type OrganizationCategoriesHierarchyRetrieveData = Organization

export interface OrganizationFeaturedProjectRetrieveParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** @pattern ^[a-zA-Z0-9_-]+$ */
  code: string
}

export type OrganizationFeaturedProjectRetrieveData = Organization

export interface OrganizationFeaturedProjectAddCreateParams {
  /** @pattern ^[a-zA-Z0-9_-]+$ */
  code: string
}

export type OrganizationFeaturedProjectAddCreateData = Organization

export interface OrganizationFeaturedProjectRemoveCreateParams {
  /** @pattern ^[a-zA-Z0-9_-]+$ */
  code: string
}

export type OrganizationFeaturedProjectRemoveCreateData = Organization

export interface OrganizationMemberAddCreateParams {
  /** @pattern ^[a-zA-Z0-9_-]+$ */
  code: string
}

export type OrganizationMemberAddCreateData = User

export interface OrganizationMemberRemoveCreateParams {
  /** @pattern ^[a-zA-Z0-9_-]+$ */
  code: string
}

export type OrganizationMemberRemoveCreateData = User

export interface OrganizationPeopleGroupsHierarchyRetrieveParams {
  /** @pattern ^[a-zA-Z0-9_-]+$ */
  code: string
}

export type OrganizationPeopleGroupsHierarchyRetrieveData = Organization

export interface OrganizationAccessRequestListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** A search term. */
  search?: string
  status?: 'accepted' | 'declined' | 'pending'
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationAccessRequestListData = PaginatedAccessRequestList

export interface OrganizationAccessRequestCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationAccessRequestCreateData = AccessRequest

export interface OrganizationAccessRequestAcceptCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationAccessRequestAcceptCreateData = ProcessAccessRequest

export interface OrganizationAccessRequestDeclineCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationAccessRequestDeclineCreateData = ProcessAccessRequest

/** @format binary */
export type OrganizationBannerCreatePayload = File

export interface OrganizationBannerCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationBannerCreateData = Image

export interface OrganizationBannerUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationBannerUpdateData = Image

export interface OrganizationBannerPartialUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationBannerPartialUpdateData = Image

export interface OrganizationBannerDestroyParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationBannerDestroyData = any

export interface OrganizationCategoryListParams {
  is_root?: boolean
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  organization?: string
  /** A search term. */
  search?: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationCategoryListData = PaginatedProjectCategoryList

export interface OrganizationCategoryCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationCategoryCreateData = ProjectCategory

/** @format binary */
export type OrganizationCategoryBackgroundCreatePayload = File

export interface OrganizationCategoryBackgroundCreateParams {
  /** @pattern ^[^/]+$ */
  categoryId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationCategoryBackgroundCreateData = Image

export interface OrganizationCategoryBackgroundUpdateParams {
  /** @pattern ^[^/]+$ */
  categoryId: string
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationCategoryBackgroundUpdateData = Image

export interface OrganizationCategoryBackgroundPartialUpdateParams {
  /** @pattern ^[^/]+$ */
  categoryId: string
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationCategoryBackgroundPartialUpdateData = Image

export interface OrganizationCategoryBackgroundDestroyParams {
  /** @pattern ^[^/]+$ */
  categoryId: string
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationCategoryBackgroundDestroyData = any

export interface OrganizationCategoryRetrieveParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationCategoryRetrieveData = ProjectCategory

export interface OrganizationCategoryUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationCategoryUpdateData = ProjectCategory

export interface OrganizationCategoryPartialUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationCategoryPartialUpdateData = ProjectCategory

export interface OrganizationCategoryDestroyParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationCategoryDestroyData = any

export interface OrganizationCategoryHierarchyRetrieveParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationCategoryHierarchyRetrieveData = ProjectCategory

export interface OrganizationCategoryProjectsLifeStatusCreatePayload {
  life_status?: 'running' | 'completed' | 'canceled' | 'toreview'
}

export interface OrganizationCategoryProjectsLifeStatusCreateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationCategoryProjectsLifeStatusCreateData = object

export interface OrganizationCategoryProjectsLockedStatusCreatePayload {
  is_locked?: boolean
}

export interface OrganizationCategoryProjectsLockedStatusCreateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationCategoryProjectsLockedStatusCreateData = object

export interface OrganizationContactUsCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationContactUsCreateData = Contact

export interface OrganizationEventListParams {
  /** @format date-time */
  from_date?: string
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** @format date-time */
  to_date?: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationEventListData = PaginatedEventList

export interface OrganizationEventCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationEventCreateData = any

/** @format binary */
export type OrganizationEventImageCreatePayload = File

export interface OrganizationEventImageCreateParams {
  /** @pattern ^[^/]+$ */
  eventId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationEventImageCreateData = Image

export interface OrganizationEventImageRetrieveParams {
  /** @pattern ^[^/]+$ */
  eventId: string
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationEventImageRetrieveData = Image

export interface OrganizationEventImageUpdateParams {
  /** @pattern ^[^/]+$ */
  eventId: string
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationEventImageUpdateData = Image

export interface OrganizationEventImagePartialUpdateParams {
  /** @pattern ^[^/]+$ */
  eventId: string
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationEventImagePartialUpdateData = Image

export interface OrganizationEventImageDestroyParams {
  /** @pattern ^[^/]+$ */
  eventId: string
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationEventImageDestroyData = any

export interface OrganizationEventRetrieveParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationEventRetrieveData = Event

export interface OrganizationEventUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationEventUpdateData = any

export interface OrganizationEventPartialUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationEventPartialUpdateData = any

export interface OrganizationEventDestroyParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationEventDestroyData = any

export interface OrganizationFileListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationFileListData = PaginatedOrganizationAttachmentFileList

export interface OrganizationFileCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationFileCreateData = OrganizationAttachmentFile

export interface OrganizationFileRetrieveParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationFileRetrieveData = OrganizationAttachmentFile

export interface OrganizationFileUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationFileUpdateData = OrganizationAttachmentFile

export interface OrganizationFilePartialUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationFilePartialUpdateData = OrganizationAttachmentFile

export interface OrganizationFileDestroyParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationFileDestroyData = any

/** @format binary */
export type OrganizationImageCreatePayload = File

export interface OrganizationImageCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationImageCreateData = Image

export interface OrganizationImageRetrieveParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationImageRetrieveData = Image

export interface OrganizationImageUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationImageUpdateData = Image

export interface OrganizationImagePartialUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationImagePartialUpdateData = Image

export interface OrganizationImageDestroyParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationImageDestroyData = any

export interface OrganizationInstructionListParams {
  /** @format date-time */
  from_date?: string
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** @format date-time */
  to_date?: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInstructionListData = PaginatedInstructionList

export interface OrganizationInstructionCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInstructionCreateData = any

export interface OrganizationInstructionRetrieveParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInstructionRetrieveData = Instruction

export interface OrganizationInstructionUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInstructionUpdateData = any

export interface OrganizationInstructionPartialUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInstructionPartialUpdateData = any

export interface OrganizationInstructionDestroyParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInstructionDestroyData = any

/** @format binary */
export type OrganizationInstructionImageCreatePayload = File

export interface OrganizationInstructionImageCreateParams {
  /** @pattern ^[^/]+$ */
  instructionId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInstructionImageCreateData = Image

export interface OrganizationInstructionImageRetrieveParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  instructionId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInstructionImageRetrieveData = Image

export interface OrganizationInstructionImageUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  instructionId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInstructionImageUpdateData = Image

export interface OrganizationInstructionImagePartialUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  instructionId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInstructionImagePartialUpdateData = Image

export interface OrganizationInstructionImageDestroyParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  instructionId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInstructionImageDestroyData = any

export interface OrganizationInvitationListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInvitationListData = PaginatedInvitationList

export interface OrganizationInvitationCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInvitationCreateData = Invitation

export interface OrganizationInvitationRetrieveParams {
  /** A unique integer value identifying this invitation. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInvitationRetrieveData = Invitation

export interface OrganizationInvitationUpdateParams {
  /** A unique integer value identifying this invitation. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInvitationUpdateData = Invitation

export interface OrganizationInvitationPartialUpdateParams {
  /** A unique integer value identifying this invitation. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInvitationPartialUpdateData = Invitation

export interface OrganizationInvitationDestroyParams {
  /** A unique integer value identifying this invitation. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationInvitationDestroyData = any

/** @format binary */
export type OrganizationLogoCreatePayload = File

export interface OrganizationLogoCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationLogoCreateData = Image

export interface OrganizationLogoRetrieveParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationLogoRetrieveData = Image

export interface OrganizationLogoUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationLogoUpdateData = Image

export interface OrganizationLogoPartialUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationLogoPartialUpdateData = Image

export interface OrganizationLogoDestroyParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationLogoDestroyData = any

export interface OrganizationMentoredSkillRetrieveParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationMentoredSkillRetrieveData = Tag

export interface OrganizationMentoreeSkillRetrieveParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationMentoreeSkillRetrieveData = Tag

export interface OrganizationMentoringListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** A search term. */
  search?: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationMentoringListData = PaginatedMentoringList

export interface OrganizationMentoringRetrieveParams {
  /** A unique integer value identifying this mentoring. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationMentoringRetrieveData = Mentoring

export interface OrganizationMentoringDestroyParams {
  /** A unique integer value identifying this mentoring. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationMentoringDestroyData = any

export interface OrganizationMentoringRespondCreateParams {
  /** A unique integer value identifying this mentoring. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationMentoringRespondCreateData = Mentoring

export interface OrganizationMentoringContactMentorCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
  /** @pattern ^[^/]+$ */
  skillId: string
}

export type OrganizationMentoringContactMentorCreateData = Mentoring

export interface OrganizationMentoringContactMentoreeCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
  /** @pattern ^[^/]+$ */
  skillId: string
}

export type OrganizationMentoringContactMentoreeCreateData = Mentoring

export interface OrganizationNewsListParams {
  /** @format date-time */
  from_date?: string
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** @format date-time */
  to_date?: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsListData = PaginatedNewsList

export interface OrganizationNewsCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsCreateData = any

export interface OrganizationNewsRetrieveParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsRetrieveData = News

export interface OrganizationNewsUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsUpdateData = any

export interface OrganizationNewsPartialUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsPartialUpdateData = any

export interface OrganizationNewsDestroyParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsDestroyData = any

/** @format binary */
export type OrganizationNewsHeaderCreatePayload = File

export interface OrganizationNewsHeaderCreateParams {
  /** @pattern ^[^/]+$ */
  newsId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsHeaderCreateData = Image

export interface OrganizationNewsHeaderRetrieveParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  newsId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsHeaderRetrieveData = Image

export interface OrganizationNewsHeaderUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  newsId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsHeaderUpdateData = Image

export interface OrganizationNewsHeaderPartialUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  newsId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsHeaderPartialUpdateData = Image

export interface OrganizationNewsHeaderDestroyParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  newsId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsHeaderDestroyData = any

/** @format binary */
export type OrganizationNewsImageCreatePayload = File

export interface OrganizationNewsImageCreateParams {
  /** @pattern ^[^/]+$ */
  newsId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsImageCreateData = Image

export interface OrganizationNewsImageRetrieveParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  newsId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsImageRetrieveData = Image

export interface OrganizationNewsImageUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  newsId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsImageUpdateData = Image

export interface OrganizationNewsImagePartialUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  newsId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsImagePartialUpdateData = Image

export interface OrganizationNewsImageDestroyParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  newsId: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsImageDestroyData = any

export interface OrganizationNewsfeedListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationNewsfeedListData = PaginatedNewsfeedList

export interface OrganizationPeopleGroupListParams {
  is_root?: boolean
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** Multiple values may be separated by commas. */
  organizations?: string[]
  /** A search term. */
  search?: string
  /** Multiple values may be separated by commas. */
  type?: string[]
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationPeopleGroupListData = PaginatedPeopleGroupLightList

export interface OrganizationPeopleGroupCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationPeopleGroupCreateData = PeopleGroup

export interface OrganizationPeopleGroupRetrieveParams {
  /** A unique integer value identifying this people group. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationPeopleGroupRetrieveData = PeopleGroup

export interface OrganizationPeopleGroupUpdateParams {
  /** A unique integer value identifying this people group. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationPeopleGroupUpdateData = PeopleGroup

export interface OrganizationPeopleGroupPartialUpdateParams {
  /** A unique integer value identifying this people group. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationPeopleGroupPartialUpdateData = PeopleGroup

export interface OrganizationPeopleGroupDestroyParams {
  /** A unique integer value identifying this people group. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationPeopleGroupDestroyData = any

export interface OrganizationPeopleGroupHierarchyRetrieveParams {
  /** A unique integer value identifying this people group. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationPeopleGroupHierarchyRetrieveData = PeopleGroup

export interface OrganizationPeopleGroupMemberRetrieveParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** A unique integer value identifying this people group. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationPeopleGroupMemberRetrieveData = PeopleGroup

export interface OrganizationPeopleGroupMemberAddCreateParams {
  /** A unique integer value identifying this people group. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationPeopleGroupMemberAddCreateData = PeopleGroup

export interface OrganizationPeopleGroupMemberRemoveCreateParams {
  /** A unique integer value identifying this people group. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationPeopleGroupMemberRemoveCreateData = PeopleGroup

export interface OrganizationPeopleGroupProjectRetrieveParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** A unique integer value identifying this people group. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationPeopleGroupProjectRetrieveData = PeopleGroup

export interface OrganizationPeopleGroupProjectAddCreateParams {
  /** A unique integer value identifying this people group. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationPeopleGroupProjectAddCreateData = PeopleGroup

export interface OrganizationPeopleGroupProjectRemoveCreateParams {
  /** A unique integer value identifying this people group. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationPeopleGroupProjectRemoveCreateData = PeopleGroup

/** @format binary */
export type OrganizationPeopleGroupHeaderCreatePayload = File

export interface OrganizationPeopleGroupHeaderCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
  peopleGroupId: string
}

export type OrganizationPeopleGroupHeaderCreateData = Image

export interface OrganizationPeopleGroupHeaderUpdateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
  peopleGroupId: string
}

export type OrganizationPeopleGroupHeaderUpdateData = Image

export interface OrganizationPeopleGroupHeaderPartialUpdateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
  peopleGroupId: string
}

export type OrganizationPeopleGroupHeaderPartialUpdateData = Image

export interface OrganizationPeopleGroupHeaderDestroyParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
  peopleGroupId: string
}

export type OrganizationPeopleGroupHeaderDestroyData = any

/** @format binary */
export type OrganizationPeopleGroupLogoCreatePayload = File

export interface OrganizationPeopleGroupLogoCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
  peopleGroupId: string
}

export type OrganizationPeopleGroupLogoCreateData = Image

export interface OrganizationPeopleGroupLogoUpdateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
  peopleGroupId: string
}

export type OrganizationPeopleGroupLogoUpdateData = Image

export interface OrganizationPeopleGroupLogoPartialUpdateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
  peopleGroupId: string
}

export type OrganizationPeopleGroupLogoPartialUpdateData = Image

export interface OrganizationPeopleGroupLogoDestroyParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
  peopleGroupId: string
}

export type OrganizationPeopleGroupLogoDestroyData = any

export interface OrganizationRecommendedProjectProjectRetrieveParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
  projectId: string
}

export type OrganizationRecommendedProjectProjectRetrieveData = ProjectLight

export interface OrganizationRecommendedProjectProjectRandomRetrieveParams {
  /**
   * The number of results to return.
   * @default 4
   */
  count?: number
  /**
   * The number of results among which to choose the final results.
   * @default 25
   */
  pool?: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
  projectId: string
}

export type OrganizationRecommendedProjectProjectRandomRetrieveData = ProjectLight

export interface OrganizationRecommendedProjectUserRetrieveParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationRecommendedProjectUserRetrieveData = ProjectLight

export interface OrganizationRecommendedProjectUserRandomRetrieveParams {
  /**
   * The number of results to return.
   * @default 4
   */
  count?: number
  /**
   * The number of results among which to choose the final results.
   * @default 25
   */
  pool?: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationRecommendedProjectUserRandomRetrieveData = ProjectLight

export interface OrganizationRecommendedUserProjectRetrieveParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
  projectId: string
}

export type OrganizationRecommendedUserProjectRetrieveData = UserLight

export interface OrganizationRecommendedUserProjectRandomRetrieveParams {
  /**
   * The number of results to return.
   * @default 4
   */
  count?: number
  /**
   * The number of results among which to choose the final results.
   * @default 25
   */
  pool?: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
  projectId: string
}

export type OrganizationRecommendedUserProjectRandomRetrieveData = UserLight

export interface OrganizationRecommendedUserUserRetrieveParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationRecommendedUserUserRetrieveData = UserLight

export interface OrganizationRecommendedUserUserRandomRetrieveParams {
  /**
   * The number of results to return.
   * @default 4
   */
  count?: number
  /**
   * The number of results among which to choose the final results.
   * @default 25
   */
  pool?: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationRecommendedUserUserRandomRetrieveData = UserLight

export interface OrganizationReportAbuseCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationReportAbuseCreateData = EmailReport

export interface OrganizationReportBugCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationReportBugCreateData = EmailReport

export interface OrganizationStatsListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** Filter project by the given publish status. */
  publication_status?: 'all' | 'org' | 'private' | 'public'
  /** A search term. */
  search?: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationStatsListData = PaginatedStatsList

export interface OrganizationTagListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** A search term. */
  search?: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTagListData = PaginatedTagList

export interface OrganizationTagCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTagCreateData = Tag

export interface OrganizationTagClassificationListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** A search term. */
  search?: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTagClassificationListData = PaginatedTagClassificationList

export interface OrganizationTagClassificationCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTagClassificationCreateData = TagClassification

export interface OrganizationTagClassificationRetrieveParams {
  /** A unique integer value identifying this tag classification. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTagClassificationRetrieveData = TagClassification

export interface OrganizationTagClassificationUpdateParams {
  /** A unique integer value identifying this tag classification. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTagClassificationUpdateData = TagClassification

export interface OrganizationTagClassificationPartialUpdateParams {
  /** A unique integer value identifying this tag classification. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTagClassificationPartialUpdateData = TagClassification

export interface OrganizationTagClassificationDestroyParams {
  /** A unique integer value identifying this tag classification. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTagClassificationDestroyData = any

export interface OrganizationTagClassificationAddTagsCreateParams {
  /** A unique integer value identifying this tag classification. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTagClassificationAddTagsCreateData = any

export interface OrganizationTagClassificationRemoveTagsCreateParams {
  /** A unique integer value identifying this tag classification. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTagClassificationRemoveTagsCreateData = any

export interface OrganizationTagClassificationTagListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** A search term. */
  search?: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
  /** @pattern ^[^/]+$ */
  tagClassificationId: string
}

export type OrganizationTagClassificationTagListData = PaginatedTagList

export interface OrganizationTagClassificationTagCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
  /** @pattern ^[^/]+$ */
  tagClassificationId: string
}

export type OrganizationTagClassificationTagCreateData = Tag

export interface OrganizationTagClassificationTagRetrieveParams {
  /** A unique integer value identifying this tag. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
  /** @pattern ^[^/]+$ */
  tagClassificationId: string
}

export type OrganizationTagClassificationTagRetrieveData = Tag

export interface OrganizationTagClassificationTagUpdateParams {
  /** A unique integer value identifying this tag. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
  /** @pattern ^[^/]+$ */
  tagClassificationId: string
}

export type OrganizationTagClassificationTagUpdateData = Tag

export interface OrganizationTagClassificationTagPartialUpdateParams {
  /** A unique integer value identifying this tag. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
  /** @pattern ^[^/]+$ */
  tagClassificationId: string
}

export type OrganizationTagClassificationTagPartialUpdateData = Tag

export interface OrganizationTagClassificationTagDestroyParams {
  /** A unique integer value identifying this tag. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
  /** @pattern ^[^/]+$ */
  tagClassificationId: string
}

export type OrganizationTagClassificationTagDestroyData = any

export interface OrganizationTagClassificationTagAutocompleteRetrieveParams {
  /** Choose the language you want for your results (en or fr), default to en. */
  language?: string
  /** Maximum number of results in response, default to 5. */
  limit?: number
  /** Search for a specific page name in the Wikipedia database. */
  search: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
  /** @pattern ^[^/]+$ */
  tagClassificationId: string
}

export type OrganizationTagClassificationTagAutocompleteRetrieveData = string[]

export interface OrganizationTagRetrieveParams {
  /** A unique integer value identifying this tag. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTagRetrieveData = Tag

export interface OrganizationTagUpdateParams {
  /** A unique integer value identifying this tag. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTagUpdateData = Tag

export interface OrganizationTagPartialUpdateParams {
  /** A unique integer value identifying this tag. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTagPartialUpdateData = Tag

export interface OrganizationTagDestroyParams {
  /** A unique integer value identifying this tag. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTagDestroyData = any

export interface OrganizationTagAutocompleteRetrieveParams {
  /** Choose the language you want for your results (en or fr), default to en. */
  language?: string
  /** Maximum number of results in response, default to 5. */
  limit?: number
  /** Search for a specific page name in the Wikipedia database. */
  search: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTagAutocompleteRetrieveData = string[]

export interface OrganizationTemplateListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** A search term. */
  search?: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTemplateListData = PaginatedTemplateList

export interface OrganizationTemplateCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTemplateCreateData = Template

export interface OrganizationTemplateRetrieveParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTemplateRetrieveData = Template

export interface OrganizationTemplateUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTemplateUpdateData = Template

export interface OrganizationTemplatePartialUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTemplatePartialUpdateData = Template

export interface OrganizationTemplateDestroyParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTemplateDestroyData = any

/** @format binary */
export type OrganizationTemplateImageCreatePayload = File

export interface OrganizationTemplateImageCreateParams {
  /** @pattern ^[^/]+$ */
  organizationCode: string
  /** @pattern ^[^/]+$ */
  templateId: string
}

export type OrganizationTemplateImageCreateData = Image

export interface OrganizationTemplateImageRetrieveParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
  /** @pattern ^[^/]+$ */
  templateId: string
}

export type OrganizationTemplateImageRetrieveData = Image

export interface OrganizationTemplateImageUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
  /** @pattern ^[^/]+$ */
  templateId: string
}

export type OrganizationTemplateImageUpdateData = Image

export interface OrganizationTemplateImagePartialUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
  /** @pattern ^[^/]+$ */
  templateId: string
}

export type OrganizationTemplateImagePartialUpdateData = Image

export interface OrganizationTemplateImageDestroyParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
  /** @pattern ^[^/]+$ */
  templateId: string
}

export type OrganizationTemplateImageDestroyData = any

export interface OrganizationTermsAndConditionsUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTermsAndConditionsUpdateData = TermsAndConditions

export interface OrganizationTermsAndConditionsPartialUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  organizationCode: string
}

export type OrganizationTermsAndConditionsPartialUpdateData = TermsAndConditions

export interface OrganizationUserMentorCandidateRetrieveParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
  /** @pattern ^[^/]+$ */
  userId: string
}

export type OrganizationUserMentorCandidateRetrieveData = UserLight

export interface OrganizationUserMentoreeCandidateRetrieveParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** @pattern ^[^/]+$ */
  organizationCode: string
  /** @pattern ^[^/]+$ */
  userId: string
}

export type OrganizationUserMentoreeCandidateRetrieveData = UserLight

export interface PrivacySettingsRetrieveParams {
  userId: number
}

export type PrivacySettingsRetrieveData = PrivacySettings

export interface PrivacySettingsUpdateParams {
  userId: number
}

export type PrivacySettingsUpdateData = PrivacySettings

export interface PrivacySettingsPartialUpdateParams {
  userId: number
}

export type PrivacySettingsPartialUpdateData = PrivacySettings

export interface ProjectListParams {
  /** Multiple values may be separated by commas. */
  categories?: string[]
  /** @format date-time */
  created_at?: string
  /** Multiple values may be separated by commas. */
  creation_year?: string[]
  /** Multiple values may be separated by commas. */
  group_members?: string[]
  /** Multiple values may be separated by commas. */
  group_role?: string[]
  /** Multiple values may be separated by commas. */
  ids?: string[]
  /** set this parameter to "summary" to get less details about the project */
  info_details?: string
  /** Multiple values may be separated by commas. */
  languages?: string[]
  /** Multiple values may be separated by commas. */
  life_status?: string[]
  /** Number of results to return per page. */
  limit?: number
  /** Multiple values may be separated by commas. */
  member_role?: string[]
  /** Multiple values may be separated by commas. */
  members?: string[]
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** Multiple values may be separated by commas. */
  organizations?: string[]
  /** Multiple values may be separated by commas. */
  sdgs?: string[]
  /** Multiple values may be separated by commas. */
  tags?: string[]
}

export type ProjectListData = PaginatedProjectLightList

export type ProjectCreateData = Project

export interface ProjectRetrieveParams {
  /** @pattern ^[^/]+$ */
  id: string
}

export type ProjectRetrieveData = Project

export interface ProjectUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
}

export type ProjectUpdateData = Project

export interface ProjectPartialUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
}

export type ProjectPartialUpdateData = Project

export interface ProjectDestroyParams {
  /** @pattern ^[^/]+$ */
  id: string
}

export type ProjectDestroyData = any

export interface ProjectDuplicateCreateParams {
  /** ID of the project to duplicate */
  id: string
}

export type ProjectDuplicateCreateData = Project

export interface ProjectLockCreateParams {
  /** @pattern ^[^/]+$ */
  id: string
}

export type ProjectLockCreateData = Project

export interface ProjectMemberAddCreateParams {
  /** @pattern ^[^/]+$ */
  id: string
}

export type ProjectMemberAddCreateData = Project

export interface ProjectMemberRemoveCreateParams {
  /** @pattern ^[^/]+$ */
  id: string
}

export type ProjectMemberRemoveCreateData = Project

export interface ProjectQuitDestroyParams {
  /** @pattern ^[^/]+$ */
  id: string
}

export type ProjectQuitDestroyData = any

export interface ProjectSimilarRetrieveParams {
  /** Comma-separated list of organization codes. */
  organizations?: string
  /**
   * Maximum number of results.
   * @default 5
   */
  threshold?: number
  /** @pattern ^[^/]+$ */
  id: string
}

export type ProjectSimilarRetrieveData = ProjectLight

export interface ProjectUnlockCreateParams {
  /** @pattern ^[^/]+$ */
  id: string
}

export type ProjectUnlockCreateData = Project

export interface ProjectAnnouncementListParams {
  /** @format date */
  from_date?: string
  /** @format date */
  from_date_or_none?: string
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** Multiple values may be separated by commas. */
  organizations?: string[]
  /** @format date */
  to_date?: string
  /** @format date */
  to_date_or_none?: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectAnnouncementListData = PaginatedAnnouncementList

export interface ProjectAnnouncementCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectAnnouncementCreateData = Announcement

export interface ProjectAnnouncementRetrieveParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectAnnouncementRetrieveData = Announcement

export interface ProjectAnnouncementUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectAnnouncementUpdateData = Announcement

export interface ProjectAnnouncementPartialUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectAnnouncementPartialUpdateData = Announcement

export interface ProjectAnnouncementDestroyParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectAnnouncementDestroyData = any

export interface ProjectAnnouncementApplyCreateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectAnnouncementApplyCreateData = Announcement

export interface ProjectBlogEntryListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectBlogEntryListData = PaginatedBlogEntryList

export interface ProjectBlogEntryCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectBlogEntryCreateData = BlogEntry

/** @format binary */
export type ProjectBlogEntryImageCreatePayload = File

export interface ProjectBlogEntryImageCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectBlogEntryImageCreateData = Image

export interface ProjectBlogEntryImageRetrieveParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectBlogEntryImageRetrieveData = Image

export interface ProjectBlogEntryImageUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectBlogEntryImageUpdateData = Image

export interface ProjectBlogEntryImagePartialUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectBlogEntryImagePartialUpdateData = Image

export interface ProjectBlogEntryImageDestroyParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectBlogEntryImageDestroyData = any

export interface ProjectBlogEntryRetrieveParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectBlogEntryRetrieveData = BlogEntry

export interface ProjectBlogEntryUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectBlogEntryUpdateData = BlogEntry

export interface ProjectBlogEntryPartialUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectBlogEntryPartialUpdateData = BlogEntry

export interface ProjectBlogEntryDestroyParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectBlogEntryDestroyData = any

export interface ProjectCommentListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectCommentListData = PaginatedCommentList

export interface ProjectCommentCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectCommentCreateData = Comment

export interface ProjectCommentImageCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectCommentImageCreateData = Image

export interface ProjectCommentImageRetrieveParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectCommentImageRetrieveData = Image

export interface ProjectCommentImageUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectCommentImageUpdateData = Image

export interface ProjectCommentImagePartialUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectCommentImagePartialUpdateData = Image

export interface ProjectCommentImageDestroyParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectCommentImageDestroyData = any

export interface ProjectCommentRetrieveParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectCommentRetrieveData = Comment

export interface ProjectCommentUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectCommentUpdateData = Comment

export interface ProjectCommentPartialUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectCommentPartialUpdateData = Comment

export interface ProjectCommentDestroyParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectCommentDestroyData = any

export interface ProjectFileListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectFileListData = PaginatedAttachmentFileList

export interface ProjectFileCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectFileCreateData = AttachmentFile

export interface ProjectFileRetrieveParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectFileRetrieveData = AttachmentFile

export interface ProjectFileUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectFileUpdateData = AttachmentFile

export interface ProjectFilePartialUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectFilePartialUpdateData = AttachmentFile

export interface ProjectFileDestroyParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectFileDestroyData = any

export interface ProjectFollowListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectFollowListData = PaginatedFollowList

export interface ProjectFollowCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectFollowCreateData = Follow

export interface ProjectFollowDestroyParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectFollowDestroyData = any

export interface ProjectGoalListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectGoalListData = PaginatedGoalList

export interface ProjectGoalCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectGoalCreateData = Goal

export interface ProjectGoalRetrieveParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectGoalRetrieveData = Goal

export interface ProjectGoalUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectGoalUpdateData = Goal

export interface ProjectGoalPartialUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectGoalPartialUpdateData = Goal

export interface ProjectGoalDestroyParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectGoalDestroyData = any

/** @format binary */
export type ProjectHeaderCreatePayload = File

export interface ProjectHeaderCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectHeaderCreateData = Image

export interface ProjectHeaderUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectHeaderUpdateData = Image

export interface ProjectHeaderPartialUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectHeaderPartialUpdateData = Image

export interface ProjectHeaderDestroyParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectHeaderDestroyData = any

export interface ProjectHistoryListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** A search term. */
  search?: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectHistoryListData = PaginatedProjectVersionListList

export interface ProjectHistoryRetrieveParams {
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectHistoryRetrieveData = ProjectVersion

/** @format binary */
export type ProjectImageCreatePayload = File

export interface ProjectImageCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectImageCreateData = Image

export interface ProjectImageRetrieveParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectImageRetrieveData = Image

export interface ProjectImageUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectImageUpdateData = Image

export interface ProjectImagePartialUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectImagePartialUpdateData = Image

export interface ProjectImageDestroyParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectImageDestroyData = any

export interface ProjectLinkListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** A search term. */
  search?: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLinkListData = PaginatedAttachmentLinkList

export interface ProjectLinkCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLinkCreateData = AttachmentLink

export interface ProjectLinkRetrieveParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLinkRetrieveData = AttachmentLink

export interface ProjectLinkUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLinkUpdateData = AttachmentLink

export interface ProjectLinkPartialUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLinkPartialUpdateData = AttachmentLink

export interface ProjectLinkDestroyParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLinkDestroyData = any

export interface ProjectLinkedProjectCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLinkedProjectCreateData = LinkedProject

export interface ProjectLinkedProjectPartialUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLinkedProjectPartialUpdateData = LinkedProject

export interface ProjectLinkedProjectDestroyParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLinkedProjectDestroyData = any

export interface ProjectLinkedProjectAddManyCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLinkedProjectAddManyCreateData = Project

export interface ProjectLinkedProjectDeleteManyDestroyParams {
  /** ID of the project you want to unlink projects from. */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLinkedProjectDeleteManyDestroyData = any

export interface ProjectLocationListParams {
  /** Which field to use when ordering the results. */
  ordering?: string
  /** A search term. */
  search?: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLocationListData = Location[]

export interface ProjectLocationCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLocationCreateData = Location

export interface ProjectLocationRetrieveParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLocationRetrieveData = Location

export interface ProjectLocationUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLocationUpdateData = Location

export interface ProjectLocationPartialUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLocationPartialUpdateData = Location

export interface ProjectLocationDestroyParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectLocationDestroyData = any

export interface ProjectProjectMessageListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** A search term. */
  search?: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectProjectMessageListData = PaginatedProjectMessageList

export interface ProjectProjectMessageCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectProjectMessageCreateData = ProjectMessage

/** @format binary */
export type ProjectProjectMessageImageCreatePayload = File

export interface ProjectProjectMessageImageCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectProjectMessageImageCreateData = Image

export interface ProjectProjectMessageImageRetrieveParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectProjectMessageImageRetrieveData = Image

export interface ProjectProjectMessageImageUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectProjectMessageImageUpdateData = Image

export interface ProjectProjectMessageImagePartialUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectProjectMessageImagePartialUpdateData = Image

export interface ProjectProjectMessageImageDestroyParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectProjectMessageImageDestroyData = any

export interface ProjectProjectMessageRetrieveParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectProjectMessageRetrieveData = ProjectMessage

export interface ProjectProjectMessageUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectProjectMessageUpdateData = ProjectMessage

export interface ProjectProjectMessagePartialUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectProjectMessagePartialUpdateData = ProjectMessage

export interface ProjectProjectMessageDestroyParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectProjectMessageDestroyData = any

export interface ProjectReviewListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  project?: string
  /** Multiple values may be separated by commas. */
  reviewer?: string[]
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectReviewListData = PaginatedReviewList

export interface ProjectReviewCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectReviewCreateData = Review

export interface ProjectReviewRetrieveParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectReviewRetrieveData = Review

export interface ProjectReviewUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectReviewUpdateData = Review

export interface ProjectReviewPartialUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectReviewPartialUpdateData = Review

export interface ProjectReviewDestroyParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectReviewDestroyData = any

export interface ProjectTabListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectTabListData = PaginatedProjectTabList

export interface ProjectTabCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectTabCreateData = ProjectTab

/** @format binary */
export type ProjectTabImageCreatePayload = File

export interface ProjectTabImageCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectTabImageCreateData = Image

export interface ProjectTabImageRetrieveParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectTabImageRetrieveData = Image

export interface ProjectTabImageUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectTabImageUpdateData = Image

export interface ProjectTabImagePartialUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectTabImagePartialUpdateData = Image

export interface ProjectTabImageDestroyParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectTabImageDestroyData = any

export interface ProjectTabRetrieveParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectTabRetrieveData = ProjectTab

export interface ProjectTabUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectTabUpdateData = ProjectTab

export interface ProjectTabPartialUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectTabPartialUpdateData = ProjectTab

export interface ProjectTabDestroyParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
}

export type ProjectTabDestroyData = any

export interface ProjectTabItemListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** @pattern ^[^/]+$ */
  projectId: string
  /** @pattern ^[^/]+$ */
  tabId: string
}

export type ProjectTabItemListData = PaginatedProjectTabItemList

export interface ProjectTabItemCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
  /** @pattern ^[^/]+$ */
  tabId: string
}

export type ProjectTabItemCreateData = ProjectTabItem

/** @format binary */
export type ProjectTabItemImageCreatePayload = File

export interface ProjectTabItemImageCreateParams {
  /** @pattern ^[^/]+$ */
  projectId: string
  /** @pattern ^[^/]+$ */
  tabId: string
}

export type ProjectTabItemImageCreateData = Image

export interface ProjectTabItemImageRetrieveParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
  /** @pattern ^[^/]+$ */
  tabId: string
}

export type ProjectTabItemImageRetrieveData = Image

export interface ProjectTabItemImageUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
  /** @pattern ^[^/]+$ */
  tabId: string
}

export type ProjectTabItemImageUpdateData = Image

export interface ProjectTabItemImagePartialUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
  /** @pattern ^[^/]+$ */
  tabId: string
}

export type ProjectTabItemImagePartialUpdateData = Image

export interface ProjectTabItemImageDestroyParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  projectId: string
  /** @pattern ^[^/]+$ */
  tabId: string
}

export type ProjectTabItemImageDestroyData = any

export interface ProjectTabItemRetrieveParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
  /** @pattern ^[^/]+$ */
  tabId: string
}

export type ProjectTabItemRetrieveData = ProjectTabItem

export interface ProjectTabItemUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
  /** @pattern ^[^/]+$ */
  tabId: string
}

export type ProjectTabItemUpdateData = ProjectTabItem

export interface ProjectTabItemPartialUpdateParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
  /** @pattern ^[^/]+$ */
  tabId: string
}

export type ProjectTabItemPartialUpdateData = ProjectTabItem

export interface ProjectTabItemDestroyParams {
  /** @pattern ^[^/]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  projectId: string
  /** @pattern ^[^/]+$ */
  tabId: string
}

export type ProjectTabItemDestroyData = any

export interface SearchListParams {
  can_mentor?: boolean
  /** Multiple values may be separated by commas. */
  can_mentor_on?: string[]
  /** Multiple values may be separated by commas. */
  categories?: string[]
  /** Multiple values may be separated by commas. */
  languages?: string[]
  /** Number of results to return per page. */
  limit?: number
  /** Multiple values may be separated by commas. */
  members?: string[]
  needs_mentor?: boolean
  /** Multiple values may be separated by commas. */
  needs_mentor_on?: string[]
  /** The initial index from which to return the results. */
  offset?: number
  /** Multiple values may be separated by commas. */
  organizations?: string[]
  /** Multiple values may be separated by commas. */
  sdgs?: string[]
  /** Multiple values may be separated by commas. */
  skills?: string[]
  /** Multiple values may be separated by commas. */
  tags?: string[]
  /** Multiple values may be separated by commas. */
  types?: string[]
}

export type SearchListData = PaginatedSearchObjectList

export interface SearchList2Params {
  can_mentor?: boolean
  /** Multiple values may be separated by commas. */
  can_mentor_on?: string[]
  /** Multiple values may be separated by commas. */
  categories?: string[]
  /** The level of tolerance for typos. Can be AUTO or a positive integer (default is 1). */
  fuzziness?: string
  /** Multiple values may be separated by commas. */
  languages?: string[]
  /** Number of results to return per page. */
  limit?: number
  /** Multiple values may be separated by commas. */
  members?: string[]
  needs_mentor?: boolean
  /** Multiple values may be separated by commas. */
  needs_mentor_on?: string[]
  /** The initial index from which to return the results. */
  offset?: number
  /** Multiple values may be separated by commas. */
  organizations?: string[]
  /** Multiple values may be separated by commas. */
  sdgs?: string[]
  /** The type of multi_match search to perform: most_fields (default) or best_fields. */
  search_type?: string
  /** Multiple values may be separated by commas. */
  skills?: string[]
  /** Multiple values may be separated by commas. */
  tags?: string[]
  /** Multiple values may be separated by commas. */
  types?: string[]
  /** @pattern ^.+$ */
  search: string
}

export type SearchList2Data = PaginatedSearchObjectList

export interface TagListParams {
  /** Multiple values may be separated by commas. */
  ids?: string[]
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** A search term. */
  search?: string
}

export type TagListData = PaginatedTagList

export interface TagRetrieveParams {
  /** A unique integer value identifying this tag. */
  id: number
}

export type TagRetrieveData = Tag

export interface UserListParams {
  can_mentor?: boolean
  /** Multiple values may be separated by commas. */
  can_mentor_on?: string[]
  /** Organization id used to fetch the role of the users in the organization */
  current_org_pk?: string
  /** Used to filter the users by role in the organization */
  current_org_role?: string
  /** Number of results to return per page. */
  limit?: number
  needs_mentor?: boolean
  /** Multiple values may be separated by commas. */
  needs_mentor_on?: string[]
  /** The initial index from which to return the results. */
  offset?: number
  /** Which field to use when ordering the results. */
  ordering?: string
  /** Multiple values may be separated by commas. */
  organizations?: string[]
  /** A search term. */
  search?: string
}

export type UserListData = PaginatedUserLightList

export type UserCreateData = User

export interface UserRetrieveParams {
  /** @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[a-zA-Z0-9-]{1,}$ */
  id: string
}

export type UserRetrieveData = User

export interface UserUpdateParams {
  /** @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[a-zA-Z0-9-]{1,}$ */
  id: string
}

export type UserUpdateData = User

export interface UserPartialUpdateParams {
  /** @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[a-zA-Z0-9-]{1,}$ */
  id: string
}

export type UserPartialUpdateData = User

export interface UserDestroyParams {
  /** @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[a-zA-Z0-9-]{1,}$ */
  id: string
}

export type UserDestroyData = any

export interface UserHasPermissionsRetrieveParams {
  /** Representations of the permissions to check, separated by a comma */
  permissions?: string
  /** @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[a-zA-Z0-9-]{1,}$ */
  id: string
}

export type UserHasPermissionsRetrieveData = Result

export interface UserRefreshKeycloakActionsLinkRetrieveParams {
  /** @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[a-zA-Z0-9-]{1,}$ */
  id: string
}

export type UserRefreshKeycloakActionsLinkRetrieveData = Record<string, any>

export interface UserResetPasswordRetrieveParams {
  /** @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[a-zA-Z0-9-]{1,}$ */
  id: string
}

export type UserResetPasswordRetrieveData = Record<string, any>

export interface UserFollowListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserFollowListData = PaginatedFollowList

export interface UserFollowCreateParams {
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserFollowCreateData = Follow

export interface UserFollowDestroyParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserFollowDestroyData = any

export interface UserFollowFollowManyCreateParams {
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserFollowFollowManyCreateData = Follow

/** @format binary */
export type UserProfilePictureCreatePayload = File

export interface UserProfilePictureCreateParams {
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserProfilePictureCreateData = Image

export interface UserProfilePictureUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserProfilePictureUpdateData = Image

export interface UserProfilePicturePartialUpdateParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserProfilePicturePartialUpdateData = Image

export interface UserProfilePictureDestroyParams {
  /** A unique integer value identifying this image. */
  id: number
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserProfilePictureDestroyData = any

export interface UserReviewListParams {
  /** Number of results to return per page. */
  limit?: number
  /** The initial index from which to return the results. */
  offset?: number
  project?: string
  /** Multiple values may be separated by commas. */
  reviewer?: string[]
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserReviewListData = PaginatedReviewList

export interface UserReviewCreateParams {
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserReviewCreateData = Review

export interface UserReviewRetrieveParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserReviewRetrieveData = Review

export interface UserReviewUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserReviewUpdateData = Review

export interface UserReviewPartialUpdateParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserReviewPartialUpdateData = Review

export interface UserReviewDestroyParams {
  /** @pattern ^[0-9]+$ */
  id: string
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserReviewDestroyData = any

export interface UserSkillCreateParams {
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserSkillCreateData = Skill

export interface UserSkillUpdateParams {
  /** A unique integer value identifying this skill. */
  id: number
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserSkillUpdateData = Skill

export interface UserSkillPartialUpdateParams {
  /** A unique integer value identifying this skill. */
  id: number
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserSkillPartialUpdateData = Skill

export interface UserSkillDestroyParams {
  /** A unique integer value identifying this skill. */
  id: number
  /** @pattern ^[^/]+$ */
  userId: string
}

export type UserSkillDestroyData = any

export interface UserAdminListRetrieveParams {
  /** Organization id used to fetch the role of the users in the organization */
  current_org_pk?: string
  /** Used to filter the users by role in the organization */
  current_org_role?: string
}

export type UserAdminListRetrieveData = UserAdminList

export type UserAnonymousRetrieveData = User

export interface UserGetByEmailRetrieveParams {
  /** Organization id used to fetch the role of the users in the organization */
  current_org_pk?: string
  /** @pattern ^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$ */
  email: string
}

export type UserGetByEmailRetrieveData = User

export type UserRemoveAuthenticationCookieRetrieveData = EmptyPayloadResponse

export type UserResetPasswordCreateData = Record<string, any>

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat
  /** request body */
  body?: unknown
  /** base url */
  baseUrl?: string
  /** request cancellation token */
  cancelToken?: CancelToken
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<RequestParams | void> | RequestParams | void
  customFetch?: typeof fetch
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D
  error: E
}

type CancelToken = Symbol | string | number

export enum ContentType {
  Json = 'application/json',
  JsonApi = 'application/vnd.api+json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = ''
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private abortControllers = new Map<CancelToken, AbortController>()
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams)

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  }

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig)
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key)
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key])
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key]
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&')
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {}
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key])
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
      )
      .join('&')
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery)
    return queryString ? `?${queryString}` : ''
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string' ? JSON.stringify(input) : input,
    [ContentType.FormData]: (input: any) => {
      if (input instanceof FormData) {
        return input
      }

      return Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key]
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`
        )
        return formData
      }, new FormData())
    },
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  }

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken)
      if (abortController) {
        return abortController.signal
      }
      return void 0
    }

    const abortController = new AbortController()
    this.abortControllers.set(cancelToken, abortController)
    return abortController.signal
  }

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken)

    if (abortController) {
      abortController.abort()
      this.abortControllers.delete(cancelToken)
    }
  }

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const queryString = query && this.toQueryString(query)
    const payloadFormatter = this.contentFormatters[type || ContentType.Json]
    const responseFormat = format || requestParams.format

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
        },
        signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
        body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body),
      }
    ).then(async (response) => {
      const r = response as HttpResponse<T, E>
      r.data = null as unknown as T
      r.error = null as unknown as E

      const responseToParse = responseFormat ? response.clone() : response
      const data = !responseFormat
        ? r
        : await responseToParse[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data
              } else {
                r.error = data
              }
              return r
            })
            .catch((e) => {
              r.error = e
              return r
            })

      if (cancelToken) {
        this.abortControllers.delete(cancelToken)
      }

      return data
    })
  }
}

/**
 * @title Learning Planet Institute Projects API
 * @version 2.0.1
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
 * @description OpenApi3 schema for this API. Format can be selected via content negotiation. - YAML: application/vnd.oai.openapi - JSON: application/vnd.oai.openapi+json
 *
 * @tags api
 * @name ApiSchemaRetrieve
 * @summary OpenApi3 schema for this API. Format can be selected via content negotiation.

- YAML: application/vnd.oai.openapi
- JSON: application/vnd.oai.opena...
 * @request GET:/api/schema/
 * @secure
 */
    apiSchemaRetrieve: (query: ApiSchemaRetrieveParams, params: RequestParams = {}) =>
      this.request<ApiSchemaRetrieveData, any>({
        path: `/api/schema/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),
  }
  v1 = {
    /**
     * No description
     *
     * @tags access-token
     * @name AccessTokenCreate
     * @request POST:/v1/access-token/
     * @secure
     */
    accessTokenCreate: (data: CredentialsRequest, params: RequestParams = {}) =>
      this.request<AccessTokenCreateData, any>({
        path: `/v1/access-token/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags announcement
     * @name AnnouncementList
     * @request GET:/v1/announcement/
     * @secure
     */
    announcementList: (query: AnnouncementListParams, params: RequestParams = {}) =>
      this.request<AnnouncementListData, any>({
        path: `/v1/announcement/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags announcement
     * @name AnnouncementRetrieve
     * @request GET:/v1/announcement/{id}/
     * @secure
     */
    announcementRetrieve: (
      { id, ...query }: AnnouncementRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<AnnouncementRetrieveData, any>({
        path: `/v1/announcement/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags email
     * @name EmailList
     * @request GET:/v1/email/
     * @secure
     */
    emailList: (query: EmailListParams, params: RequestParams = {}) =>
      this.request<EmailListData, any>({
        path: `/v1/email/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags email
     * @name EmailCreate
     * @request POST:/v1/email/
     * @secure
     */
    emailCreate: (data: EmailRequest, params: RequestParams = {}) =>
      this.request<EmailCreateData, any>({
        path: `/v1/email/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags email
     * @name EmailImageCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/email/{emailId}/image/
     * @secure
     */
    emailImageCreate: (
      { emailId, ...query }: EmailImageCreateParams,
      data: EmailImageCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<EmailImageCreateData, any>({
        path: `/v1/email/${emailId}/image/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags email
     * @name EmailImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/email/{emailId}/image/{id}/
     * @secure
     */
    emailImageRetrieve: (
      { emailId, id, ...query }: EmailImageRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<EmailImageRetrieveData, any>({
        path: `/v1/email/${emailId}/image/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags email
     * @name EmailImageUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/email/{emailId}/image/{id}/
     * @secure
     */
    emailImageUpdate: (
      { emailId, id, ...query }: EmailImageUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<EmailImageUpdateData, any>({
        path: `/v1/email/${emailId}/image/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags email
     * @name EmailImagePartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/email/{emailId}/image/{id}/
     * @secure
     */
    emailImagePartialUpdate: (
      { emailId, id, ...query }: EmailImagePartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<EmailImagePartialUpdateData, any>({
        path: `/v1/email/${emailId}/image/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags email
     * @name EmailImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/email/{emailId}/image/{id}/
     * @secure
     */
    emailImageDestroy: (
      { emailId, id, ...query }: EmailImageDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<EmailImageDestroyData, any>({
        path: `/v1/email/${emailId}/image/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags email
     * @name EmailRetrieve
     * @request GET:/v1/email/{id}/
     * @secure
     */
    emailRetrieve: ({ id, ...query }: EmailRetrieveParams, params: RequestParams = {}) =>
      this.request<EmailRetrieveData, any>({
        path: `/v1/email/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags email
     * @name EmailUpdate
     * @request PUT:/v1/email/{id}/
     * @secure
     */
    emailUpdate: (
      { id, ...query }: EmailUpdateParams,
      data: EmailRequest,
      params: RequestParams = {}
    ) =>
      this.request<EmailUpdateData, any>({
        path: `/v1/email/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags email
     * @name EmailPartialUpdate
     * @request PATCH:/v1/email/{id}/
     * @secure
     */
    emailPartialUpdate: (
      { id, ...query }: EmailPartialUpdateParams,
      data: PatchedEmailRequest,
      params: RequestParams = {}
    ) =>
      this.request<EmailPartialUpdateData, any>({
        path: `/v1/email/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags email
     * @name EmailDestroy
     * @request DELETE:/v1/email/{id}/
     * @secure
     */
    emailDestroy: ({ id, ...query }: EmailDestroyParams, params: RequestParams = {}) =>
      this.request<EmailDestroyData, any>({
        path: `/v1/email/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags google
     * @name GoogleGroupEmailAvailableCreate
     * @request POST:/v1/google/group-email-available/
     * @secure
     */
    googleGroupEmailAvailableCreate: (data: EmailAddressRequest, params: RequestParams = {}) =>
      this.request<GoogleGroupEmailAvailableCreateData, any>({
        path: `/v1/google/group-email-available/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags google
     * @name GoogleOrgUnitsRetrieve
     * @request GET:/v1/google/org-units/
     * @secure
     */
    googleOrgUnitsRetrieve: (params: RequestParams = {}) =>
      this.request<GoogleOrgUnitsRetrieveData, any>({
        path: `/v1/google/org-units/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags google
     * @name GoogleUserEmailAvailableCreate
     * @request POST:/v1/google/user-email-available/
     * @secure
     */
    googleUserEmailAvailableCreate: (data: EmailAddressRequest, params: RequestParams = {}) =>
      this.request<GoogleUserEmailAvailableCreateData, any>({
        path: `/v1/google/user-email-available/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags languages
     * @name LanguagesRetrieve
     * @request GET:/v1/languages/
     * @secure
     */
    languagesRetrieve: (params: RequestParams = {}) =>
      this.request<LanguagesRetrieveData, any>({
        path: `/v1/languages/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags location
     * @name LocationList
     * @request GET:/v1/location/
     * @secure
     */
    locationList: (query: LocationListParams, params: RequestParams = {}) =>
      this.request<LocationListData, any>({
        path: `/v1/location/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags location
     * @name LocationRetrieve
     * @request GET:/v1/location/{id}/
     * @secure
     */
    locationRetrieve: ({ id, ...query }: LocationRetrieveParams, params: RequestParams = {}) =>
      this.request<LocationRetrieveData, any>({
        path: `/v1/location/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows getting or modifying a user's notification.
     *
     * @tags notification
     * @name NotificationList
     * @summary Allows getting or modifying a user's notification.
     * @request GET:/v1/notification/
     * @secure
     */
    notificationList: (query: NotificationListParams, params: RequestParams = {}) =>
      this.request<NotificationListData, any>({
        path: `/v1/notification/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows getting or modifying a user's notification settings.
     *
     * @tags notifications-setting
     * @name NotificationsSettingRetrieve
     * @summary Allows getting or modifying a user's notification settings.
     * @request GET:/v1/notifications-setting/{userId}/
     * @secure
     */
    notificationsSettingRetrieve: (
      { userId, ...query }: NotificationsSettingRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<NotificationsSettingRetrieveData, any>({
        path: `/v1/notifications-setting/${userId}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows getting or modifying a user's notification settings.
     *
     * @tags notifications-setting
     * @name NotificationsSettingUpdate
     * @summary Allows getting or modifying a user's notification settings.
     * @request PUT:/v1/notifications-setting/{userId}/
     * @secure
     */
    notificationsSettingUpdate: (
      { userId, ...query }: NotificationsSettingUpdateParams,
      data: NotificationSettingsRequest,
      params: RequestParams = {}
    ) =>
      this.request<NotificationsSettingUpdateData, any>({
        path: `/v1/notifications-setting/${userId}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows getting or modifying a user's notification settings.
     *
     * @tags notifications-setting
     * @name NotificationsSettingPartialUpdate
     * @summary Allows getting or modifying a user's notification settings.
     * @request PATCH:/v1/notifications-setting/{userId}/
     * @secure
     */
    notificationsSettingPartialUpdate: (
      { userId, ...query }: NotificationsSettingPartialUpdateParams,
      data: PatchedNotificationSettingsRequest,
      params: RequestParams = {}
    ) =>
      this.request<NotificationsSettingPartialUpdateData, any>({
        path: `/v1/notifications-setting/${userId}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationList
     * @request GET:/v1/organization/
     * @secure
     */
    organizationList: (query: OrganizationListParams, params: RequestParams = {}) =>
      this.request<OrganizationListData, any>({
        path: `/v1/organization/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationCreate
     * @request POST:/v1/organization/
     * @secure
     */
    organizationCreate: (data: OrganizationRequest, params: RequestParams = {}) =>
      this.request<OrganizationCreateData, any>({
        path: `/v1/organization/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationRetrieve
     * @request GET:/v1/organization/{code}/
     * @secure
     */
    organizationRetrieve: (
      { code, ...query }: OrganizationRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationRetrieveData, any>({
        path: `/v1/organization/${code}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationUpdate
     * @request PUT:/v1/organization/{code}/
     * @secure
     */
    organizationUpdate: (
      { code, ...query }: OrganizationUpdateParams,
      data: OrganizationRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationUpdateData, any>({
        path: `/v1/organization/${code}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationPartialUpdate
     * @request PATCH:/v1/organization/{code}/
     * @secure
     */
    organizationPartialUpdate: (
      { code, ...query }: OrganizationPartialUpdateParams,
      data: PatchedOrganizationRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPartialUpdateData, any>({
        path: `/v1/organization/${code}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationDestroy
     * @request DELETE:/v1/organization/{code}/
     * @secure
     */
    organizationDestroy: (
      { code, ...query }: OrganizationDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationDestroyData, any>({
        path: `/v1/organization/${code}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Get the people groups hierarchy of the organization.
     *
     * @tags organization
     * @name OrganizationCategoriesHierarchyRetrieve
     * @summary Get the people groups hierarchy of the organization.
     * @request GET:/v1/organization/{code}/categories-hierarchy/
     * @secure
     */
    organizationCategoriesHierarchyRetrieve: (
      { code, ...query }: OrganizationCategoriesHierarchyRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationCategoriesHierarchyRetrieveData, any>({
        path: `/v1/organization/${code}/categories-hierarchy/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationFeaturedProjectRetrieve
     * @request GET:/v1/organization/{code}/featured-project/
     * @secure
     */
    organizationFeaturedProjectRetrieve: (
      { code, ...query }: OrganizationFeaturedProjectRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationFeaturedProjectRetrieveData, any>({
        path: `/v1/organization/${code}/featured-project/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationFeaturedProjectAddCreate
     * @request POST:/v1/organization/{code}/featured-project/add/
     * @secure
     */
    organizationFeaturedProjectAddCreate: (
      { code, ...query }: OrganizationFeaturedProjectAddCreateParams,
      data: OrganizationAddFeaturedProjectsRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationFeaturedProjectAddCreateData, any>({
        path: `/v1/organization/${code}/featured-project/add/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationFeaturedProjectRemoveCreate
     * @request POST:/v1/organization/{code}/featured-project/remove/
     * @secure
     */
    organizationFeaturedProjectRemoveCreate: (
      { code, ...query }: OrganizationFeaturedProjectRemoveCreateParams,
      data: OrganizationRemoveFeaturedProjectsRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationFeaturedProjectRemoveCreateData, any>({
        path: `/v1/organization/${code}/featured-project/remove/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Add users to the organization's group of the given name.
     *
     * @tags organization
     * @name OrganizationMemberAddCreate
     * @summary Add users to the organization's group of the given name.
     * @request POST:/v1/organization/{code}/member/add/
     * @secure
     */
    organizationMemberAddCreate: (
      { code, ...query }: OrganizationMemberAddCreateParams,
      data: OrganizationAddTeamMembersRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationMemberAddCreateData, any>({
        path: `/v1/organization/${code}/member/add/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Remove users from the organization's group of the given name.
     *
     * @tags organization
     * @name OrganizationMemberRemoveCreate
     * @summary Remove users from the organization's group of the given name.
     * @request POST:/v1/organization/{code}/member/remove/
     * @secure
     */
    organizationMemberRemoveCreate: (
      { code, ...query }: OrganizationMemberRemoveCreateParams,
      data: OrganizationRemoveTeamMembersRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationMemberRemoveCreateData, any>({
        path: `/v1/organization/${code}/member/remove/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get the people groups hierarchy of the organization.
     *
     * @tags organization
     * @name OrganizationPeopleGroupsHierarchyRetrieve
     * @summary Get the people groups hierarchy of the organization.
     * @request GET:/v1/organization/{code}/people-groups-hierarchy/
     * @secure
     */
    organizationPeopleGroupsHierarchyRetrieve: (
      { code, ...query }: OrganizationPeopleGroupsHierarchyRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupsHierarchyRetrieveData, any>({
        path: `/v1/organization/${code}/people-groups-hierarchy/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `list` and `create` actions. To use it, override the class and set the `.queryset` and `.serializer_class` attributes.
 *
 * @tags organization
 * @name OrganizationAccessRequestList
 * @summary A viewset that provides `list` and `create` actions.

To use it, override the class and set the `.queryset` and
`.serializer_class` attributes.
 * @request GET:/v1/organization/{organizationCode}/access-request/
 * @secure
 */
    organizationAccessRequestList: (
      { organizationCode, ...query }: OrganizationAccessRequestListParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationAccessRequestListData, any>({
        path: `/v1/organization/${organizationCode}/access-request/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `list` and `create` actions. To use it, override the class and set the `.queryset` and `.serializer_class` attributes.
 *
 * @tags organization
 * @name OrganizationAccessRequestCreate
 * @summary A viewset that provides `list` and `create` actions.

To use it, override the class and set the `.queryset` and
`.serializer_class` attributes.
 * @request POST:/v1/organization/{organizationCode}/access-request/
 * @secure
 */
    organizationAccessRequestCreate: (
      { organizationCode, ...query }: OrganizationAccessRequestCreateParams,
      data: AccessRequestRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationAccessRequestCreateData, any>({
        path: `/v1/organization/${organizationCode}/access-request/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `list` and `create` actions. To use it, override the class and set the `.queryset` and `.serializer_class` attributes.
 *
 * @tags organization
 * @name OrganizationAccessRequestAcceptCreate
 * @summary A viewset that provides `list` and `create` actions.

To use it, override the class and set the `.queryset` and
`.serializer_class` attributes.
 * @request POST:/v1/organization/{organizationCode}/access-request/accept/
 * @secure
 */
    organizationAccessRequestAcceptCreate: (
      { organizationCode, ...query }: OrganizationAccessRequestAcceptCreateParams,
      data: AccessRequestManyRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationAccessRequestAcceptCreateData, any>({
        path: `/v1/organization/${organizationCode}/access-request/accept/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `list` and `create` actions. To use it, override the class and set the `.queryset` and `.serializer_class` attributes.
 *
 * @tags organization
 * @name OrganizationAccessRequestDeclineCreate
 * @summary A viewset that provides `list` and `create` actions.

To use it, override the class and set the `.queryset` and
`.serializer_class` attributes.
 * @request POST:/v1/organization/{organizationCode}/access-request/decline/
 * @secure
 */
    organizationAccessRequestDeclineCreate: (
      { organizationCode, ...query }: OrganizationAccessRequestDeclineCreateParams,
      data: AccessRequestManyRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationAccessRequestDeclineCreateData, any>({
        path: `/v1/organization/${organizationCode}/access-request/decline/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationBannerCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/organization/{organizationCode}/banner/
     * @secure
     */
    organizationBannerCreate: (
      { organizationCode, ...query }: OrganizationBannerCreateParams,
      data: OrganizationBannerCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationBannerCreateData, any>({
        path: `/v1/organization/${organizationCode}/banner/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationBannerUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/organization/{organizationCode}/banner/{id}/
     * @secure
     */
    organizationBannerUpdate: (
      { id, organizationCode, ...query }: OrganizationBannerUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationBannerUpdateData, any>({
        path: `/v1/organization/${organizationCode}/banner/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationBannerPartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/organization/{organizationCode}/banner/{id}/
     * @secure
     */
    organizationBannerPartialUpdate: (
      { id, organizationCode, ...query }: OrganizationBannerPartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationBannerPartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/banner/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationBannerDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/banner/{id}/
     * @secure
     */
    organizationBannerDestroy: (
      { id, organizationCode, ...query }: OrganizationBannerDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationBannerDestroyData, any>({
        path: `/v1/organization/${organizationCode}/banner/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationCategoryList
     * @request GET:/v1/organization/{organizationCode}/category/
     * @secure
     */
    organizationCategoryList: (
      { organizationCode, ...query }: OrganizationCategoryListParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationCategoryListData, any>({
        path: `/v1/organization/${organizationCode}/category/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationCategoryCreate
     * @request POST:/v1/organization/{organizationCode}/category/
     * @secure
     */
    organizationCategoryCreate: (
      { organizationCode, ...query }: OrganizationCategoryCreateParams,
      data: ProjectCategoryRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationCategoryCreateData, any>({
        path: `/v1/organization/${organizationCode}/category/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationCategoryBackgroundCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/organization/{organizationCode}/category/{categoryId}/background/
     * @secure
     */
    organizationCategoryBackgroundCreate: (
      { categoryId, organizationCode, ...query }: OrganizationCategoryBackgroundCreateParams,
      data: OrganizationCategoryBackgroundCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationCategoryBackgroundCreateData, any>({
        path: `/v1/organization/${organizationCode}/category/${categoryId}/background/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationCategoryBackgroundUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/organization/{organizationCode}/category/{categoryId}/background/{id}/
     * @secure
     */
    organizationCategoryBackgroundUpdate: (
      { categoryId, id, organizationCode, ...query }: OrganizationCategoryBackgroundUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationCategoryBackgroundUpdateData, any>({
        path: `/v1/organization/${organizationCode}/category/${categoryId}/background/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationCategoryBackgroundPartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/organization/{organizationCode}/category/{categoryId}/background/{id}/
     * @secure
     */
    organizationCategoryBackgroundPartialUpdate: (
      {
        categoryId,
        id,
        organizationCode,
        ...query
      }: OrganizationCategoryBackgroundPartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationCategoryBackgroundPartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/category/${categoryId}/background/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationCategoryBackgroundDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/category/{categoryId}/background/{id}/
     * @secure
     */
    organizationCategoryBackgroundDestroy: (
      { categoryId, id, organizationCode, ...query }: OrganizationCategoryBackgroundDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationCategoryBackgroundDestroyData, any>({
        path: `/v1/organization/${organizationCode}/category/${categoryId}/background/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationCategoryRetrieve
     * @request GET:/v1/organization/{organizationCode}/category/{id}/
     * @secure
     */
    organizationCategoryRetrieve: (
      { id, organizationCode, ...query }: OrganizationCategoryRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationCategoryRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/category/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationCategoryUpdate
     * @request PUT:/v1/organization/{organizationCode}/category/{id}/
     * @secure
     */
    organizationCategoryUpdate: (
      { id, organizationCode, ...query }: OrganizationCategoryUpdateParams,
      data: ProjectCategoryRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationCategoryUpdateData, any>({
        path: `/v1/organization/${organizationCode}/category/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationCategoryPartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/category/{id}/
     * @secure
     */
    organizationCategoryPartialUpdate: (
      { id, organizationCode, ...query }: OrganizationCategoryPartialUpdateParams,
      data: PatchedProjectCategoryRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationCategoryPartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/category/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationCategoryDestroy
     * @request DELETE:/v1/organization/{organizationCode}/category/{id}/
     * @secure
     */
    organizationCategoryDestroy: (
      { id, organizationCode, ...query }: OrganizationCategoryDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationCategoryDestroyData, any>({
        path: `/v1/organization/${organizationCode}/category/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationCategoryHierarchyRetrieve
     * @request GET:/v1/organization/{organizationCode}/category/{id}/hierarchy/
     * @secure
     */
    organizationCategoryHierarchyRetrieve: (
      { id, organizationCode, ...query }: OrganizationCategoryHierarchyRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationCategoryHierarchyRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/category/${id}/hierarchy/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationCategoryProjectsLifeStatusCreate
     * @request POST:/v1/organization/{organizationCode}/category/{id}/projects-life-status/
     * @secure
     */
    organizationCategoryProjectsLifeStatusCreate: (
      { id, organizationCode, ...query }: OrganizationCategoryProjectsLifeStatusCreateParams,
      data: OrganizationCategoryProjectsLifeStatusCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationCategoryProjectsLifeStatusCreateData, any>({
        path: `/v1/organization/${organizationCode}/category/${id}/projects-life-status/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationCategoryProjectsLockedStatusCreate
     * @request POST:/v1/organization/{organizationCode}/category/{id}/projects-locked-status/
     * @secure
     */
    organizationCategoryProjectsLockedStatusCreate: (
      { id, organizationCode, ...query }: OrganizationCategoryProjectsLockedStatusCreateParams,
      data: OrganizationCategoryProjectsLockedStatusCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationCategoryProjectsLockedStatusCreateData, any>({
        path: `/v1/organization/${organizationCode}/category/${id}/projects-locked-status/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allow to send an abuse report email.
     *
     * @tags organization
     * @name OrganizationContactUsCreate
     * @summary Allow to send an abuse report email.
     * @request POST:/v1/organization/{organizationCode}/contact/us/
     * @secure
     */
    organizationContactUsCreate: (
      { organizationCode, ...query }: OrganizationContactUsCreateParams,
      data: ContactRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationContactUsCreateData, any>({
        path: `/v1/organization/${organizationCode}/contact/us/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Main endpoints for projects.
     *
     * @tags organization
     * @name OrganizationEventList
     * @summary Main endpoints for projects.
     * @request GET:/v1/organization/{organizationCode}/event/
     * @secure
     */
    organizationEventList: (
      { organizationCode, ...query }: OrganizationEventListParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationEventListData, any>({
        path: `/v1/organization/${organizationCode}/event/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Main endpoints for projects.
     *
     * @tags organization
     * @name OrganizationEventCreate
     * @summary Main endpoints for projects.
     * @request POST:/v1/organization/{organizationCode}/event/
     * @secure
     */
    organizationEventCreate: (
      { organizationCode, ...query }: OrganizationEventCreateParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationEventCreateData, any>({
        path: `/v1/organization/${organizationCode}/event/`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationEventImageCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/organization/{organizationCode}/event/{eventId}/image/
     * @secure
     */
    organizationEventImageCreate: (
      { eventId, organizationCode, ...query }: OrganizationEventImageCreateParams,
      data: OrganizationEventImageCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationEventImageCreateData, any>({
        path: `/v1/organization/${organizationCode}/event/${eventId}/image/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationEventImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/organization/{organizationCode}/event/{eventId}/image/{id}/
     * @secure
     */
    organizationEventImageRetrieve: (
      { eventId, id, organizationCode, ...query }: OrganizationEventImageRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationEventImageRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/event/${eventId}/image/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationEventImageUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/organization/{organizationCode}/event/{eventId}/image/{id}/
     * @secure
     */
    organizationEventImageUpdate: (
      { eventId, id, organizationCode, ...query }: OrganizationEventImageUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationEventImageUpdateData, any>({
        path: `/v1/organization/${organizationCode}/event/${eventId}/image/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationEventImagePartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/organization/{organizationCode}/event/{eventId}/image/{id}/
     * @secure
     */
    organizationEventImagePartialUpdate: (
      { eventId, id, organizationCode, ...query }: OrganizationEventImagePartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationEventImagePartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/event/${eventId}/image/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationEventImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/event/{eventId}/image/{id}/
     * @secure
     */
    organizationEventImageDestroy: (
      { eventId, id, organizationCode, ...query }: OrganizationEventImageDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationEventImageDestroyData, any>({
        path: `/v1/organization/${organizationCode}/event/${eventId}/image/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Main endpoints for projects.
     *
     * @tags organization
     * @name OrganizationEventRetrieve
     * @summary Main endpoints for projects.
     * @request GET:/v1/organization/{organizationCode}/event/{id}/
     * @secure
     */
    organizationEventRetrieve: (
      { id, organizationCode, ...query }: OrganizationEventRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationEventRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/event/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Main endpoints for projects.
     *
     * @tags organization
     * @name OrganizationEventUpdate
     * @summary Main endpoints for projects.
     * @request PUT:/v1/organization/{organizationCode}/event/{id}/
     * @secure
     */
    organizationEventUpdate: (
      { id, organizationCode, ...query }: OrganizationEventUpdateParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationEventUpdateData, any>({
        path: `/v1/organization/${organizationCode}/event/${id}/`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * @description Main endpoints for projects.
     *
     * @tags organization
     * @name OrganizationEventPartialUpdate
     * @summary Main endpoints for projects.
     * @request PATCH:/v1/organization/{organizationCode}/event/{id}/
     * @secure
     */
    organizationEventPartialUpdate: (
      { id, organizationCode, ...query }: OrganizationEventPartialUpdateParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationEventPartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/event/${id}/`,
        method: 'PATCH',
        secure: true,
        ...params,
      }),

    /**
     * @description Main endpoints for projects.
     *
     * @tags organization
     * @name OrganizationEventDestroy
     * @summary Main endpoints for projects.
     * @request DELETE:/v1/organization/{organizationCode}/event/{id}/
     * @secure
     */
    organizationEventDestroy: (
      { id, organizationCode, ...query }: OrganizationEventDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationEventDestroyData, any>({
        path: `/v1/organization/${organizationCode}/event/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationFileList
     * @request GET:/v1/organization/{organizationCode}/file/
     * @secure
     */
    organizationFileList: (
      { organizationCode, ...query }: OrganizationFileListParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationFileListData, any>({
        path: `/v1/organization/${organizationCode}/file/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationFileCreate
     * @request POST:/v1/organization/{organizationCode}/file/
     * @secure
     */
    organizationFileCreate: (
      { organizationCode, ...query }: OrganizationFileCreateParams,
      data: OrganizationAttachmentFileRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationFileCreateData, any>({
        path: `/v1/organization/${organizationCode}/file/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationFileRetrieve
     * @request GET:/v1/organization/{organizationCode}/file/{id}/
     * @secure
     */
    organizationFileRetrieve: (
      { id, organizationCode, ...query }: OrganizationFileRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationFileRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/file/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationFileUpdate
     * @request PUT:/v1/organization/{organizationCode}/file/{id}/
     * @secure
     */
    organizationFileUpdate: (
      { id, organizationCode, ...query }: OrganizationFileUpdateParams,
      data: OrganizationAttachmentFileRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationFileUpdateData, any>({
        path: `/v1/organization/${organizationCode}/file/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationFilePartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/file/{id}/
     * @secure
     */
    organizationFilePartialUpdate: (
      { id, organizationCode, ...query }: OrganizationFilePartialUpdateParams,
      data: PatchedOrganizationAttachmentFileRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationFilePartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/file/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationFileDestroy
     * @request DELETE:/v1/organization/{organizationCode}/file/{id}/
     * @secure
     */
    organizationFileDestroy: (
      { id, organizationCode, ...query }: OrganizationFileDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationFileDestroyData, any>({
        path: `/v1/organization/${organizationCode}/file/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationImageCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/organization/{organizationCode}/image/
     * @secure
     */
    organizationImageCreate: (
      { organizationCode, ...query }: OrganizationImageCreateParams,
      data: OrganizationImageCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationImageCreateData, any>({
        path: `/v1/organization/${organizationCode}/image/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/organization/{organizationCode}/image/{id}/
     * @secure
     */
    organizationImageRetrieve: (
      { id, organizationCode, ...query }: OrganizationImageRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationImageRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/image/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationImageUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/organization/{organizationCode}/image/{id}/
     * @secure
     */
    organizationImageUpdate: (
      { id, organizationCode, ...query }: OrganizationImageUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationImageUpdateData, any>({
        path: `/v1/organization/${organizationCode}/image/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationImagePartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/organization/{organizationCode}/image/{id}/
     * @secure
     */
    organizationImagePartialUpdate: (
      { id, organizationCode, ...query }: OrganizationImagePartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationImagePartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/image/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/image/{id}/
     * @secure
     */
    organizationImageDestroy: (
      { id, organizationCode, ...query }: OrganizationImageDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationImageDestroyData, any>({
        path: `/v1/organization/${organizationCode}/image/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Main endpoints for instructions.
     *
     * @tags organization
     * @name OrganizationInstructionList
     * @summary Main endpoints for instructions.
     * @request GET:/v1/organization/{organizationCode}/instruction/
     * @secure
     */
    organizationInstructionList: (
      { organizationCode, ...query }: OrganizationInstructionListParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInstructionListData, any>({
        path: `/v1/organization/${organizationCode}/instruction/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Main endpoints for instructions.
     *
     * @tags organization
     * @name OrganizationInstructionCreate
     * @summary Main endpoints for instructions.
     * @request POST:/v1/organization/{organizationCode}/instruction/
     * @secure
     */
    organizationInstructionCreate: (
      { organizationCode, ...query }: OrganizationInstructionCreateParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInstructionCreateData, any>({
        path: `/v1/organization/${organizationCode}/instruction/`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description Main endpoints for instructions.
     *
     * @tags organization
     * @name OrganizationInstructionRetrieve
     * @summary Main endpoints for instructions.
     * @request GET:/v1/organization/{organizationCode}/instruction/{id}/
     * @secure
     */
    organizationInstructionRetrieve: (
      { id, organizationCode, ...query }: OrganizationInstructionRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInstructionRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/instruction/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Main endpoints for instructions.
     *
     * @tags organization
     * @name OrganizationInstructionUpdate
     * @summary Main endpoints for instructions.
     * @request PUT:/v1/organization/{organizationCode}/instruction/{id}/
     * @secure
     */
    organizationInstructionUpdate: (
      { id, organizationCode, ...query }: OrganizationInstructionUpdateParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInstructionUpdateData, any>({
        path: `/v1/organization/${organizationCode}/instruction/${id}/`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * @description Main endpoints for instructions.
     *
     * @tags organization
     * @name OrganizationInstructionPartialUpdate
     * @summary Main endpoints for instructions.
     * @request PATCH:/v1/organization/{organizationCode}/instruction/{id}/
     * @secure
     */
    organizationInstructionPartialUpdate: (
      { id, organizationCode, ...query }: OrganizationInstructionPartialUpdateParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInstructionPartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/instruction/${id}/`,
        method: 'PATCH',
        secure: true,
        ...params,
      }),

    /**
     * @description Main endpoints for instructions.
     *
     * @tags organization
     * @name OrganizationInstructionDestroy
     * @summary Main endpoints for instructions.
     * @request DELETE:/v1/organization/{organizationCode}/instruction/{id}/
     * @secure
     */
    organizationInstructionDestroy: (
      { id, organizationCode, ...query }: OrganizationInstructionDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInstructionDestroyData, any>({
        path: `/v1/organization/${organizationCode}/instruction/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationInstructionImageCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/organization/{organizationCode}/instruction/{instructionId}/image/
     * @secure
     */
    organizationInstructionImageCreate: (
      { instructionId, organizationCode, ...query }: OrganizationInstructionImageCreateParams,
      data: OrganizationInstructionImageCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInstructionImageCreateData, any>({
        path: `/v1/organization/${organizationCode}/instruction/${instructionId}/image/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationInstructionImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/organization/{organizationCode}/instruction/{instructionId}/image/{id}/
     * @secure
     */
    organizationInstructionImageRetrieve: (
      { id, instructionId, organizationCode, ...query }: OrganizationInstructionImageRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInstructionImageRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/instruction/${instructionId}/image/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationInstructionImageUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/organization/{organizationCode}/instruction/{instructionId}/image/{id}/
     * @secure
     */
    organizationInstructionImageUpdate: (
      { id, instructionId, organizationCode, ...query }: OrganizationInstructionImageUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInstructionImageUpdateData, any>({
        path: `/v1/organization/${organizationCode}/instruction/${instructionId}/image/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationInstructionImagePartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/organization/{organizationCode}/instruction/{instructionId}/image/{id}/
     * @secure
     */
    organizationInstructionImagePartialUpdate: (
      {
        id,
        instructionId,
        organizationCode,
        ...query
      }: OrganizationInstructionImagePartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInstructionImagePartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/instruction/${instructionId}/image/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationInstructionImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/instruction/{instructionId}/image/{id}/
     * @secure
     */
    organizationInstructionImageDestroy: (
      { id, instructionId, organizationCode, ...query }: OrganizationInstructionImageDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInstructionImageDestroyData, any>({
        path: `/v1/organization/${organizationCode}/instruction/${instructionId}/image/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationInvitationList
     * @request GET:/v1/organization/{organizationCode}/invitation/
     * @secure
     */
    organizationInvitationList: (
      { organizationCode, ...query }: OrganizationInvitationListParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInvitationListData, any>({
        path: `/v1/organization/${organizationCode}/invitation/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationInvitationCreate
     * @request POST:/v1/organization/{organizationCode}/invitation/
     * @secure
     */
    organizationInvitationCreate: (
      { organizationCode, ...query }: OrganizationInvitationCreateParams,
      data: InvitationRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInvitationCreateData, any>({
        path: `/v1/organization/${organizationCode}/invitation/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationInvitationRetrieve
     * @request GET:/v1/organization/{organizationCode}/invitation/{id}/
     * @secure
     */
    organizationInvitationRetrieve: (
      { id, organizationCode, ...query }: OrganizationInvitationRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInvitationRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/invitation/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationInvitationUpdate
     * @request PUT:/v1/organization/{organizationCode}/invitation/{id}/
     * @secure
     */
    organizationInvitationUpdate: (
      { id, organizationCode, ...query }: OrganizationInvitationUpdateParams,
      data: InvitationRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInvitationUpdateData, any>({
        path: `/v1/organization/${organizationCode}/invitation/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationInvitationPartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/invitation/{id}/
     * @secure
     */
    organizationInvitationPartialUpdate: (
      { id, organizationCode, ...query }: OrganizationInvitationPartialUpdateParams,
      data: PatchedInvitationRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInvitationPartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/invitation/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationInvitationDestroy
     * @request DELETE:/v1/organization/{organizationCode}/invitation/{id}/
     * @secure
     */
    organizationInvitationDestroy: (
      { id, organizationCode, ...query }: OrganizationInvitationDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInvitationDestroyData, any>({
        path: `/v1/organization/${organizationCode}/invitation/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationLogoCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/organization/{organizationCode}/logo/
     * @secure
     */
    organizationLogoCreate: (
      { organizationCode, ...query }: OrganizationLogoCreateParams,
      data: OrganizationLogoCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationLogoCreateData, any>({
        path: `/v1/organization/${organizationCode}/logo/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationLogoRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/organization/{organizationCode}/logo/{id}/
     * @secure
     */
    organizationLogoRetrieve: (
      { id, organizationCode, ...query }: OrganizationLogoRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationLogoRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/logo/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationLogoUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/organization/{organizationCode}/logo/{id}/
     * @secure
     */
    organizationLogoUpdate: (
      { id, organizationCode, ...query }: OrganizationLogoUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationLogoUpdateData, any>({
        path: `/v1/organization/${organizationCode}/logo/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationLogoPartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/organization/{organizationCode}/logo/{id}/
     * @secure
     */
    organizationLogoPartialUpdate: (
      { id, organizationCode, ...query }: OrganizationLogoPartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationLogoPartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/logo/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationLogoDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/logo/{id}/
     * @secure
     */
    organizationLogoDestroy: (
      { id, organizationCode, ...query }: OrganizationLogoDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationLogoDestroyData, any>({
        path: `/v1/organization/${organizationCode}/logo/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Get all skills in current organization that have at least one mentor.
     *
     * @tags organization
     * @name OrganizationMentoredSkillRetrieve
     * @summary Get all skills in current organization that have at least one mentor.
     * @request GET:/v1/organization/{organizationCode}/mentored-skill/
     * @secure
     */
    organizationMentoredSkillRetrieve: (
      { organizationCode, ...query }: OrganizationMentoredSkillRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationMentoredSkillRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/mentored-skill/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get all skills in current organization that have at least one person who wants to be mentored.
     *
     * @tags organization
     * @name OrganizationMentoreeSkillRetrieve
     * @summary Get all skills in current organization that have at least one person who wants to be mentored.
     * @request GET:/v1/organization/{organizationCode}/mentoree-skill/
     * @secure
     */
    organizationMentoreeSkillRetrieve: (
      { organizationCode, ...query }: OrganizationMentoreeSkillRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationMentoreeSkillRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/mentoree-skill/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `retrieve`, `list`, `update`, and `destroy` actions. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags organization
 * @name OrganizationMentoringList
 * @summary A viewset that provides `retrieve`, `list`, `update`, and `destroy` actions.

To use it, override the class and set the `queryset` and
`serializer_c...
 * @request GET:/v1/organization/{organizationCode}/mentoring/
 * @secure
 */
    organizationMentoringList: (
      { organizationCode, ...query }: OrganizationMentoringListParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationMentoringListData, any>({
        path: `/v1/organization/${organizationCode}/mentoring/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `retrieve`, `list`, `update`, and `destroy` actions. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags organization
 * @name OrganizationMentoringRetrieve
 * @summary A viewset that provides `retrieve`, `list`, `update`, and `destroy` actions.

To use it, override the class and set the `queryset` and
`serializer_c...
 * @request GET:/v1/organization/{organizationCode}/mentoring/{id}/
 * @secure
 */
    organizationMentoringRetrieve: (
      { id, organizationCode, ...query }: OrganizationMentoringRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationMentoringRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/mentoring/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `retrieve`, `list`, `update`, and `destroy` actions. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags organization
 * @name OrganizationMentoringDestroy
 * @summary A viewset that provides `retrieve`, `list`, `update`, and `destroy` actions.

To use it, override the class and set the `queryset` and
`serializer_c...
 * @request DELETE:/v1/organization/{organizationCode}/mentoring/{id}/
 * @secure
 */
    organizationMentoringDestroy: (
      { id, organizationCode, ...query }: OrganizationMentoringDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationMentoringDestroyData, any>({
        path: `/v1/organization/${organizationCode}/mentoring/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
 * @description Reply to the mentoring request and update the Mentoring's status. An email with the user's message will be sent to the mentoring's initiator. The status can be: - pending : the mentoring is still being discussed - accepted : the mentoring is accepted - rejected : the mentoring is rejected
 *
 * @tags organization
 * @name OrganizationMentoringRespondCreate
 * @summary Reply to the mentoring request and update the Mentoring's status.
An email with the user's message will be sent to the mentoring's initiator.

The s...
 * @request POST:/v1/organization/{organizationCode}/mentoring/{id}/respond/
 * @secure
 */
    organizationMentoringRespondCreate: (
      { id, organizationCode, ...query }: OrganizationMentoringRespondCreateParams,
      data: MentoringResponseRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationMentoringRespondCreateData, any>({
        path: `/v1/organization/${organizationCode}/mentoring/${id}/respond/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `retrieve`, `list`, `update`, and `destroy` actions. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags organization
 * @name OrganizationMentoringContactMentorCreate
 * @summary A viewset that provides `retrieve`, `list`, `update`, and `destroy` actions.

To use it, override the class and set the `queryset` and
`serializer_c...
 * @request POST:/v1/organization/{organizationCode}/mentoring/contact-mentor/{skillId}/
 * @secure
 */
    organizationMentoringContactMentorCreate: (
      { organizationCode, skillId, ...query }: OrganizationMentoringContactMentorCreateParams,
      data: MentoringContactRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationMentoringContactMentorCreateData, any>({
        path: `/v1/organization/${organizationCode}/mentoring/contact-mentor/${skillId}/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Contact a mentoree for help.
     *
     * @tags organization
     * @name OrganizationMentoringContactMentoreeCreate
     * @summary Contact a mentoree for help.
     * @request POST:/v1/organization/{organizationCode}/mentoring/contact-mentoree/{skillId}/
     * @secure
     */
    organizationMentoringContactMentoreeCreate: (
      { organizationCode, skillId, ...query }: OrganizationMentoringContactMentoreeCreateParams,
      data: MentoringContactRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationMentoringContactMentoreeCreateData, any>({
        path: `/v1/organization/${organizationCode}/mentoring/contact-mentoree/${skillId}/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Main endpoints for news.
     *
     * @tags organization
     * @name OrganizationNewsList
     * @summary Main endpoints for news.
     * @request GET:/v1/organization/{organizationCode}/news/
     * @secure
     */
    organizationNewsList: (
      { organizationCode, ...query }: OrganizationNewsListParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsListData, any>({
        path: `/v1/organization/${organizationCode}/news/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Main endpoints for news.
     *
     * @tags organization
     * @name OrganizationNewsCreate
     * @summary Main endpoints for news.
     * @request POST:/v1/organization/{organizationCode}/news/
     * @secure
     */
    organizationNewsCreate: (
      { organizationCode, ...query }: OrganizationNewsCreateParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsCreateData, any>({
        path: `/v1/organization/${organizationCode}/news/`,
        method: 'POST',
        secure: true,
        ...params,
      }),

    /**
     * @description Main endpoints for news.
     *
     * @tags organization
     * @name OrganizationNewsRetrieve
     * @summary Main endpoints for news.
     * @request GET:/v1/organization/{organizationCode}/news/{id}/
     * @secure
     */
    organizationNewsRetrieve: (
      { id, organizationCode, ...query }: OrganizationNewsRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/news/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Main endpoints for news.
     *
     * @tags organization
     * @name OrganizationNewsUpdate
     * @summary Main endpoints for news.
     * @request PUT:/v1/organization/{organizationCode}/news/{id}/
     * @secure
     */
    organizationNewsUpdate: (
      { id, organizationCode, ...query }: OrganizationNewsUpdateParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsUpdateData, any>({
        path: `/v1/organization/${organizationCode}/news/${id}/`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * @description Main endpoints for news.
     *
     * @tags organization
     * @name OrganizationNewsPartialUpdate
     * @summary Main endpoints for news.
     * @request PATCH:/v1/organization/{organizationCode}/news/{id}/
     * @secure
     */
    organizationNewsPartialUpdate: (
      { id, organizationCode, ...query }: OrganizationNewsPartialUpdateParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsPartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/news/${id}/`,
        method: 'PATCH',
        secure: true,
        ...params,
      }),

    /**
     * @description Main endpoints for news.
     *
     * @tags organization
     * @name OrganizationNewsDestroy
     * @summary Main endpoints for news.
     * @request DELETE:/v1/organization/{organizationCode}/news/{id}/
     * @secure
     */
    organizationNewsDestroy: (
      { id, organizationCode, ...query }: OrganizationNewsDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsDestroyData, any>({
        path: `/v1/organization/${organizationCode}/news/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationNewsHeaderCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/organization/{organizationCode}/news/{newsId}/header/
     * @secure
     */
    organizationNewsHeaderCreate: (
      { newsId, organizationCode, ...query }: OrganizationNewsHeaderCreateParams,
      data: OrganizationNewsHeaderCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsHeaderCreateData, any>({
        path: `/v1/organization/${organizationCode}/news/${newsId}/header/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationNewsHeaderRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/organization/{organizationCode}/news/{newsId}/header/{id}/
     * @secure
     */
    organizationNewsHeaderRetrieve: (
      { id, newsId, organizationCode, ...query }: OrganizationNewsHeaderRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsHeaderRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/news/${newsId}/header/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationNewsHeaderUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/organization/{organizationCode}/news/{newsId}/header/{id}/
     * @secure
     */
    organizationNewsHeaderUpdate: (
      { id, newsId, organizationCode, ...query }: OrganizationNewsHeaderUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsHeaderUpdateData, any>({
        path: `/v1/organization/${organizationCode}/news/${newsId}/header/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationNewsHeaderPartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/organization/{organizationCode}/news/{newsId}/header/{id}/
     * @secure
     */
    organizationNewsHeaderPartialUpdate: (
      { id, newsId, organizationCode, ...query }: OrganizationNewsHeaderPartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsHeaderPartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/news/${newsId}/header/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationNewsHeaderDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/news/{newsId}/header/{id}/
     * @secure
     */
    organizationNewsHeaderDestroy: (
      { id, newsId, organizationCode, ...query }: OrganizationNewsHeaderDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsHeaderDestroyData, any>({
        path: `/v1/organization/${organizationCode}/news/${newsId}/header/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationNewsImageCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/organization/{organizationCode}/news/{newsId}/image/
     * @secure
     */
    organizationNewsImageCreate: (
      { newsId, organizationCode, ...query }: OrganizationNewsImageCreateParams,
      data: OrganizationNewsImageCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsImageCreateData, any>({
        path: `/v1/organization/${organizationCode}/news/${newsId}/image/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationNewsImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/organization/{organizationCode}/news/{newsId}/image/{id}/
     * @secure
     */
    organizationNewsImageRetrieve: (
      { id, newsId, organizationCode, ...query }: OrganizationNewsImageRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsImageRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/news/${newsId}/image/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationNewsImageUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/organization/{organizationCode}/news/{newsId}/image/{id}/
     * @secure
     */
    organizationNewsImageUpdate: (
      { id, newsId, organizationCode, ...query }: OrganizationNewsImageUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsImageUpdateData, any>({
        path: `/v1/organization/${organizationCode}/news/${newsId}/image/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationNewsImagePartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/organization/{organizationCode}/news/{newsId}/image/{id}/
     * @secure
     */
    organizationNewsImagePartialUpdate: (
      { id, newsId, organizationCode, ...query }: OrganizationNewsImagePartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsImagePartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/news/${newsId}/image/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationNewsImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/news/{newsId}/image/{id}/
     * @secure
     */
    organizationNewsImageDestroy: (
      { id, newsId, organizationCode, ...query }: OrganizationNewsImageDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsImageDestroyData, any>({
        path: `/v1/organization/${organizationCode}/news/${newsId}/image/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
 * @description A viewset that provides `list` action. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags organization
 * @name OrganizationNewsfeedList
 * @summary A viewset that provides `list` action.

To use it, override the class and set the `queryset` and
`serializer_class` attributes.
 * @request GET:/v1/organization/{organizationCode}/newsfeed/
 * @secure
 */
    organizationNewsfeedList: (
      { organizationCode, ...query }: OrganizationNewsfeedListParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsfeedListData, any>({
        path: `/v1/organization/${organizationCode}/newsfeed/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationPeopleGroupList
     * @request GET:/v1/organization/{organizationCode}/people-group/
     * @secure
     */
    organizationPeopleGroupList: (
      { organizationCode, ...query }: OrganizationPeopleGroupListParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupListData, any>({
        path: `/v1/organization/${organizationCode}/people-group/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationPeopleGroupCreate
     * @request POST:/v1/organization/{organizationCode}/people-group/
     * @secure
     */
    organizationPeopleGroupCreate: (
      { organizationCode, ...query }: OrganizationPeopleGroupCreateParams,
      data: PeopleGroupRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupCreateData, any>({
        path: `/v1/organization/${organizationCode}/people-group/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationPeopleGroupRetrieve
     * @request GET:/v1/organization/{organizationCode}/people-group/{id}/
     * @secure
     */
    organizationPeopleGroupRetrieve: (
      { id, organizationCode, ...query }: OrganizationPeopleGroupRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationPeopleGroupUpdate
     * @request PUT:/v1/organization/{organizationCode}/people-group/{id}/
     * @secure
     */
    organizationPeopleGroupUpdate: (
      { id, organizationCode, ...query }: OrganizationPeopleGroupUpdateParams,
      data: PeopleGroupRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupUpdateData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationPeopleGroupPartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/people-group/{id}/
     * @secure
     */
    organizationPeopleGroupPartialUpdate: (
      { id, organizationCode, ...query }: OrganizationPeopleGroupPartialUpdateParams,
      data: PatchedPeopleGroupRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupPartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationPeopleGroupDestroy
     * @request DELETE:/v1/organization/{organizationCode}/people-group/{id}/
     * @secure
     */
    organizationPeopleGroupDestroy: (
      { id, organizationCode, ...query }: OrganizationPeopleGroupDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupDestroyData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationPeopleGroupHierarchyRetrieve
     * @request GET:/v1/organization/{organizationCode}/people-group/{id}/hierarchy/
     * @secure
     */
    organizationPeopleGroupHierarchyRetrieve: (
      { id, organizationCode, ...query }: OrganizationPeopleGroupHierarchyRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupHierarchyRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${id}/hierarchy/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationPeopleGroupMemberRetrieve
     * @request GET:/v1/organization/{organizationCode}/people-group/{id}/member/
     * @secure
     */
    organizationPeopleGroupMemberRetrieve: (
      { id, organizationCode, ...query }: OrganizationPeopleGroupMemberRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupMemberRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${id}/member/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationPeopleGroupMemberAddCreate
     * @request POST:/v1/organization/{organizationCode}/people-group/{id}/member/add/
     * @secure
     */
    organizationPeopleGroupMemberAddCreate: (
      { id, organizationCode, ...query }: OrganizationPeopleGroupMemberAddCreateParams,
      data: PeopleGroupAddTeamMembersRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupMemberAddCreateData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${id}/member/add/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationPeopleGroupMemberRemoveCreate
     * @request POST:/v1/organization/{organizationCode}/people-group/{id}/member/remove/
     * @secure
     */
    organizationPeopleGroupMemberRemoveCreate: (
      { id, organizationCode, ...query }: OrganizationPeopleGroupMemberRemoveCreateParams,
      data: PeopleGroupRemoveTeamMembersRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupMemberRemoveCreateData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${id}/member/remove/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationPeopleGroupProjectRetrieve
     * @request GET:/v1/organization/{organizationCode}/people-group/{id}/project/
     * @secure
     */
    organizationPeopleGroupProjectRetrieve: (
      { id, organizationCode, ...query }: OrganizationPeopleGroupProjectRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupProjectRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${id}/project/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationPeopleGroupProjectAddCreate
     * @request POST:/v1/organization/{organizationCode}/people-group/{id}/project/add/
     * @secure
     */
    organizationPeopleGroupProjectAddCreate: (
      { id, organizationCode, ...query }: OrganizationPeopleGroupProjectAddCreateParams,
      data: PeopleGroupAddFeaturedProjectsRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupProjectAddCreateData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${id}/project/add/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationPeopleGroupProjectRemoveCreate
     * @request POST:/v1/organization/{organizationCode}/people-group/{id}/project/remove/
     * @secure
     */
    organizationPeopleGroupProjectRemoveCreate: (
      { id, organizationCode, ...query }: OrganizationPeopleGroupProjectRemoveCreateParams,
      data: PeopleGroupRemoveFeaturedProjectsRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupProjectRemoveCreateData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${id}/project/remove/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationPeopleGroupHeaderCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/organization/{organizationCode}/people-group/{peopleGroupId}/header/
     * @secure
     */
    organizationPeopleGroupHeaderCreate: (
      { organizationCode, peopleGroupId, ...query }: OrganizationPeopleGroupHeaderCreateParams,
      data: OrganizationPeopleGroupHeaderCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupHeaderCreateData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${peopleGroupId}/header/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationPeopleGroupHeaderUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/organization/{organizationCode}/people-group/{peopleGroupId}/header/
     * @secure
     */
    organizationPeopleGroupHeaderUpdate: (
      { organizationCode, peopleGroupId, ...query }: OrganizationPeopleGroupHeaderUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupHeaderUpdateData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${peopleGroupId}/header/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationPeopleGroupHeaderPartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/organization/{organizationCode}/people-group/{peopleGroupId}/header/
     * @secure
     */
    organizationPeopleGroupHeaderPartialUpdate: (
      {
        organizationCode,
        peopleGroupId,
        ...query
      }: OrganizationPeopleGroupHeaderPartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupHeaderPartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${peopleGroupId}/header/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationPeopleGroupHeaderDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/people-group/{peopleGroupId}/header/
     * @secure
     */
    organizationPeopleGroupHeaderDestroy: (
      { organizationCode, peopleGroupId, ...query }: OrganizationPeopleGroupHeaderDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupHeaderDestroyData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${peopleGroupId}/header/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationPeopleGroupLogoCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/organization/{organizationCode}/people-group/{peopleGroupId}/logo/
     * @secure
     */
    organizationPeopleGroupLogoCreate: (
      { organizationCode, peopleGroupId, ...query }: OrganizationPeopleGroupLogoCreateParams,
      data: OrganizationPeopleGroupLogoCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupLogoCreateData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${peopleGroupId}/logo/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationPeopleGroupLogoUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/organization/{organizationCode}/people-group/{peopleGroupId}/logo/
     * @secure
     */
    organizationPeopleGroupLogoUpdate: (
      { organizationCode, peopleGroupId, ...query }: OrganizationPeopleGroupLogoUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupLogoUpdateData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${peopleGroupId}/logo/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationPeopleGroupLogoPartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/organization/{organizationCode}/people-group/{peopleGroupId}/logo/
     * @secure
     */
    organizationPeopleGroupLogoPartialUpdate: (
      { organizationCode, peopleGroupId, ...query }: OrganizationPeopleGroupLogoPartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupLogoPartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${peopleGroupId}/logo/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationPeopleGroupLogoDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/people-group/{peopleGroupId}/logo/
     * @secure
     */
    organizationPeopleGroupLogoDestroy: (
      { organizationCode, peopleGroupId, ...query }: OrganizationPeopleGroupLogoDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupLogoDestroyData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${peopleGroupId}/logo/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Get recommendations for a project.
     *
     * @tags organization
     * @name OrganizationRecommendedProjectProjectRetrieve
     * @summary Get recommendations for a project.
     * @request GET:/v1/organization/{organizationCode}/recommended-project/project/{projectId}/
     * @secure
     */
    organizationRecommendedProjectProjectRetrieve: (
      {
        organizationCode,
        projectId,
        ...query
      }: OrganizationRecommendedProjectProjectRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationRecommendedProjectProjectRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/recommended-project/project/${projectId}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
 * @description Get random recommendations for a project among a pool of recommendations. The `count` parameter specifies the number of results to return. The `pool` parameter specifies the number of results among which to choose the final results.
 *
 * @tags organization
 * @name OrganizationRecommendedProjectProjectRandomRetrieve
 * @summary Get random recommendations for a project among a pool of recommendations.
The `count` parameter specifies the number of results to return.
The `pool...
 * @request GET:/v1/organization/{organizationCode}/recommended-project/project/{projectId}/random/
 * @secure
 */
    organizationRecommendedProjectProjectRandomRetrieve: (
      {
        organizationCode,
        projectId,
        ...query
      }: OrganizationRecommendedProjectProjectRandomRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationRecommendedProjectProjectRandomRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/recommended-project/project/${projectId}/random/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get recommendations for a user.
     *
     * @tags organization
     * @name OrganizationRecommendedProjectUserRetrieve
     * @summary Get recommendations for a user.
     * @request GET:/v1/organization/{organizationCode}/recommended-project/user/
     * @secure
     */
    organizationRecommendedProjectUserRetrieve: (
      { organizationCode, ...query }: OrganizationRecommendedProjectUserRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationRecommendedProjectUserRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/recommended-project/user/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
 * @description Get random recommendations for a user among a pool of recommendations. The `count` parameter specifies the number of results to return. The `pool` parameter specifies the number of results among which to choose the final results.
 *
 * @tags organization
 * @name OrganizationRecommendedProjectUserRandomRetrieve
 * @summary Get random recommendations for a user among a pool of recommendations.
The `count` parameter specifies the number of results to return.
The `pool` p...
 * @request GET:/v1/organization/{organizationCode}/recommended-project/user/random/
 * @secure
 */
    organizationRecommendedProjectUserRandomRetrieve: (
      { organizationCode, ...query }: OrganizationRecommendedProjectUserRandomRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationRecommendedProjectUserRandomRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/recommended-project/user/random/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get recommendations for a project.
     *
     * @tags organization
     * @name OrganizationRecommendedUserProjectRetrieve
     * @summary Get recommendations for a project.
     * @request GET:/v1/organization/{organizationCode}/recommended-user/project/{projectId}/
     * @secure
     */
    organizationRecommendedUserProjectRetrieve: (
      { organizationCode, projectId, ...query }: OrganizationRecommendedUserProjectRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationRecommendedUserProjectRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/recommended-user/project/${projectId}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
 * @description Get random recommendations for a project among a pool of recommendations. The `count` parameter specifies the number of results to return. The `pool` parameter specifies the number of results among which to choose the final results.
 *
 * @tags organization
 * @name OrganizationRecommendedUserProjectRandomRetrieve
 * @summary Get random recommendations for a project among a pool of recommendations.
The `count` parameter specifies the number of results to return.
The `pool...
 * @request GET:/v1/organization/{organizationCode}/recommended-user/project/{projectId}/random/
 * @secure
 */
    organizationRecommendedUserProjectRandomRetrieve: (
      {
        organizationCode,
        projectId,
        ...query
      }: OrganizationRecommendedUserProjectRandomRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationRecommendedUserProjectRandomRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/recommended-user/project/${projectId}/random/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get recommendations for a user.
     *
     * @tags organization
     * @name OrganizationRecommendedUserUserRetrieve
     * @summary Get recommendations for a user.
     * @request GET:/v1/organization/{organizationCode}/recommended-user/user/
     * @secure
     */
    organizationRecommendedUserUserRetrieve: (
      { organizationCode, ...query }: OrganizationRecommendedUserUserRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationRecommendedUserUserRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/recommended-user/user/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
 * @description Get random recommendations for a user among a pool of recommendations. The `count` parameter specifies the number of results to return. The `pool` parameter specifies the number of results among which to choose the final results.
 *
 * @tags organization
 * @name OrganizationRecommendedUserUserRandomRetrieve
 * @summary Get random recommendations for a user among a pool of recommendations.
The `count` parameter specifies the number of results to return.
The `pool` p...
 * @request GET:/v1/organization/{organizationCode}/recommended-user/user/random/
 * @secure
 */
    organizationRecommendedUserUserRandomRetrieve: (
      { organizationCode, ...query }: OrganizationRecommendedUserUserRandomRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationRecommendedUserUserRandomRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/recommended-user/user/random/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allow to send an abuse report email.
     *
     * @tags organization
     * @name OrganizationReportAbuseCreate
     * @summary Allow to send an abuse report email.
     * @request POST:/v1/organization/{organizationCode}/report/abuse/
     * @secure
     */
    organizationReportAbuseCreate: (
      { organizationCode, ...query }: OrganizationReportAbuseCreateParams,
      data: EmailReportRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationReportAbuseCreateData, any>({
        path: `/v1/organization/${organizationCode}/report/abuse/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allow to send a bug report email.
     *
     * @tags organization
     * @name OrganizationReportBugCreate
     * @summary Allow to send a bug report email.
     * @request POST:/v1/organization/{organizationCode}/report/bug/
     * @secure
     */
    organizationReportBugCreate: (
      { organizationCode, ...query }: OrganizationReportBugCreateParams,
      data: EmailReportRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationReportBugCreateData, any>({
        path: `/v1/organization/${organizationCode}/report/bug/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationStatsList
     * @request GET:/v1/organization/{organizationCode}/stats/
     * @secure
     */
    organizationStatsList: (
      { organizationCode, ...query }: OrganizationStatsListParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationStatsListData, any>({
        path: `/v1/organization/${organizationCode}/stats/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagList
     * @request GET:/v1/organization/{organizationCode}/tag/
     * @secure
     */
    organizationTagList: (
      { organizationCode, ...query }: OrganizationTagListParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagListData, any>({
        path: `/v1/organization/${organizationCode}/tag/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagCreate
     * @request POST:/v1/organization/{organizationCode}/tag/
     * @secure
     */
    organizationTagCreate: (
      { organizationCode, ...query }: OrganizationTagCreateParams,
      data: TagRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagCreateData, any>({
        path: `/v1/organization/${organizationCode}/tag/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagClassificationList
     * @request GET:/v1/organization/{organizationCode}/tag-classification/
     * @secure
     */
    organizationTagClassificationList: (
      { organizationCode, ...query }: OrganizationTagClassificationListParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagClassificationListData, any>({
        path: `/v1/organization/${organizationCode}/tag-classification/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagClassificationCreate
     * @request POST:/v1/organization/{organizationCode}/tag-classification/
     * @secure
     */
    organizationTagClassificationCreate: (
      { organizationCode, ...query }: OrganizationTagClassificationCreateParams,
      data: TagClassificationRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagClassificationCreateData, any>({
        path: `/v1/organization/${organizationCode}/tag-classification/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagClassificationRetrieve
     * @request GET:/v1/organization/{organizationCode}/tag-classification/{id}/
     * @secure
     */
    organizationTagClassificationRetrieve: (
      { id, organizationCode, ...query }: OrganizationTagClassificationRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagClassificationRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/tag-classification/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagClassificationUpdate
     * @request PUT:/v1/organization/{organizationCode}/tag-classification/{id}/
     * @secure
     */
    organizationTagClassificationUpdate: (
      { id, organizationCode, ...query }: OrganizationTagClassificationUpdateParams,
      data: TagClassificationRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagClassificationUpdateData, any>({
        path: `/v1/organization/${organizationCode}/tag-classification/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagClassificationPartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/tag-classification/{id}/
     * @secure
     */
    organizationTagClassificationPartialUpdate: (
      { id, organizationCode, ...query }: OrganizationTagClassificationPartialUpdateParams,
      data: PatchedTagClassificationRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagClassificationPartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/tag-classification/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagClassificationDestroy
     * @request DELETE:/v1/organization/{organizationCode}/tag-classification/{id}/
     * @secure
     */
    organizationTagClassificationDestroy: (
      { id, organizationCode, ...query }: OrganizationTagClassificationDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagClassificationDestroyData, any>({
        path: `/v1/organization/${organizationCode}/tag-classification/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagClassificationAddTagsCreate
     * @request POST:/v1/organization/{organizationCode}/tag-classification/{id}/add-tags/
     * @secure
     */
    organizationTagClassificationAddTagsCreate: (
      { id, organizationCode, ...query }: OrganizationTagClassificationAddTagsCreateParams,
      data: TagClassificationAddTagsRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagClassificationAddTagsCreateData, any>({
        path: `/v1/organization/${organizationCode}/tag-classification/${id}/add-tags/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagClassificationRemoveTagsCreate
     * @request POST:/v1/organization/{organizationCode}/tag-classification/{id}/remove-tags/
     * @secure
     */
    organizationTagClassificationRemoveTagsCreate: (
      { id, organizationCode, ...query }: OrganizationTagClassificationRemoveTagsCreateParams,
      data: TagClassificationRemoveTagsRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagClassificationRemoveTagsCreateData, any>({
        path: `/v1/organization/${organizationCode}/tag-classification/${id}/remove-tags/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagClassificationTagList
     * @request GET:/v1/organization/{organizationCode}/tag-classification/{tagClassificationId}/tag/
     * @secure
     */
    organizationTagClassificationTagList: (
      {
        organizationCode,
        tagClassificationId,
        ...query
      }: OrganizationTagClassificationTagListParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagClassificationTagListData, any>({
        path: `/v1/organization/${organizationCode}/tag-classification/${tagClassificationId}/tag/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagClassificationTagCreate
     * @request POST:/v1/organization/{organizationCode}/tag-classification/{tagClassificationId}/tag/
     * @secure
     */
    organizationTagClassificationTagCreate: (
      {
        organizationCode,
        tagClassificationId,
        ...query
      }: OrganizationTagClassificationTagCreateParams,
      data: TagRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagClassificationTagCreateData, any>({
        path: `/v1/organization/${organizationCode}/tag-classification/${tagClassificationId}/tag/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagClassificationTagRetrieve
     * @request GET:/v1/organization/{organizationCode}/tag-classification/{tagClassificationId}/tag/{id}/
     * @secure
     */
    organizationTagClassificationTagRetrieve: (
      {
        id,
        organizationCode,
        tagClassificationId,
        ...query
      }: OrganizationTagClassificationTagRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagClassificationTagRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/tag-classification/${tagClassificationId}/tag/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagClassificationTagUpdate
     * @request PUT:/v1/organization/{organizationCode}/tag-classification/{tagClassificationId}/tag/{id}/
     * @secure
     */
    organizationTagClassificationTagUpdate: (
      {
        id,
        organizationCode,
        tagClassificationId,
        ...query
      }: OrganizationTagClassificationTagUpdateParams,
      data: TagRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagClassificationTagUpdateData, any>({
        path: `/v1/organization/${organizationCode}/tag-classification/${tagClassificationId}/tag/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagClassificationTagPartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/tag-classification/{tagClassificationId}/tag/{id}/
     * @secure
     */
    organizationTagClassificationTagPartialUpdate: (
      {
        id,
        organizationCode,
        tagClassificationId,
        ...query
      }: OrganizationTagClassificationTagPartialUpdateParams,
      data: PatchedTagRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagClassificationTagPartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/tag-classification/${tagClassificationId}/tag/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagClassificationTagDestroy
     * @request DELETE:/v1/organization/{organizationCode}/tag-classification/{tagClassificationId}/tag/{id}/
     * @secure
     */
    organizationTagClassificationTagDestroy: (
      {
        id,
        organizationCode,
        tagClassificationId,
        ...query
      }: OrganizationTagClassificationTagDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagClassificationTagDestroyData, any>({
        path: `/v1/organization/${organizationCode}/tag-classification/${tagClassificationId}/tag/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
 * @description Autocomplete custom tags of an organization (if only `organization_code` is provided in the url), or all tags from a specific classification (if `organization_code` and `tag_classification_id` are provided in the url). Additionally, when using this endpoint with the `tag_classification_id` parameter, you can use the following values instead of slugs to look through specific tags classifications: - `enabled-for-projects`: Tags that are enabled for projects in the organization - `enabled-for-skills`: Tags that are enabled for skills in the organization
 *
 * @tags organization
 * @name OrganizationTagClassificationTagAutocompleteRetrieve
 * @summary Autocomplete custom tags of an organization (if only `organization_code` is
provided in the url), or all tags from a specific classification (if
`or...
 * @request GET:/v1/organization/{organizationCode}/tag-classification/{tagClassificationId}/tag/autocomplete/
 * @secure
 */
    organizationTagClassificationTagAutocompleteRetrieve: (
      {
        organizationCode,
        tagClassificationId,
        ...query
      }: OrganizationTagClassificationTagAutocompleteRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagClassificationTagAutocompleteRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/tag-classification/${tagClassificationId}/tag/autocomplete/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagRetrieve
     * @request GET:/v1/organization/{organizationCode}/tag/{id}/
     * @secure
     */
    organizationTagRetrieve: (
      { id, organizationCode, ...query }: OrganizationTagRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/tag/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagUpdate
     * @request PUT:/v1/organization/{organizationCode}/tag/{id}/
     * @secure
     */
    organizationTagUpdate: (
      { id, organizationCode, ...query }: OrganizationTagUpdateParams,
      data: TagRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagUpdateData, any>({
        path: `/v1/organization/${organizationCode}/tag/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagPartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/tag/{id}/
     * @secure
     */
    organizationTagPartialUpdate: (
      { id, organizationCode, ...query }: OrganizationTagPartialUpdateParams,
      data: PatchedTagRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagPartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/tag/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTagDestroy
     * @request DELETE:/v1/organization/{organizationCode}/tag/{id}/
     * @secure
     */
    organizationTagDestroy: (
      { id, organizationCode, ...query }: OrganizationTagDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagDestroyData, any>({
        path: `/v1/organization/${organizationCode}/tag/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
 * @description Autocomplete custom tags of an organization (if only `organization_code` is provided in the url), or all tags from a specific classification (if `organization_code` and `tag_classification_id` are provided in the url). Additionally, when using this endpoint with the `tag_classification_id` parameter, you can use the following values instead of slugs to look through specific tags classifications: - `enabled-for-projects`: Tags that are enabled for projects in the organization - `enabled-for-skills`: Tags that are enabled for skills in the organization
 *
 * @tags organization
 * @name OrganizationTagAutocompleteRetrieve
 * @summary Autocomplete custom tags of an organization (if only `organization_code` is
provided in the url), or all tags from a specific classification (if
`or...
 * @request GET:/v1/organization/{organizationCode}/tag/autocomplete/
 * @secure
 */
    organizationTagAutocompleteRetrieve: (
      { organizationCode, ...query }: OrganizationTagAutocompleteRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagAutocompleteRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/tag/autocomplete/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTemplateList
     * @request GET:/v1/organization/{organizationCode}/template/
     * @secure
     */
    organizationTemplateList: (
      { organizationCode, ...query }: OrganizationTemplateListParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTemplateListData, any>({
        path: `/v1/organization/${organizationCode}/template/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTemplateCreate
     * @request POST:/v1/organization/{organizationCode}/template/
     * @secure
     */
    organizationTemplateCreate: (
      { organizationCode, ...query }: OrganizationTemplateCreateParams,
      data: TemplateRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTemplateCreateData, any>({
        path: `/v1/organization/${organizationCode}/template/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTemplateRetrieve
     * @request GET:/v1/organization/{organizationCode}/template/{id}/
     * @secure
     */
    organizationTemplateRetrieve: (
      { id, organizationCode, ...query }: OrganizationTemplateRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTemplateRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/template/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTemplateUpdate
     * @request PUT:/v1/organization/{organizationCode}/template/{id}/
     * @secure
     */
    organizationTemplateUpdate: (
      { id, organizationCode, ...query }: OrganizationTemplateUpdateParams,
      data: TemplateRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTemplateUpdateData, any>({
        path: `/v1/organization/${organizationCode}/template/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTemplatePartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/template/{id}/
     * @secure
     */
    organizationTemplatePartialUpdate: (
      { id, organizationCode, ...query }: OrganizationTemplatePartialUpdateParams,
      data: PatchedTemplateRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTemplatePartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/template/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTemplateDestroy
     * @request DELETE:/v1/organization/{organizationCode}/template/{id}/
     * @secure
     */
    organizationTemplateDestroy: (
      { id, organizationCode, ...query }: OrganizationTemplateDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTemplateDestroyData, any>({
        path: `/v1/organization/${organizationCode}/template/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationTemplateImageCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/organization/{organizationCode}/template/{templateId}/image/
     * @secure
     */
    organizationTemplateImageCreate: (
      { organizationCode, templateId, ...query }: OrganizationTemplateImageCreateParams,
      data: OrganizationTemplateImageCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTemplateImageCreateData, any>({
        path: `/v1/organization/${organizationCode}/template/${templateId}/image/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationTemplateImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/organization/{organizationCode}/template/{templateId}/image/{id}/
     * @secure
     */
    organizationTemplateImageRetrieve: (
      { id, organizationCode, templateId, ...query }: OrganizationTemplateImageRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTemplateImageRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/template/${templateId}/image/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationTemplateImageUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/organization/{organizationCode}/template/{templateId}/image/{id}/
     * @secure
     */
    organizationTemplateImageUpdate: (
      { id, organizationCode, templateId, ...query }: OrganizationTemplateImageUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTemplateImageUpdateData, any>({
        path: `/v1/organization/${organizationCode}/template/${templateId}/image/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationTemplateImagePartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/organization/{organizationCode}/template/{templateId}/image/{id}/
     * @secure
     */
    organizationTemplateImagePartialUpdate: (
      { id, organizationCode, templateId, ...query }: OrganizationTemplateImagePartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTemplateImagePartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/template/${templateId}/image/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationTemplateImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/template/{templateId}/image/{id}/
     * @secure
     */
    organizationTemplateImageDestroy: (
      { id, organizationCode, templateId, ...query }: OrganizationTemplateImageDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTemplateImageDestroyData, any>({
        path: `/v1/organization/${organizationCode}/template/${templateId}/image/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTermsAndConditionsUpdate
     * @request PUT:/v1/organization/{organizationCode}/terms-and-conditions/{id}/
     * @secure
     */
    organizationTermsAndConditionsUpdate: (
      { id, organizationCode, ...query }: OrganizationTermsAndConditionsUpdateParams,
      data: TermsAndConditionsRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTermsAndConditionsUpdateData, any>({
        path: `/v1/organization/${organizationCode}/terms-and-conditions/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags organization
     * @name OrganizationTermsAndConditionsPartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/terms-and-conditions/{id}/
     * @secure
     */
    organizationTermsAndConditionsPartialUpdate: (
      { id, organizationCode, ...query }: OrganizationTermsAndConditionsPartialUpdateParams,
      data: PatchedTermsAndConditionsRequest,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTermsAndConditionsPartialUpdateData, any>({
        path: `/v1/organization/${organizationCode}/terms-and-conditions/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get all users in current organization that have at least one skill that could be mentored by the user.
     *
     * @tags organization
     * @name OrganizationUserMentorCandidateRetrieve
     * @summary Get all users in current organization that have at least one skill that could be mentored by the user.
     * @request GET:/v1/organization/{organizationCode}/user/{userId}/mentor-candidate/
     * @secure
     */
    organizationUserMentorCandidateRetrieve: (
      { organizationCode, userId, ...query }: OrganizationUserMentorCandidateRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationUserMentorCandidateRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/user/${userId}/mentor-candidate/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Get all users in current organization that have at least one skill that could be mentored by the user.
     *
     * @tags organization
     * @name OrganizationUserMentoreeCandidateRetrieve
     * @summary Get all users in current organization that have at least one skill that could be mentored by the user.
     * @request GET:/v1/organization/{organizationCode}/user/{userId}/mentoree-candidate/
     * @secure
     */
    organizationUserMentoreeCandidateRetrieve: (
      { organizationCode, userId, ...query }: OrganizationUserMentoreeCandidateRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationUserMentoreeCandidateRetrieveData, any>({
        path: `/v1/organization/${organizationCode}/user/${userId}/mentoree-candidate/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows getting or modifying a user's privacy settings.
     *
     * @tags privacy-settings
     * @name PrivacySettingsRetrieve
     * @summary Allows getting or modifying a user's privacy settings.
     * @request GET:/v1/privacy-settings/{userId}/
     * @secure
     */
    privacySettingsRetrieve: (
      { userId, ...query }: PrivacySettingsRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<PrivacySettingsRetrieveData, any>({
        path: `/v1/privacy-settings/${userId}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows getting or modifying a user's privacy settings.
     *
     * @tags privacy-settings
     * @name PrivacySettingsUpdate
     * @summary Allows getting or modifying a user's privacy settings.
     * @request PUT:/v1/privacy-settings/{userId}/
     * @secure
     */
    privacySettingsUpdate: (
      { userId, ...query }: PrivacySettingsUpdateParams,
      data: PrivacySettingsRequest,
      params: RequestParams = {}
    ) =>
      this.request<PrivacySettingsUpdateData, any>({
        path: `/v1/privacy-settings/${userId}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows getting or modifying a user's privacy settings.
     *
     * @tags privacy-settings
     * @name PrivacySettingsPartialUpdate
     * @summary Allows getting or modifying a user's privacy settings.
     * @request PATCH:/v1/privacy-settings/{userId}/
     * @secure
     */
    privacySettingsPartialUpdate: (
      { userId, ...query }: PrivacySettingsPartialUpdateParams,
      data: PatchedPrivacySettingsRequest,
      params: RequestParams = {}
    ) =>
      this.request<PrivacySettingsPartialUpdateData, any>({
        path: `/v1/privacy-settings/${userId}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Main endpoints for projects.
     *
     * @tags project
     * @name ProjectList
     * @summary Main endpoints for projects.
     * @request GET:/v1/project/
     * @secure
     */
    projectList: (query: ProjectListParams, params: RequestParams = {}) =>
      this.request<ProjectListData, any>({
        path: `/v1/project/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Main endpoints for projects.
     *
     * @tags project
     * @name ProjectCreate
     * @summary Main endpoints for projects.
     * @request POST:/v1/project/
     * @secure
     */
    projectCreate: (data: ProjectRequest, params: RequestParams = {}) =>
      this.request<ProjectCreateData, any>({
        path: `/v1/project/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Main endpoints for projects.
     *
     * @tags project
     * @name ProjectRetrieve
     * @summary Main endpoints for projects.
     * @request GET:/v1/project/{id}/
     * @secure
     */
    projectRetrieve: ({ id, ...query }: ProjectRetrieveParams, params: RequestParams = {}) =>
      this.request<ProjectRetrieveData, any>({
        path: `/v1/project/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Main endpoints for projects.
     *
     * @tags project
     * @name ProjectUpdate
     * @summary Main endpoints for projects.
     * @request PUT:/v1/project/{id}/
     * @secure
     */
    projectUpdate: (
      { id, ...query }: ProjectUpdateParams,
      data: ProjectRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectUpdateData, any>({
        path: `/v1/project/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Main endpoints for projects.
     *
     * @tags project
     * @name ProjectPartialUpdate
     * @summary Main endpoints for projects.
     * @request PATCH:/v1/project/{id}/
     * @secure
     */
    projectPartialUpdate: (
      { id, ...query }: ProjectPartialUpdateParams,
      data: PatchedProjectRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectPartialUpdateData, any>({
        path: `/v1/project/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Main endpoints for projects.
     *
     * @tags project
     * @name ProjectDestroy
     * @summary Main endpoints for projects.
     * @request DELETE:/v1/project/{id}/
     * @secure
     */
    projectDestroy: ({ id, ...query }: ProjectDestroyParams, params: RequestParams = {}) =>
      this.request<ProjectDestroyData, any>({
        path: `/v1/project/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Duplicate a given project.
     *
     * @tags project
     * @name ProjectDuplicateCreate
     * @summary Duplicate a given project.
     * @request POST:/v1/project/{id}/duplicate/
     * @secure
     */
    projectDuplicateCreate: (
      { id, ...query }: ProjectDuplicateCreateParams,
      data: ProjectRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectDuplicateCreateData, any>({
        path: `/v1/project/${id}/duplicate/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Main endpoints for projects.
     *
     * @tags project
     * @name ProjectLockCreate
     * @summary Main endpoints for projects.
     * @request POST:/v1/project/{id}/lock/
     * @secure
     */
    projectLockCreate: (
      { id, ...query }: ProjectLockCreateParams,
      data: ProjectRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLockCreateData, any>({
        path: `/v1/project/${id}/lock/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Add users to the project's group of the given name or add group to project.member_groups.
     *
     * @tags project
     * @name ProjectMemberAddCreate
     * @summary Add users to the project's group of the given name or add group to project.member_groups.
     * @request POST:/v1/project/{id}/member/add/
     * @secure
     */
    projectMemberAddCreate: (
      { id, ...query }: ProjectMemberAddCreateParams,
      data: ProjectAddTeamMembersRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectMemberAddCreateData, any>({
        path: `/v1/project/${id}/member/add/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Remove users from the project's group of the given name.
     *
     * @tags project
     * @name ProjectMemberRemoveCreate
     * @summary Remove users from the project's group of the given name.
     * @request POST:/v1/project/{id}/member/remove/
     * @secure
     */
    projectMemberRemoveCreate: (
      { id, ...query }: ProjectMemberRemoveCreateParams,
      data: ProjectRemoveTeamMembersRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectMemberRemoveCreateData, any>({
        path: `/v1/project/${id}/member/remove/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Remove users from the project's group of the given name.
     *
     * @tags project
     * @name ProjectQuitDestroy
     * @summary Remove users from the project's group of the given name.
     * @request DELETE:/v1/project/{id}/quit/
     * @secure
     */
    projectQuitDestroy: ({ id, ...query }: ProjectQuitDestroyParams, params: RequestParams = {}) =>
      this.request<ProjectQuitDestroyData, any>({
        path: `/v1/project/${id}/quit/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Main endpoints for projects.
     *
     * @tags project
     * @name ProjectSimilarRetrieve
     * @summary Main endpoints for projects.
     * @request GET:/v1/project/{id}/similar/
     * @secure
     */
    projectSimilarRetrieve: (
      { id, ...query }: ProjectSimilarRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectSimilarRetrieveData, any>({
        path: `/v1/project/${id}/similar/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Main endpoints for projects.
     *
     * @tags project
     * @name ProjectUnlockCreate
     * @summary Main endpoints for projects.
     * @request POST:/v1/project/{id}/unlock/
     * @secure
     */
    projectUnlockCreate: (
      { id, ...query }: ProjectUnlockCreateParams,
      data: ProjectRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectUnlockCreateData, any>({
        path: `/v1/project/${id}/unlock/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectAnnouncementList
     * @request GET:/v1/project/{projectId}/announcement/
     * @secure
     */
    projectAnnouncementList: (
      { projectId, ...query }: ProjectAnnouncementListParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectAnnouncementListData, any>({
        path: `/v1/project/${projectId}/announcement/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectAnnouncementCreate
     * @request POST:/v1/project/{projectId}/announcement/
     * @secure
     */
    projectAnnouncementCreate: (
      { projectId, ...query }: ProjectAnnouncementCreateParams,
      data: AnnouncementRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectAnnouncementCreateData, any>({
        path: `/v1/project/${projectId}/announcement/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectAnnouncementRetrieve
     * @request GET:/v1/project/{projectId}/announcement/{id}/
     * @secure
     */
    projectAnnouncementRetrieve: (
      { id, projectId, ...query }: ProjectAnnouncementRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectAnnouncementRetrieveData, any>({
        path: `/v1/project/${projectId}/announcement/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectAnnouncementUpdate
     * @request PUT:/v1/project/{projectId}/announcement/{id}/
     * @secure
     */
    projectAnnouncementUpdate: (
      { id, projectId, ...query }: ProjectAnnouncementUpdateParams,
      data: AnnouncementRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectAnnouncementUpdateData, any>({
        path: `/v1/project/${projectId}/announcement/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectAnnouncementPartialUpdate
     * @request PATCH:/v1/project/{projectId}/announcement/{id}/
     * @secure
     */
    projectAnnouncementPartialUpdate: (
      { id, projectId, ...query }: ProjectAnnouncementPartialUpdateParams,
      data: PatchedAnnouncementRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectAnnouncementPartialUpdateData, any>({
        path: `/v1/project/${projectId}/announcement/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectAnnouncementDestroy
     * @request DELETE:/v1/project/{projectId}/announcement/{id}/
     * @secure
     */
    projectAnnouncementDestroy: (
      { id, projectId, ...query }: ProjectAnnouncementDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectAnnouncementDestroyData, any>({
        path: `/v1/project/${projectId}/announcement/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectAnnouncementApplyCreate
     * @request POST:/v1/project/{projectId}/announcement/{id}/apply/
     * @secure
     */
    projectAnnouncementApplyCreate: (
      { id, projectId, ...query }: ProjectAnnouncementApplyCreateParams,
      data: ApplyToAnnouncementRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectAnnouncementApplyCreateData, any>({
        path: `/v1/project/${projectId}/announcement/${id}/apply/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectBlogEntryList
     * @request GET:/v1/project/{projectId}/blog-entry/
     * @secure
     */
    projectBlogEntryList: (
      { projectId, ...query }: ProjectBlogEntryListParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectBlogEntryListData, any>({
        path: `/v1/project/${projectId}/blog-entry/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectBlogEntryCreate
     * @request POST:/v1/project/{projectId}/blog-entry/
     * @secure
     */
    projectBlogEntryCreate: (
      { projectId, ...query }: ProjectBlogEntryCreateParams,
      data: BlogEntryRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectBlogEntryCreateData, any>({
        path: `/v1/project/${projectId}/blog-entry/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectBlogEntryImageCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/project/{projectId}/blog-entry-image/
     * @secure
     */
    projectBlogEntryImageCreate: (
      { projectId, ...query }: ProjectBlogEntryImageCreateParams,
      data: ProjectBlogEntryImageCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<ProjectBlogEntryImageCreateData, any>({
        path: `/v1/project/${projectId}/blog-entry-image/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectBlogEntryImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/project/{projectId}/blog-entry-image/{id}/
     * @secure
     */
    projectBlogEntryImageRetrieve: (
      { id, projectId, ...query }: ProjectBlogEntryImageRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectBlogEntryImageRetrieveData, any>({
        path: `/v1/project/${projectId}/blog-entry-image/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectBlogEntryImageUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/project/{projectId}/blog-entry-image/{id}/
     * @secure
     */
    projectBlogEntryImageUpdate: (
      { id, projectId, ...query }: ProjectBlogEntryImageUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectBlogEntryImageUpdateData, any>({
        path: `/v1/project/${projectId}/blog-entry-image/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectBlogEntryImagePartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/project/{projectId}/blog-entry-image/{id}/
     * @secure
     */
    projectBlogEntryImagePartialUpdate: (
      { id, projectId, ...query }: ProjectBlogEntryImagePartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectBlogEntryImagePartialUpdateData, any>({
        path: `/v1/project/${projectId}/blog-entry-image/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectBlogEntryImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/project/{projectId}/blog-entry-image/{id}/
     * @secure
     */
    projectBlogEntryImageDestroy: (
      { id, projectId, ...query }: ProjectBlogEntryImageDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectBlogEntryImageDestroyData, any>({
        path: `/v1/project/${projectId}/blog-entry-image/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectBlogEntryRetrieve
     * @request GET:/v1/project/{projectId}/blog-entry/{id}/
     * @secure
     */
    projectBlogEntryRetrieve: (
      { id, projectId, ...query }: ProjectBlogEntryRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectBlogEntryRetrieveData, any>({
        path: `/v1/project/${projectId}/blog-entry/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectBlogEntryUpdate
     * @request PUT:/v1/project/{projectId}/blog-entry/{id}/
     * @secure
     */
    projectBlogEntryUpdate: (
      { id, projectId, ...query }: ProjectBlogEntryUpdateParams,
      data: BlogEntryRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectBlogEntryUpdateData, any>({
        path: `/v1/project/${projectId}/blog-entry/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectBlogEntryPartialUpdate
     * @request PATCH:/v1/project/{projectId}/blog-entry/{id}/
     * @secure
     */
    projectBlogEntryPartialUpdate: (
      { id, projectId, ...query }: ProjectBlogEntryPartialUpdateParams,
      data: PatchedBlogEntryRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectBlogEntryPartialUpdateData, any>({
        path: `/v1/project/${projectId}/blog-entry/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectBlogEntryDestroy
     * @request DELETE:/v1/project/{projectId}/blog-entry/{id}/
     * @secure
     */
    projectBlogEntryDestroy: (
      { id, projectId, ...query }: ProjectBlogEntryDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectBlogEntryDestroyData, any>({
        path: `/v1/project/${projectId}/blog-entry/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectCommentList
     * @request GET:/v1/project/{projectId}/comment/
     * @secure
     */
    projectCommentList: (
      { projectId, ...query }: ProjectCommentListParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectCommentListData, any>({
        path: `/v1/project/${projectId}/comment/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectCommentCreate
     * @request POST:/v1/project/{projectId}/comment/
     * @secure
     */
    projectCommentCreate: (
      { projectId, ...query }: ProjectCommentCreateParams,
      data: CommentRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectCommentCreateData, any>({
        path: `/v1/project/${projectId}/comment/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectCommentImageCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/project/{projectId}/comment-image/
     * @secure
     */
    projectCommentImageCreate: (
      { projectId, ...query }: ProjectCommentImageCreateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectCommentImageCreateData, any>({
        path: `/v1/project/${projectId}/comment-image/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectCommentImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/project/{projectId}/comment-image/{id}/
     * @secure
     */
    projectCommentImageRetrieve: (
      { id, projectId, ...query }: ProjectCommentImageRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectCommentImageRetrieveData, any>({
        path: `/v1/project/${projectId}/comment-image/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectCommentImageUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/project/{projectId}/comment-image/{id}/
     * @secure
     */
    projectCommentImageUpdate: (
      { id, projectId, ...query }: ProjectCommentImageUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectCommentImageUpdateData, any>({
        path: `/v1/project/${projectId}/comment-image/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectCommentImagePartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/project/{projectId}/comment-image/{id}/
     * @secure
     */
    projectCommentImagePartialUpdate: (
      { id, projectId, ...query }: ProjectCommentImagePartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectCommentImagePartialUpdateData, any>({
        path: `/v1/project/${projectId}/comment-image/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectCommentImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/project/{projectId}/comment-image/{id}/
     * @secure
     */
    projectCommentImageDestroy: (
      { id, projectId, ...query }: ProjectCommentImageDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectCommentImageDestroyData, any>({
        path: `/v1/project/${projectId}/comment-image/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectCommentRetrieve
     * @request GET:/v1/project/{projectId}/comment/{id}/
     * @secure
     */
    projectCommentRetrieve: (
      { id, projectId, ...query }: ProjectCommentRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectCommentRetrieveData, any>({
        path: `/v1/project/${projectId}/comment/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectCommentUpdate
     * @request PUT:/v1/project/{projectId}/comment/{id}/
     * @secure
     */
    projectCommentUpdate: (
      { id, projectId, ...query }: ProjectCommentUpdateParams,
      data: CommentRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectCommentUpdateData, any>({
        path: `/v1/project/${projectId}/comment/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectCommentPartialUpdate
     * @request PATCH:/v1/project/{projectId}/comment/{id}/
     * @secure
     */
    projectCommentPartialUpdate: (
      { id, projectId, ...query }: ProjectCommentPartialUpdateParams,
      data: PatchedCommentRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectCommentPartialUpdateData, any>({
        path: `/v1/project/${projectId}/comment/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectCommentDestroy
     * @request DELETE:/v1/project/{projectId}/comment/{id}/
     * @secure
     */
    projectCommentDestroy: (
      { id, projectId, ...query }: ProjectCommentDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectCommentDestroyData, any>({
        path: `/v1/project/${projectId}/comment/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectFileList
     * @request GET:/v1/project/{projectId}/file/
     * @secure
     */
    projectFileList: ({ projectId, ...query }: ProjectFileListParams, params: RequestParams = {}) =>
      this.request<ProjectFileListData, any>({
        path: `/v1/project/${projectId}/file/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectFileCreate
     * @request POST:/v1/project/{projectId}/file/
     * @secure
     */
    projectFileCreate: (
      { projectId, ...query }: ProjectFileCreateParams,
      data: AttachmentFileRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectFileCreateData, any>({
        path: `/v1/project/${projectId}/file/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectFileRetrieve
     * @request GET:/v1/project/{projectId}/file/{id}/
     * @secure
     */
    projectFileRetrieve: (
      { id, projectId, ...query }: ProjectFileRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectFileRetrieveData, any>({
        path: `/v1/project/${projectId}/file/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectFileUpdate
     * @request PUT:/v1/project/{projectId}/file/{id}/
     * @secure
     */
    projectFileUpdate: (
      { id, projectId, ...query }: ProjectFileUpdateParams,
      data: AttachmentFileRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectFileUpdateData, any>({
        path: `/v1/project/${projectId}/file/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectFilePartialUpdate
     * @request PATCH:/v1/project/{projectId}/file/{id}/
     * @secure
     */
    projectFilePartialUpdate: (
      { id, projectId, ...query }: ProjectFilePartialUpdateParams,
      data: PatchedAttachmentFileRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectFilePartialUpdateData, any>({
        path: `/v1/project/${projectId}/file/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectFileDestroy
     * @request DELETE:/v1/project/{projectId}/file/{id}/
     * @secure
     */
    projectFileDestroy: (
      { id, projectId, ...query }: ProjectFileDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectFileDestroyData, any>({
        path: `/v1/project/${projectId}/file/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
 * @description A viewset that provides `retrieve`, `create`, and `list` actions. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags project
 * @name ProjectFollowList
 * @summary A viewset that provides `retrieve`, `create`, and `list` actions.

To use it, override the class and set the `queryset` and
`serializer_class` attri...
 * @request GET:/v1/project/{projectId}/follow/
 * @secure
 */
    projectFollowList: (
      { projectId, ...query }: ProjectFollowListParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectFollowListData, any>({
        path: `/v1/project/${projectId}/follow/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `retrieve`, `create`, and `list` actions. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags project
 * @name ProjectFollowCreate
 * @summary A viewset that provides `retrieve`, `create`, and `list` actions.

To use it, override the class and set the `queryset` and
`serializer_class` attri...
 * @request POST:/v1/project/{projectId}/follow/
 * @secure
 */
    projectFollowCreate: (
      { projectId, ...query }: ProjectFollowCreateParams,
      data: FollowRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectFollowCreateData, any>({
        path: `/v1/project/${projectId}/follow/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `retrieve`, `create`, and `list` actions. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags project
 * @name ProjectFollowDestroy
 * @summary A viewset that provides `retrieve`, `create`, and `list` actions.

To use it, override the class and set the `queryset` and
`serializer_class` attri...
 * @request DELETE:/v1/project/{projectId}/follow/{id}/
 * @secure
 */
    projectFollowDestroy: (
      { id, projectId, ...query }: ProjectFollowDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectFollowDestroyData, any>({
        path: `/v1/project/${projectId}/follow/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectGoalList
     * @request GET:/v1/project/{projectId}/goal/
     * @secure
     */
    projectGoalList: ({ projectId, ...query }: ProjectGoalListParams, params: RequestParams = {}) =>
      this.request<ProjectGoalListData, any>({
        path: `/v1/project/${projectId}/goal/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectGoalCreate
     * @request POST:/v1/project/{projectId}/goal/
     * @secure
     */
    projectGoalCreate: (
      { projectId, ...query }: ProjectGoalCreateParams,
      data: GoalRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectGoalCreateData, any>({
        path: `/v1/project/${projectId}/goal/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectGoalRetrieve
     * @request GET:/v1/project/{projectId}/goal/{id}/
     * @secure
     */
    projectGoalRetrieve: (
      { id, projectId, ...query }: ProjectGoalRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectGoalRetrieveData, any>({
        path: `/v1/project/${projectId}/goal/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectGoalUpdate
     * @request PUT:/v1/project/{projectId}/goal/{id}/
     * @secure
     */
    projectGoalUpdate: (
      { id, projectId, ...query }: ProjectGoalUpdateParams,
      data: GoalRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectGoalUpdateData, any>({
        path: `/v1/project/${projectId}/goal/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectGoalPartialUpdate
     * @request PATCH:/v1/project/{projectId}/goal/{id}/
     * @secure
     */
    projectGoalPartialUpdate: (
      { id, projectId, ...query }: ProjectGoalPartialUpdateParams,
      data: PatchedGoalRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectGoalPartialUpdateData, any>({
        path: `/v1/project/${projectId}/goal/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectGoalDestroy
     * @request DELETE:/v1/project/{projectId}/goal/{id}/
     * @secure
     */
    projectGoalDestroy: (
      { id, projectId, ...query }: ProjectGoalDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectGoalDestroyData, any>({
        path: `/v1/project/${projectId}/goal/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectHeaderCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/project/{projectId}/header/
     * @secure
     */
    projectHeaderCreate: (
      { projectId, ...query }: ProjectHeaderCreateParams,
      data: ProjectHeaderCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<ProjectHeaderCreateData, any>({
        path: `/v1/project/${projectId}/header/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectHeaderUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/project/{projectId}/header/{id}/
     * @secure
     */
    projectHeaderUpdate: (
      { id, projectId, ...query }: ProjectHeaderUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectHeaderUpdateData, any>({
        path: `/v1/project/${projectId}/header/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectHeaderPartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/project/{projectId}/header/{id}/
     * @secure
     */
    projectHeaderPartialUpdate: (
      { id, projectId, ...query }: ProjectHeaderPartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectHeaderPartialUpdateData, any>({
        path: `/v1/project/${projectId}/header/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectHeaderDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/project/{projectId}/header/{id}/
     * @secure
     */
    projectHeaderDestroy: (
      { id, projectId, ...query }: ProjectHeaderDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectHeaderDestroyData, any>({
        path: `/v1/project/${projectId}/header/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectHistoryList
     * @request GET:/v1/project/{projectId}/history/
     * @secure
     */
    projectHistoryList: (
      { projectId, ...query }: ProjectHistoryListParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectHistoryListData, any>({
        path: `/v1/project/${projectId}/history/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectHistoryRetrieve
     * @request GET:/v1/project/{projectId}/history/{id}/
     * @secure
     */
    projectHistoryRetrieve: (
      { id, projectId, ...query }: ProjectHistoryRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectHistoryRetrieveData, any>({
        path: `/v1/project/${projectId}/history/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectImageCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/project/{projectId}/image/
     * @secure
     */
    projectImageCreate: (
      { projectId, ...query }: ProjectImageCreateParams,
      data: ProjectImageCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<ProjectImageCreateData, any>({
        path: `/v1/project/${projectId}/image/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/project/{projectId}/image/{id}/
     * @secure
     */
    projectImageRetrieve: (
      { id, projectId, ...query }: ProjectImageRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectImageRetrieveData, any>({
        path: `/v1/project/${projectId}/image/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectImageUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/project/{projectId}/image/{id}/
     * @secure
     */
    projectImageUpdate: (
      { id, projectId, ...query }: ProjectImageUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectImageUpdateData, any>({
        path: `/v1/project/${projectId}/image/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectImagePartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/project/{projectId}/image/{id}/
     * @secure
     */
    projectImagePartialUpdate: (
      { id, projectId, ...query }: ProjectImagePartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectImagePartialUpdateData, any>({
        path: `/v1/project/${projectId}/image/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/project/{projectId}/image/{id}/
     * @secure
     */
    projectImageDestroy: (
      { id, projectId, ...query }: ProjectImageDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectImageDestroyData, any>({
        path: `/v1/project/${projectId}/image/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectLinkList
     * @request GET:/v1/project/{projectId}/link/
     * @secure
     */
    projectLinkList: ({ projectId, ...query }: ProjectLinkListParams, params: RequestParams = {}) =>
      this.request<ProjectLinkListData, any>({
        path: `/v1/project/${projectId}/link/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectLinkCreate
     * @request POST:/v1/project/{projectId}/link/
     * @secure
     */
    projectLinkCreate: (
      { projectId, ...query }: ProjectLinkCreateParams,
      data: AttachmentLinkRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLinkCreateData, any>({
        path: `/v1/project/${projectId}/link/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectLinkRetrieve
     * @request GET:/v1/project/{projectId}/link/{id}/
     * @secure
     */
    projectLinkRetrieve: (
      { id, projectId, ...query }: ProjectLinkRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLinkRetrieveData, any>({
        path: `/v1/project/${projectId}/link/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectLinkUpdate
     * @request PUT:/v1/project/{projectId}/link/{id}/
     * @secure
     */
    projectLinkUpdate: (
      { id, projectId, ...query }: ProjectLinkUpdateParams,
      data: AttachmentLinkRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLinkUpdateData, any>({
        path: `/v1/project/${projectId}/link/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectLinkPartialUpdate
     * @request PATCH:/v1/project/{projectId}/link/{id}/
     * @secure
     */
    projectLinkPartialUpdate: (
      { id, projectId, ...query }: ProjectLinkPartialUpdateParams,
      data: PatchedAttachmentLinkRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLinkPartialUpdateData, any>({
        path: `/v1/project/${projectId}/link/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectLinkDestroy
     * @request DELETE:/v1/project/{projectId}/link/{id}/
     * @secure
     */
    projectLinkDestroy: (
      { id, projectId, ...query }: ProjectLinkDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLinkDestroyData, any>({
        path: `/v1/project/${projectId}/link/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectLinkedProjectCreate
     * @request POST:/v1/project/{projectId}/linked-project/
     * @secure
     */
    projectLinkedProjectCreate: (
      { projectId, ...query }: ProjectLinkedProjectCreateParams,
      data: LinkedProjectRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLinkedProjectCreateData, any>({
        path: `/v1/project/${projectId}/linked-project/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectLinkedProjectPartialUpdate
     * @request PATCH:/v1/project/{projectId}/linked-project/{id}/
     * @secure
     */
    projectLinkedProjectPartialUpdate: (
      { id, projectId, ...query }: ProjectLinkedProjectPartialUpdateParams,
      data: PatchedLinkedProjectRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLinkedProjectPartialUpdateData, any>({
        path: `/v1/project/${projectId}/linked-project/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectLinkedProjectDestroy
     * @request DELETE:/v1/project/{projectId}/linked-project/{id}/
     * @secure
     */
    projectLinkedProjectDestroy: (
      { id, projectId, ...query }: ProjectLinkedProjectDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLinkedProjectDestroyData, any>({
        path: `/v1/project/${projectId}/linked-project/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Link projects to a given project.
     *
     * @tags project
     * @name ProjectLinkedProjectAddManyCreate
     * @summary Link projects to a given project.
     * @request POST:/v1/project/{projectId}/linked-project/add-many/
     * @secure
     */
    projectLinkedProjectAddManyCreate: (
      { projectId, ...query }: ProjectLinkedProjectAddManyCreateParams,
      data: ProjectAddLinkedProjectRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLinkedProjectAddManyCreateData, any>({
        path: `/v1/project/${projectId}/linked-project/add-many/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Unlink projects from another projects.
     *
     * @tags project
     * @name ProjectLinkedProjectDeleteManyDestroy
     * @summary Unlink projects from another projects.
     * @request DELETE:/v1/project/{projectId}/linked-project/delete-many/
     * @secure
     */
    projectLinkedProjectDeleteManyDestroy: (
      { id, projectId, ...query }: ProjectLinkedProjectDeleteManyDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLinkedProjectDeleteManyDestroyData, any>({
        path: `/v1/project/${projectId}/linked-project/delete-many/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectLocationList
     * @request GET:/v1/project/{projectId}/location/
     * @secure
     */
    projectLocationList: (
      { projectId, ...query }: ProjectLocationListParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLocationListData, any>({
        path: `/v1/project/${projectId}/location/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectLocationCreate
     * @request POST:/v1/project/{projectId}/location/
     * @secure
     */
    projectLocationCreate: (
      { projectId, ...query }: ProjectLocationCreateParams,
      data: LocationRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLocationCreateData, any>({
        path: `/v1/project/${projectId}/location/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectLocationRetrieve
     * @request GET:/v1/project/{projectId}/location/{id}/
     * @secure
     */
    projectLocationRetrieve: (
      { id, projectId, ...query }: ProjectLocationRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLocationRetrieveData, any>({
        path: `/v1/project/${projectId}/location/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectLocationUpdate
     * @request PUT:/v1/project/{projectId}/location/{id}/
     * @secure
     */
    projectLocationUpdate: (
      { id, projectId, ...query }: ProjectLocationUpdateParams,
      data: LocationRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLocationUpdateData, any>({
        path: `/v1/project/${projectId}/location/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectLocationPartialUpdate
     * @request PATCH:/v1/project/{projectId}/location/{id}/
     * @secure
     */
    projectLocationPartialUpdate: (
      { id, projectId, ...query }: ProjectLocationPartialUpdateParams,
      data: PatchedLocationRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLocationPartialUpdateData, any>({
        path: `/v1/project/${projectId}/location/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectLocationDestroy
     * @request DELETE:/v1/project/{projectId}/location/{id}/
     * @secure
     */
    projectLocationDestroy: (
      { id, projectId, ...query }: ProjectLocationDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectLocationDestroyData, any>({
        path: `/v1/project/${projectId}/location/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectProjectMessageList
     * @request GET:/v1/project/{projectId}/project-message/
     * @secure
     */
    projectProjectMessageList: (
      { projectId, ...query }: ProjectProjectMessageListParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectProjectMessageListData, any>({
        path: `/v1/project/${projectId}/project-message/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectProjectMessageCreate
     * @request POST:/v1/project/{projectId}/project-message/
     * @secure
     */
    projectProjectMessageCreate: (
      { projectId, ...query }: ProjectProjectMessageCreateParams,
      data: ProjectMessageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectProjectMessageCreateData, any>({
        path: `/v1/project/${projectId}/project-message/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectProjectMessageImageCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/project/{projectId}/project-message-image/
     * @secure
     */
    projectProjectMessageImageCreate: (
      { projectId, ...query }: ProjectProjectMessageImageCreateParams,
      data: ProjectProjectMessageImageCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<ProjectProjectMessageImageCreateData, any>({
        path: `/v1/project/${projectId}/project-message-image/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectProjectMessageImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/project/{projectId}/project-message-image/{id}/
     * @secure
     */
    projectProjectMessageImageRetrieve: (
      { id, projectId, ...query }: ProjectProjectMessageImageRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectProjectMessageImageRetrieveData, any>({
        path: `/v1/project/${projectId}/project-message-image/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectProjectMessageImageUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/project/{projectId}/project-message-image/{id}/
     * @secure
     */
    projectProjectMessageImageUpdate: (
      { id, projectId, ...query }: ProjectProjectMessageImageUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectProjectMessageImageUpdateData, any>({
        path: `/v1/project/${projectId}/project-message-image/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectProjectMessageImagePartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/project/{projectId}/project-message-image/{id}/
     * @secure
     */
    projectProjectMessageImagePartialUpdate: (
      { id, projectId, ...query }: ProjectProjectMessageImagePartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectProjectMessageImagePartialUpdateData, any>({
        path: `/v1/project/${projectId}/project-message-image/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectProjectMessageImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/project/{projectId}/project-message-image/{id}/
     * @secure
     */
    projectProjectMessageImageDestroy: (
      { id, projectId, ...query }: ProjectProjectMessageImageDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectProjectMessageImageDestroyData, any>({
        path: `/v1/project/${projectId}/project-message-image/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectProjectMessageRetrieve
     * @request GET:/v1/project/{projectId}/project-message/{id}/
     * @secure
     */
    projectProjectMessageRetrieve: (
      { id, projectId, ...query }: ProjectProjectMessageRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectProjectMessageRetrieveData, any>({
        path: `/v1/project/${projectId}/project-message/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectProjectMessageUpdate
     * @request PUT:/v1/project/{projectId}/project-message/{id}/
     * @secure
     */
    projectProjectMessageUpdate: (
      { id, projectId, ...query }: ProjectProjectMessageUpdateParams,
      data: ProjectMessageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectProjectMessageUpdateData, any>({
        path: `/v1/project/${projectId}/project-message/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectProjectMessagePartialUpdate
     * @request PATCH:/v1/project/{projectId}/project-message/{id}/
     * @secure
     */
    projectProjectMessagePartialUpdate: (
      { id, projectId, ...query }: ProjectProjectMessagePartialUpdateParams,
      data: PatchedProjectMessageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectProjectMessagePartialUpdateData, any>({
        path: `/v1/project/${projectId}/project-message/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectProjectMessageDestroy
     * @request DELETE:/v1/project/{projectId}/project-message/{id}/
     * @secure
     */
    projectProjectMessageDestroy: (
      { id, projectId, ...query }: ProjectProjectMessageDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectProjectMessageDestroyData, any>({
        path: `/v1/project/${projectId}/project-message/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectReviewList
     * @request GET:/v1/project/{projectId}/review/
     * @secure
     */
    projectReviewList: (
      { projectId, ...query }: ProjectReviewListParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectReviewListData, any>({
        path: `/v1/project/${projectId}/review/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectReviewCreate
     * @request POST:/v1/project/{projectId}/review/
     * @secure
     */
    projectReviewCreate: (
      { projectId, ...query }: ProjectReviewCreateParams,
      data: ReviewRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectReviewCreateData, any>({
        path: `/v1/project/${projectId}/review/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectReviewRetrieve
     * @request GET:/v1/project/{projectId}/review/{id}/
     * @secure
     */
    projectReviewRetrieve: (
      { id, projectId, ...query }: ProjectReviewRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectReviewRetrieveData, any>({
        path: `/v1/project/${projectId}/review/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectReviewUpdate
     * @request PUT:/v1/project/{projectId}/review/{id}/
     * @secure
     */
    projectReviewUpdate: (
      { id, projectId, ...query }: ProjectReviewUpdateParams,
      data: ReviewRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectReviewUpdateData, any>({
        path: `/v1/project/${projectId}/review/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectReviewPartialUpdate
     * @request PATCH:/v1/project/{projectId}/review/{id}/
     * @secure
     */
    projectReviewPartialUpdate: (
      { id, projectId, ...query }: ProjectReviewPartialUpdateParams,
      data: PatchedReviewRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectReviewPartialUpdateData, any>({
        path: `/v1/project/${projectId}/review/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags project
     * @name ProjectReviewDestroy
     * @request DELETE:/v1/project/{projectId}/review/{id}/
     * @secure
     */
    projectReviewDestroy: (
      { id, projectId, ...query }: ProjectReviewDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectReviewDestroyData, any>({
        path: `/v1/project/${projectId}/review/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabList
     * @summary Project tabs.
     * @request GET:/v1/project/{projectId}/tab/
     * @secure
     */
    projectTabList: ({ projectId, ...query }: ProjectTabListParams, params: RequestParams = {}) =>
      this.request<ProjectTabListData, any>({
        path: `/v1/project/${projectId}/tab/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabCreate
     * @summary Project tabs.
     * @request POST:/v1/project/{projectId}/tab/
     * @secure
     */
    projectTabCreate: (
      { projectId, ...query }: ProjectTabCreateParams,
      data: ProjectTabRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabCreateData, any>({
        path: `/v1/project/${projectId}/tab/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectTabImageCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/project/{projectId}/tab-image/
     * @secure
     */
    projectTabImageCreate: (
      { projectId, ...query }: ProjectTabImageCreateParams,
      data: ProjectTabImageCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabImageCreateData, any>({
        path: `/v1/project/${projectId}/tab-image/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectTabImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/project/{projectId}/tab-image/{id}/
     * @secure
     */
    projectTabImageRetrieve: (
      { id, projectId, ...query }: ProjectTabImageRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabImageRetrieveData, any>({
        path: `/v1/project/${projectId}/tab-image/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectTabImageUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/project/{projectId}/tab-image/{id}/
     * @secure
     */
    projectTabImageUpdate: (
      { id, projectId, ...query }: ProjectTabImageUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabImageUpdateData, any>({
        path: `/v1/project/${projectId}/tab-image/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectTabImagePartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/project/{projectId}/tab-image/{id}/
     * @secure
     */
    projectTabImagePartialUpdate: (
      { id, projectId, ...query }: ProjectTabImagePartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabImagePartialUpdateData, any>({
        path: `/v1/project/${projectId}/tab-image/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectTabImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/project/{projectId}/tab-image/{id}/
     * @secure
     */
    projectTabImageDestroy: (
      { id, projectId, ...query }: ProjectTabImageDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabImageDestroyData, any>({
        path: `/v1/project/${projectId}/tab-image/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabRetrieve
     * @summary Project tabs.
     * @request GET:/v1/project/{projectId}/tab/{id}/
     * @secure
     */
    projectTabRetrieve: (
      { id, projectId, ...query }: ProjectTabRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabRetrieveData, any>({
        path: `/v1/project/${projectId}/tab/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabUpdate
     * @summary Project tabs.
     * @request PUT:/v1/project/{projectId}/tab/{id}/
     * @secure
     */
    projectTabUpdate: (
      { id, projectId, ...query }: ProjectTabUpdateParams,
      data: ProjectTabRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabUpdateData, any>({
        path: `/v1/project/${projectId}/tab/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabPartialUpdate
     * @summary Project tabs.
     * @request PATCH:/v1/project/{projectId}/tab/{id}/
     * @secure
     */
    projectTabPartialUpdate: (
      { id, projectId, ...query }: ProjectTabPartialUpdateParams,
      data: PatchedProjectTabRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabPartialUpdateData, any>({
        path: `/v1/project/${projectId}/tab/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabDestroy
     * @summary Project tabs.
     * @request DELETE:/v1/project/{projectId}/tab/{id}/
     * @secure
     */
    projectTabDestroy: (
      { id, projectId, ...query }: ProjectTabDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabDestroyData, any>({
        path: `/v1/project/${projectId}/tab/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabItemList
     * @summary Project tabs.
     * @request GET:/v1/project/{projectId}/tab/{tabId}/item/
     * @secure
     */
    projectTabItemList: (
      { projectId, tabId, ...query }: ProjectTabItemListParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabItemListData, any>({
        path: `/v1/project/${projectId}/tab/${tabId}/item/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabItemCreate
     * @summary Project tabs.
     * @request POST:/v1/project/{projectId}/tab/{tabId}/item/
     * @secure
     */
    projectTabItemCreate: (
      { projectId, tabId, ...query }: ProjectTabItemCreateParams,
      data: ProjectTabItemRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabItemCreateData, any>({
        path: `/v1/project/${projectId}/tab/${tabId}/item/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectTabItemImageCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/project/{projectId}/tab/{tabId}/item-image/
     * @secure
     */
    projectTabItemImageCreate: (
      { projectId, tabId, ...query }: ProjectTabItemImageCreateParams,
      data: ProjectTabItemImageCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabItemImageCreateData, any>({
        path: `/v1/project/${projectId}/tab/${tabId}/item-image/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectTabItemImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/project/{projectId}/tab/{tabId}/item-image/{id}/
     * @secure
     */
    projectTabItemImageRetrieve: (
      { id, projectId, tabId, ...query }: ProjectTabItemImageRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabItemImageRetrieveData, any>({
        path: `/v1/project/${projectId}/tab/${tabId}/item-image/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectTabItemImageUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/project/{projectId}/tab/{tabId}/item-image/{id}/
     * @secure
     */
    projectTabItemImageUpdate: (
      { id, projectId, tabId, ...query }: ProjectTabItemImageUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabItemImageUpdateData, any>({
        path: `/v1/project/${projectId}/tab/${tabId}/item-image/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectTabItemImagePartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/project/{projectId}/tab/{tabId}/item-image/{id}/
     * @secure
     */
    projectTabItemImagePartialUpdate: (
      { id, projectId, tabId, ...query }: ProjectTabItemImagePartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabItemImagePartialUpdateData, any>({
        path: `/v1/project/${projectId}/tab/${tabId}/item-image/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectTabItemImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/project/{projectId}/tab/{tabId}/item-image/{id}/
     * @secure
     */
    projectTabItemImageDestroy: (
      { id, projectId, tabId, ...query }: ProjectTabItemImageDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabItemImageDestroyData, any>({
        path: `/v1/project/${projectId}/tab/${tabId}/item-image/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabItemRetrieve
     * @summary Project tabs.
     * @request GET:/v1/project/{projectId}/tab/{tabId}/item/{id}/
     * @secure
     */
    projectTabItemRetrieve: (
      { id, projectId, tabId, ...query }: ProjectTabItemRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabItemRetrieveData, any>({
        path: `/v1/project/${projectId}/tab/${tabId}/item/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabItemUpdate
     * @summary Project tabs.
     * @request PUT:/v1/project/{projectId}/tab/{tabId}/item/{id}/
     * @secure
     */
    projectTabItemUpdate: (
      { id, projectId, tabId, ...query }: ProjectTabItemUpdateParams,
      data: ProjectTabItemRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabItemUpdateData, any>({
        path: `/v1/project/${projectId}/tab/${tabId}/item/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabItemPartialUpdate
     * @summary Project tabs.
     * @request PATCH:/v1/project/{projectId}/tab/{tabId}/item/{id}/
     * @secure
     */
    projectTabItemPartialUpdate: (
      { id, projectId, tabId, ...query }: ProjectTabItemPartialUpdateParams,
      data: PatchedProjectTabItemRequest,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabItemPartialUpdateData, any>({
        path: `/v1/project/${projectId}/tab/${tabId}/item/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabItemDestroy
     * @summary Project tabs.
     * @request DELETE:/v1/project/{projectId}/tab/{tabId}/item/{id}/
     * @secure
     */
    projectTabItemDestroy: (
      { id, projectId, tabId, ...query }: ProjectTabItemDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabItemDestroyData, any>({
        path: `/v1/project/${projectId}/tab/${tabId}/item/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
 * @description A viewset that provides `list` action. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags search
 * @name SearchList
 * @summary A viewset that provides `list` action.

To use it, override the class and set the `queryset` and
`serializer_class` attributes.
 * @request GET:/v1/search/
 * @secure
 */
    searchList: (query: SearchListParams, params: RequestParams = {}) =>
      this.request<SearchListData, any>({
        path: `/v1/search/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `list` action. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags search
 * @name SearchList2
 * @summary A viewset that provides `list` action.

To use it, override the class and set the `queryset` and
`serializer_class` attributes.
 * @request GET:/v1/search/{search}/
 * @secure
 */
    searchList2: ({ search, ...query }: SearchList2Params, params: RequestParams = {}) =>
      this.request<SearchList2Data, any>({
        path: `/v1/search/${search}/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags tag
     * @name TagList
     * @request GET:/v1/tag/
     * @secure
     */
    tagList: (query: TagListParams, params: RequestParams = {}) =>
      this.request<TagListData, any>({
        path: `/v1/tag/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags tag
     * @name TagRetrieve
     * @request GET:/v1/tag/{id}/
     * @secure
     */
    tagRetrieve: ({ id, ...query }: TagRetrieveParams, params: RequestParams = {}) =>
      this.request<TagRetrieveData, any>({
        path: `/v1/tag/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserList
     * @request GET:/v1/user/
     * @secure
     */
    userList: (query: UserListParams, params: RequestParams = {}) =>
      this.request<UserListData, any>({
        path: `/v1/user/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserCreate
     * @request POST:/v1/user/
     * @secure
     */
    userCreate: (data: UserRequest, params: RequestParams = {}) =>
      this.request<UserCreateData, any>({
        path: `/v1/user/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserRetrieve
     * @request GET:/v1/user/{id}/
     * @secure
     */
    userRetrieve: ({ id, ...query }: UserRetrieveParams, params: RequestParams = {}) =>
      this.request<UserRetrieveData, any>({
        path: `/v1/user/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserUpdate
     * @request PUT:/v1/user/{id}/
     * @secure
     */
    userUpdate: (
      { id, ...query }: UserUpdateParams,
      data: UserRequest,
      params: RequestParams = {}
    ) =>
      this.request<UserUpdateData, any>({
        path: `/v1/user/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserPartialUpdate
     * @request PATCH:/v1/user/{id}/
     * @secure
     */
    userPartialUpdate: (
      { id, ...query }: UserPartialUpdateParams,
      data: PatchedUserRequest,
      params: RequestParams = {}
    ) =>
      this.request<UserPartialUpdateData, any>({
        path: `/v1/user/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserDestroy
     * @request DELETE:/v1/user/{id}/
     * @secure
     */
    userDestroy: ({ id, ...query }: UserDestroyParams, params: RequestParams = {}) =>
      this.request<UserDestroyData, any>({
        path: `/v1/user/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserHasPermissionsRetrieve
     * @request GET:/v1/user/{id}/has_permissions/
     * @secure
     */
    userHasPermissionsRetrieve: (
      { id, ...query }: UserHasPermissionsRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<UserHasPermissionsRetrieveData, any>({
        path: `/v1/user/${id}/has_permissions/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserRefreshKeycloakActionsLinkRetrieve
     * @request GET:/v1/user/{id}/refresh-keycloak-actions-link/
     * @secure
     */
    userRefreshKeycloakActionsLinkRetrieve: (
      { id, ...query }: UserRefreshKeycloakActionsLinkRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<UserRefreshKeycloakActionsLinkRetrieveData, any>({
        path: `/v1/user/${id}/refresh-keycloak-actions-link/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserResetPasswordRetrieve
     * @request GET:/v1/user/{id}/reset-password/
     * @secure
     */
    userResetPasswordRetrieve: (
      { id, ...query }: UserResetPasswordRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<UserResetPasswordRetrieveData, any>({
        path: `/v1/user/${id}/reset-password/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `retrieve`, `create`, and `list` actions. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags user
 * @name UserFollowList
 * @summary A viewset that provides `retrieve`, `create`, and `list` actions.

To use it, override the class and set the `queryset` and
`serializer_class` attri...
 * @request GET:/v1/user/{userId}/follow/
 * @secure
 */
    userFollowList: ({ userId, ...query }: UserFollowListParams, params: RequestParams = {}) =>
      this.request<UserFollowListData, any>({
        path: `/v1/user/${userId}/follow/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `retrieve`, `create`, and `list` actions. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags user
 * @name UserFollowCreate
 * @summary A viewset that provides `retrieve`, `create`, and `list` actions.

To use it, override the class and set the `queryset` and
`serializer_class` attri...
 * @request POST:/v1/user/{userId}/follow/
 * @secure
 */
    userFollowCreate: (
      { userId, ...query }: UserFollowCreateParams,
      data: FollowRequest,
      params: RequestParams = {}
    ) =>
      this.request<UserFollowCreateData, any>({
        path: `/v1/user/${userId}/follow/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `retrieve`, `create`, and `list` actions. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags user
 * @name UserFollowDestroy
 * @summary A viewset that provides `retrieve`, `create`, and `list` actions.

To use it, override the class and set the `queryset` and
`serializer_class` attri...
 * @request DELETE:/v1/user/{userId}/follow/{id}/
 * @secure
 */
    userFollowDestroy: (
      { id, userId, ...query }: UserFollowDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<UserFollowDestroyData, any>({
        path: `/v1/user/${userId}/follow/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
 * @description A viewset that provides `retrieve`, `create`, and `list` actions. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags user
 * @name UserFollowFollowManyCreate
 * @summary A viewset that provides `retrieve`, `create`, and `list` actions.

To use it, override the class and set the `queryset` and
`serializer_class` attri...
 * @request POST:/v1/user/{userId}/follow/follow-many/
 * @secure
 */
    userFollowFollowManyCreate: (
      { userId, ...query }: UserFollowFollowManyCreateParams,
      data: UserFollowManyRequest,
      params: RequestParams = {}
    ) =>
      this.request<UserFollowFollowManyCreateData, any>({
        path: `/v1/user/${userId}/follow/follow-many/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags user
     * @name UserProfilePictureCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/user/{userId}/profile-picture/
     * @secure
     */
    userProfilePictureCreate: (
      { userId, ...query }: UserProfilePictureCreateParams,
      data: UserProfilePictureCreatePayload,
      params: RequestParams = {}
    ) =>
      this.request<UserProfilePictureCreateData, any>({
        path: `/v1/user/${userId}/profile-picture/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags user
     * @name UserProfilePictureUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/user/{userId}/profile-picture/{id}/
     * @secure
     */
    userProfilePictureUpdate: (
      { id, userId, ...query }: UserProfilePictureUpdateParams,
      data: ImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<UserProfilePictureUpdateData, any>({
        path: `/v1/user/${userId}/profile-picture/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags user
     * @name UserProfilePicturePartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/user/{userId}/profile-picture/{id}/
     * @secure
     */
    userProfilePicturePartialUpdate: (
      { id, userId, ...query }: UserProfilePicturePartialUpdateParams,
      data: PatchedImageRequest,
      params: RequestParams = {}
    ) =>
      this.request<UserProfilePicturePartialUpdateData, any>({
        path: `/v1/user/${userId}/profile-picture/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: 'json',
        ...params,
      }),

    /**
     * @description Allows the upload of images.
     *
     * @tags user
     * @name UserProfilePictureDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/user/{userId}/profile-picture/{id}/
     * @secure
     */
    userProfilePictureDestroy: (
      { id, userId, ...query }: UserProfilePictureDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<UserProfilePictureDestroyData, any>({
        path: `/v1/user/${userId}/profile-picture/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserReviewList
     * @request GET:/v1/user/{userId}/review/
     * @secure
     */
    userReviewList: ({ userId, ...query }: UserReviewListParams, params: RequestParams = {}) =>
      this.request<UserReviewListData, any>({
        path: `/v1/user/${userId}/review/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserReviewCreate
     * @request POST:/v1/user/{userId}/review/
     * @secure
     */
    userReviewCreate: (
      { userId, ...query }: UserReviewCreateParams,
      data: ReviewRequest,
      params: RequestParams = {}
    ) =>
      this.request<UserReviewCreateData, any>({
        path: `/v1/user/${userId}/review/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserReviewRetrieve
     * @request GET:/v1/user/{userId}/review/{id}/
     * @secure
     */
    userReviewRetrieve: (
      { id, userId, ...query }: UserReviewRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<UserReviewRetrieveData, any>({
        path: `/v1/user/${userId}/review/${id}/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserReviewUpdate
     * @request PUT:/v1/user/{userId}/review/{id}/
     * @secure
     */
    userReviewUpdate: (
      { id, userId, ...query }: UserReviewUpdateParams,
      data: ReviewRequest,
      params: RequestParams = {}
    ) =>
      this.request<UserReviewUpdateData, any>({
        path: `/v1/user/${userId}/review/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserReviewPartialUpdate
     * @request PATCH:/v1/user/{userId}/review/{id}/
     * @secure
     */
    userReviewPartialUpdate: (
      { id, userId, ...query }: UserReviewPartialUpdateParams,
      data: PatchedReviewRequest,
      params: RequestParams = {}
    ) =>
      this.request<UserReviewPartialUpdateData, any>({
        path: `/v1/user/${userId}/review/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserReviewDestroy
     * @request DELETE:/v1/user/{userId}/review/{id}/
     * @secure
     */
    userReviewDestroy: (
      { id, userId, ...query }: UserReviewDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<UserReviewDestroyData, any>({
        path: `/v1/user/${userId}/review/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
 * @description A viewset that provides `create` and `update` actions. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags user
 * @name UserSkillCreate
 * @summary A viewset that provides `create` and `update` actions.

To use it, override the class and set the `queryset` and
`serializer_class` attributes.
 * @request POST:/v1/user/{userId}/skill/
 * @secure
 */
    userSkillCreate: (
      { userId, ...query }: UserSkillCreateParams,
      data: SkillRequest,
      params: RequestParams = {}
    ) =>
      this.request<UserSkillCreateData, any>({
        path: `/v1/user/${userId}/skill/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `create` and `update` actions. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags user
 * @name UserSkillUpdate
 * @summary A viewset that provides `create` and `update` actions.

To use it, override the class and set the `queryset` and
`serializer_class` attributes.
 * @request PUT:/v1/user/{userId}/skill/{id}/
 * @secure
 */
    userSkillUpdate: (
      { id, userId, ...query }: UserSkillUpdateParams,
      data: SkillRequest,
      params: RequestParams = {}
    ) =>
      this.request<UserSkillUpdateData, any>({
        path: `/v1/user/${userId}/skill/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `create` and `update` actions. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags user
 * @name UserSkillPartialUpdate
 * @summary A viewset that provides `create` and `update` actions.

To use it, override the class and set the `queryset` and
`serializer_class` attributes.
 * @request PATCH:/v1/user/{userId}/skill/{id}/
 * @secure
 */
    userSkillPartialUpdate: (
      { id, userId, ...query }: UserSkillPartialUpdateParams,
      data: PatchedSkillRequest,
      params: RequestParams = {}
    ) =>
      this.request<UserSkillPartialUpdateData, any>({
        path: `/v1/user/${userId}/skill/${id}/`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
 * @description A viewset that provides `create` and `update` actions. To use it, override the class and set the `queryset` and `serializer_class` attributes.
 *
 * @tags user
 * @name UserSkillDestroy
 * @summary A viewset that provides `create` and `update` actions.

To use it, override the class and set the `queryset` and
`serializer_class` attributes.
 * @request DELETE:/v1/user/{userId}/skill/{id}/
 * @secure
 */
    userSkillDestroy: (
      { id, userId, ...query }: UserSkillDestroyParams,
      params: RequestParams = {}
    ) =>
      this.request<UserSkillDestroyData, any>({
        path: `/v1/user/${userId}/skill/${id}/`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserAdminListRetrieve
     * @request GET:/v1/user/admin-list/
     * @secure
     */
    userAdminListRetrieve: (query: UserAdminListRetrieveParams, params: RequestParams = {}) =>
      this.request<UserAdminListRetrieveData, any>({
        path: `/v1/user/admin-list/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserAnonymousRetrieve
     * @request GET:/v1/user/anonymous/
     * @secure
     */
    userAnonymousRetrieve: (params: RequestParams = {}) =>
      this.request<UserAnonymousRetrieveData, any>({
        path: `/v1/user/anonymous/`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserGetByEmailRetrieve
     * @request GET:/v1/user/get-by-email/{email}/
     * @secure
     */
    userGetByEmailRetrieve: (
      { email, ...query }: UserGetByEmailRetrieveParams,
      params: RequestParams = {}
    ) =>
      this.request<UserGetByEmailRetrieveData, any>({
        path: `/v1/user/get-by-email/${email}/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserRemoveAuthenticationCookieRetrieve
     * @request GET:/v1/user/remove-authentication-cookie
     * @secure
     */
    userRemoveAuthenticationCookieRetrieve: (params: RequestParams = {}) =>
      this.request<UserRemoveAuthenticationCookieRetrieveData, any>({
        path: `/v1/user/remove-authentication-cookie`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags user
     * @name UserResetPasswordCreate
     * @request POST:/v1/user/reset-password/
     * @secure
     */
    userResetPasswordCreate: (data: EmailAddressRequest, params: RequestParams = {}) =>
      this.request<UserResetPasswordCreateData, any>({
        path: `/v1/user/reset-password/`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  }
}
