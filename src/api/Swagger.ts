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

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface AccessRequest {
  /** @format date-time */
  created_at: string
  /** @maxLength 255 */
  email?: string
  /** @maxLength 255 */
  family_name?: string
  /** @maxLength 255 */
  given_name?: string
  id: number
  /** @maxLength 255 */
  job?: string
  message?: string
  message_ca: string | null
  message_de: string | null
  message_detected_language: string | null
  message_en: string | null
  message_es: string | null
  message_et: string | null
  message_fr: string | null
  message_nl: string | null
  organization: string
  status: AccessStatusEnum
  /** @format uuid */
  user: string | null
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
  /** @maxLength 255 */
  email?: string
  /** @maxLength 255 */
  family_name?: string
  /** @maxLength 255 */
  given_name?: string
  /** @maxLength 255 */
  job?: string
  message?: string
  /** @minLength 1 */
  organization: string
  /** @format uuid */
  user: string | null
}

export interface AccessRequestResult {
  /** @format email */
  email: string
  id: number
  message: string
}

export enum AccessStatusEnum {
  Pending = 'pending',
  Accepted = 'accepted',
  Declined = 'declined',
}

export interface AccessToken {
  /** @maxLength 2048 */
  access_token: string
  expires_in: number
  refresh_expires_in: number
  /** @maxLength 2048 */
  refresh_token: string
  /** @maxLength 255 */
  scope: string
  /** @maxLength 255 */
  session_state: string
  /** @maxLength 255 */
  token_type: string
}

export type AccessTokenCreateData = AccessToken

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Announcement {
  /** @format date-time */
  created_at: string
  /** @format date */
  deadline?: string | null
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  id: number
  is_remunerated?: boolean
  project: ProjectAnnouncement
  status?: AnnouncementStatusEnum
  /** @maxLength 100 */
  title: string
  title_ca: string | null
  title_de: string | null
  title_detected_language: string | null
  title_en: string | null
  title_es: string | null
  title_et: string | null
  title_fr: string | null
  title_nl: string | null
  type?: AnnouncementTypeEnum
  /** @format date-time */
  updated_at: string
}

export type AnnouncementListData = PaginatedAnnouncementList

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface AnnouncementRequest {
  /** @format date */
  deadline?: string | null
  description?: string
  is_remunerated?: boolean
  /** @minLength 1 */
  project_id: string
  status?: AnnouncementStatusEnum
  /**
   * @minLength 1
   * @maxLength 100
   */
  title: string
  type?: AnnouncementTypeEnum
}

export type AnnouncementRetrieveData = Announcement

export enum AnnouncementStatusEnum {
  Open = 'open',
  Closed = 'closed',
}

export enum AnnouncementTypeEnum {
  Na = 'na',
  Participant = 'participant',
  Job = 'job',
  Traineeship = 'traineeship',
}

export type ApiSchemaRetrieveData = Record<string, any>

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ApplyToAnnouncementRequest {
  announcement_id: number
  /**
   * @format email
   * @minLength 1
   */
  applicant_email: string
  /** @minLength 1 */
  applicant_firstname: string
  /** @minLength 1 */
  applicant_message: string
  /** @minLength 1 */
  applicant_name: string
  /** @minLength 1 */
  project_id: string
  /** @minLength 1 */
  recaptcha: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface AttachmentFile {
  attachment_type?: AttachmentTypeEnum
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  /** @format uri */
  file: string
  id: number
  /** @maxLength 100 */
  mime: string
  /** @maxLength 255 */
  title: string
  title_ca: string | null
  title_de: string | null
  title_detected_language: string | null
  title_en: string | null
  title_es: string | null
  title_et: string | null
  title_fr: string | null
  title_nl: string | null
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface AttachmentFileRequest {
  attachment_type?: AttachmentTypeEnum
  description?: string
  /** @format binary */
  file: File
  /** @minLength 1 */
  hashcode?: string
  /**
   * @minLength 1
   * @maxLength 100
   */
  mime: string
  /** @minLength 1 */
  project_id: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface AttachmentLink {
  attachment_type?: AttachmentTypeEnum
  category?: CategoryEnum
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  id: number
  /**
   * @format uri
   * @maxLength 2048
   */
  preview_image_url: string
  /** @maxLength 255 */
  site_name: string
  /**
   * @format uri
   * @maxLength 2048
   */
  site_url: string
  /** @maxLength 255 */
  title?: string
  title_ca: string | null
  title_de: string | null
  title_detected_language: string | null
  title_en: string | null
  title_es: string | null
  title_et: string | null
  title_fr: string | null
  title_nl: string | null
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface AttachmentLinkRequest {
  attachment_type?: AttachmentTypeEnum
  category?: CategoryEnum
  description?: string
  /** @minLength 1 */
  project_id: string
  /**
   * @format uri
   * @minLength 1
   * @maxLength 2048
   */
  site_url: string
  /** @maxLength 255 */
  title?: string
}

export enum AttachmentTypeEnum {
  File = 'file',
  Image = 'image',
  Video = 'video',
  Link = 'link',
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

export enum BlankEnum {
  Value = '',
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface BlogEntry {
  content?: string
  content_ca: string | null
  content_de: string | null
  content_detected_language: string | null
  content_en: string | null
  content_es: string | null
  content_et: string | null
  content_fr: string | null
  content_nl: string | null
  /** @format date-time */
  created_at: string
  id: number
  images: number[]
  /** @maxLength 255 */
  title: string
  title_ca: string | null
  title_de: string | null
  title_detected_language: string | null
  title_en: string | null
  title_es: string | null
  title_et: string | null
  title_fr: string | null
  title_nl: string | null
  /** @format date-time */
  updated_at: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface BlogEntryRequest {
  content?: string
  images_ids?: number[]
  /** @minLength 1 */
  project_id: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
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

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Comment {
  author: UserLighter
  content?: string
  content_ca: string | null
  content_de: string | null
  content_detected_language: string | null
  content_en: string | null
  content_es: string | null
  content_et: string | null
  content_fr: string | null
  content_nl: string | null
  /** @format date-time */
  created_at: string
  /** @format date-time */
  deleted_at?: string | null
  id: number
  images: number[]
  /** @format date-time */
  updated_at: string
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
  images_ids?: number[]
  /** @minLength 1 */
  project_id: string
  reply_on_id?: number | null
}

export interface Contact {
  content: string
  /** @format email */
  email: string
  subject: string
}

export interface ContactRequest {
  /** @minLength 1 */
  content: string
  /**
   * @format email
   * @minLength 1
   */
  email: string
  /** @minLength 1 */
  subject: string
}

export interface CredentialsRequest {
  /**
   * @minLength 1
   * @maxLength 255
   */
  password: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  username: string
}

export interface Email {
  content?: string
  /** Content [ca] */
  content_ca?: string | null
  /** Content [de] */
  content_de?: string | null
  /** Content [en] */
  content_en?: string | null
  /** Content [es] */
  content_es?: string | null
  /** Content [et] */
  content_et?: string | null
  /** Content [fr] */
  content_fr?: string | null
  /** Content [nl] */
  content_nl?: string | null
  /** @format date-time */
  created_at: string
  id: number
  images?: number[]
  recipients?: number[]
  send_to?: SendToEnum
  sent_to?: number[]
  /** @maxLength 255 */
  subject?: string
  /**
   * Subject [ca]
   * @maxLength 255
   */
  subject_ca?: string | null
  /**
   * Subject [de]
   * @maxLength 255
   */
  subject_de?: string | null
  /**
   * Subject [en]
   * @maxLength 255
   */
  subject_en?: string | null
  /**
   * Subject [es]
   * @maxLength 255
   */
  subject_es?: string | null
  /**
   * Subject [et]
   * @maxLength 255
   */
  subject_et?: string | null
  /**
   * Subject [fr]
   * @maxLength 255
   */
  subject_fr?: string | null
  /**
   * Subject [nl]
   * @maxLength 255
   */
  subject_nl?: string | null
  template?: TemplateEnum
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

export type EmailCreateData = Email

export type EmailDestroyData = any

export type EmailImageCreateData = Image

/** @format binary */
export type EmailImageCreatePayload = File

export type EmailImageDestroyData = any

export type EmailImagePartialUpdateData = Image

export type EmailImageRetrieveData = Image

export type EmailImageUpdateData = Image

export type EmailListData = PaginatedEmailList

export type EmailPartialUpdateData = Email

export interface EmailReport {
  message: string
  /** @format email */
  reported_by: string
  title: string
  /** @format uri */
  url: string
}

export interface EmailReportRequest {
  /** @minLength 1 */
  message: string
  /**
   * @format email
   * @minLength 1
   */
  reported_by: string
  /** @minLength 1 */
  title: string
  /**
   * @format uri
   * @minLength 1
   */
  url: string
}

export interface EmailRequest {
  content?: string
  /**
   * Content [ca]
   * @minLength 1
   */
  content_ca?: string | null
  /**
   * Content [de]
   * @minLength 1
   */
  content_de?: string | null
  /**
   * Content [en]
   * @minLength 1
   */
  content_en?: string | null
  /**
   * Content [es]
   * @minLength 1
   */
  content_es?: string | null
  /**
   * Content [et]
   * @minLength 1
   */
  content_et?: string | null
  /**
   * Content [fr]
   * @minLength 1
   */
  content_fr?: string | null
  /**
   * Content [nl]
   * @minLength 1
   */
  content_nl?: string | null
  images?: number[]
  recipients?: number[]
  send_to?: SendToEnum
  sent_to?: number[]
  /** @maxLength 255 */
  subject?: string
  /**
   * Subject [ca]
   * @minLength 1
   * @maxLength 255
   */
  subject_ca?: string | null
  /**
   * Subject [de]
   * @minLength 1
   * @maxLength 255
   */
  subject_de?: string | null
  /**
   * Subject [en]
   * @minLength 1
   * @maxLength 255
   */
  subject_en?: string | null
  /**
   * Subject [es]
   * @minLength 1
   * @maxLength 255
   */
  subject_es?: string | null
  /**
   * Subject [et]
   * @minLength 1
   * @maxLength 255
   */
  subject_et?: string | null
  /**
   * Subject [fr]
   * @minLength 1
   * @maxLength 255
   */
  subject_fr?: string | null
  /**
   * Subject [nl]
   * @minLength 1
   * @maxLength 255
   */
  subject_nl?: string | null
  template?: TemplateEnum
}

export type EmailRetrieveData = Email

export type EmailUpdateData = Email

export interface EmptyPayloadResponse {
  detail: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Event {
  content?: string
  content_ca: string | null
  content_de: string | null
  content_detected_language: string | null
  content_en: string | null
  content_es: string | null
  content_et: string | null
  content_fr: string | null
  content_nl: string | null
  /** @format date-time */
  created_at: string
  /** @format date-time */
  event_date: string
  id: number
  organization: string
  people_groups: number[]
  /** @maxLength 255 */
  title: string
  /** Title */
  title_ca: string | null
  /** Title */
  title_de: string | null
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_es: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_nl: string | null
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
  /** @format date-time */
  created_at: string
  follower: UserLighter
  id: number
  project: ProjectLight
  /** @format date-time */
  updated_at: string
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
  /** @format date */
  deadline_at?: string | null
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  id: number
  status?: GoalStatusEnum
  /** @maxLength 255 */
  title?: string
  title_ca: string | null
  title_de: string | null
  title_detected_language: string | null
  title_en: string | null
  title_es: string | null
  title_et: string | null
  title_fr: string | null
  title_nl: string | null
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface GoalRequest {
  /** @format date */
  deadline_at?: string | null
  description?: string
  /** @minLength 1 */
  project_id: string
  status?: GoalStatusEnum
  /** @maxLength 255 */
  title?: string
}

export enum GoalStatusEnum {
  Na = 'na',
  Ongoing = 'ongoing',
  Complete = 'complete',
  Cancel = 'cancel',
}

export type GoogleGroupEmailAvailableCreateData = EmailAvailable

export type GoogleOrgUnitsRetrieveData = string[]

export type GoogleUserEmailAvailableCreateData = EmailAvailable

export interface IdentityProvider {
  /** @maxLength 255 */
  alias: string
  enabled?: boolean
  id: number
  logo: Image
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
  /** @format date-time */
  created_at: string
  /**
   * @min -2147483648
   * @max 2147483647
   */
  height?: number | null
  id: number
  /** @format double */
  left?: number | null
  /** @maxLength 255 */
  name: string
  /** @format double */
  natural_ratio?: number | null
  /** @format double */
  scale_x?: number | null
  /** @format double */
  scale_y?: number | null
  /** @format double */
  top?: number | null
  url: string | null
  /** @format uri */
  variations: string
  /**
   * @min -2147483648
   * @max 2147483647
   */
  width?: number | null
}

export interface ImageRequest {
  /** @format binary */
  file: File
  /**
   * @min -2147483648
   * @max 2147483647
   */
  height?: number | null
  /** @format double */
  left?: number | null
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string
  /** @format double */
  natural_ratio?: number | null
  /** @format double */
  scale_x?: number | null
  /** @format double */
  scale_y?: number | null
  /** @format double */
  top?: number | null
  /**
   * @min -2147483648
   * @max 2147483647
   */
  width?: number | null
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Instruction {
  content?: string
  content_ca: string | null
  content_de: string | null
  content_detected_language: string | null
  content_en: string | null
  content_es: string | null
  content_et: string | null
  content_fr: string | null
  content_nl: string | null
  /** @format date-time */
  created_at: string
  has_to_be_notified?: boolean
  id: number
  language?: LanguageEnum
  organization: string
  people_groups: PeopleGroupLight[]
  /** @format date-time */
  publication_date: string
  /** @maxLength 255 */
  title: string
  /** Title */
  title_ca: string | null
  /** Title */
  title_de: string | null
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_es: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_nl: string | null
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
  /** @format date-time */
  created_at: string
  /** @maxLength 255 */
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  /** @format date-time */
  expire_at: string
  id: number
  owner: UserLighter
  people_group: PeopleGroupLight
  /** @format uuid */
  token: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface InvitationRequest {
  /** @maxLength 255 */
  description?: string
  /** @format date-time */
  expire_at: string
  people_group_id: number
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

export enum LanguagesEnum {
  En = 'en',
  Fr = 'fr',
  De = 'de',
  Nl = 'nl',
  Et = 'et',
  Ca = 'ca',
  Es = 'es',
}

export type LanguagesRetrieveData = dict[]

export enum LifeStatusEnum {
  Running = 'running',
  Completed = 'completed',
  Canceled = 'canceled',
  Toreview = 'toreview',
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
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  id: number
  /** @format double */
  lat: number
  /** @format double */
  lng: number
  project: LocationProject
  /** @maxLength 255 */
  title?: string
  title_ca: string | null
  title_de: string | null
  title_detected_language: string | null
  title_en: string | null
  title_es: string | null
  title_et: string | null
  title_fr: string | null
  title_nl: string | null
  type?: LocationTypeEnum
}

export type LocationListData = Location[]

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface LocationProject {
  header_image: Image
  /** @maxLength 8 */
  id?: string
  /** Main goal */
  purpose?: string
  /** Main goal */
  purpose_ca: string | null
  /** Main goal */
  purpose_de: string | null
  purpose_detected_language: string | null
  /** Main goal */
  purpose_en: string | null
  /** Main goal */
  purpose_es: string | null
  /** Main goal */
  purpose_et: string | null
  /** Main goal */
  purpose_fr: string | null
  /** Main goal */
  purpose_nl: string | null
  /**
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /** @maxLength 255 */
  title: string
  /** Title */
  title_ca: string | null
  /** Title */
  title_de: string | null
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_es: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_nl: string | null
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
  /** Main goal */
  purpose?: string
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
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface LocationRequest {
  description?: string
  /** @format double */
  lat: number
  /** @format double */
  lng: number
  /** @minLength 1 */
  project_id: string
  /** @maxLength 255 */
  title?: string
  type?: LocationTypeEnum
}

export type LocationRetrieveData = Location

export enum LocationTypeEnum {
  Team = 'team',
  Impact = 'impact',
}

export interface Mentoring {
  /** @format date-time */
  created_at: string
  created_by: number
  id: number
  mentor: UserLighter
  mentoree: UserLighter
  skill: SkillLight
  status: StatusD3DEnum | NullEnum | null
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
  /** @minLength 1 */
  content: string
  /**
   * @format email
   * @minLength 1
   */
  reply_to?: string | null
  status: StatusD3DEnum
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface News {
  content?: string
  content_ca: string | null
  content_de: string | null
  content_detected_language: string | null
  content_en: string | null
  content_es: string | null
  content_et: string | null
  content_fr: string | null
  content_nl: string | null
  /** @format date-time */
  created_at: string
  header_image: Image
  id: number
  language?: LanguageEnum
  organization: string
  people_groups: number[]
  /** @format date-time */
  publication_date: string
  /** @maxLength 255 */
  title: string
  /** Title */
  title_ca: string | null
  /** Title */
  title_de: string | null
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_es: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_nl: string | null
  /** @format date-time */
  updated_at: string
  visible_by_all?: boolean
}

export interface Newsfeed {
  announcement: Announcement
  id: number
  news: News
  project: ProjectLight
  /** @maxLength 50 */
  type: string
  /** @format date-time */
  updated_at: string
}

export type NotificationListData = PaginatedNotificationsList

export interface NotificationSettings {
  announcement_has_new_application?: boolean
  announcement_published?: boolean
  comment_received_a_response?: boolean
  followed_project_has_been_edited?: boolean
  id: number
  invitation_link_will_expire?: boolean
  new_instruction?: boolean
  notify_added_to_project?: boolean
  organization_has_new_access_request?: boolean
  project_has_been_commented?: boolean
  project_has_been_edited?: boolean
  project_has_been_reviewed?: boolean
  project_has_new_private_message?: boolean
  project_ready_for_review?: boolean
}

export interface NotificationSettingsRequest {
  announcement_has_new_application?: boolean
  announcement_published?: boolean
  comment_received_a_response?: boolean
  followed_project_has_been_edited?: boolean
  invitation_link_will_expire?: boolean
  new_instruction?: boolean
  notify_added_to_project?: boolean
  organization_has_new_access_request?: boolean
  project_has_been_commented?: boolean
  project_has_been_edited?: boolean
  project_has_been_reviewed?: boolean
  project_has_new_private_message?: boolean
  project_ready_for_review?: boolean
}

/** Automatically translate model fields for model with registered translation */
export interface Notifications {
  context: Record<string, any>
  count: number
  /** @format date-time */
  created: string
  id: number
  invitation: Invitation
  is_viewed?: boolean
  organization: string
  project: ProjectSuperLight
  sender: UserLighter
  type: NotificationsTypeEnum
}

export type NotificationsSettingPartialUpdateData = NotificationSettings

export type NotificationsSettingRetrieveData = NotificationSettings

export type NotificationsSettingUpdateData = NotificationSettings

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

export type NullEnum = null

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Organization {
  access_request_enabled?: boolean
  attachment_files_count: number
  /** @maxLength 9 */
  background_color?: string
  banner_image: Image
  /** @maxLength 255 */
  chat_button_text?: string
  chat_button_text_ca: string | null
  chat_button_text_de: string | null
  chat_button_text_detected_language: string | null
  chat_button_text_en: string | null
  chat_button_text_es: string | null
  chat_button_text_et: string | null
  chat_button_text_fr: string | null
  chat_button_text_nl: string | null
  /**
   * @format uri
   * @maxLength 255
   */
  chat_url?: string
  children: string[]
  /** @maxLength 50 */
  code: string
  /**
   * @format email
   * @maxLength 255
   */
  contact_email?: string
  /** @format date-time */
  created_at: string
  /** @maxLength 255 */
  dashboard_subtitle: string
  dashboard_subtitle_ca: string | null
  dashboard_subtitle_de: string | null
  dashboard_subtitle_detected_language: string | null
  dashboard_subtitle_en: string | null
  dashboard_subtitle_es: string | null
  dashboard_subtitle_et: string | null
  dashboard_subtitle_fr: string | null
  dashboard_subtitle_nl: string | null
  /** @maxLength 255 */
  dashboard_title: string
  dashboard_title_ca: string | null
  dashboard_title_de: string | null
  dashboard_title_detected_language: string | null
  dashboard_title_en: string | null
  dashboard_title_es: string | null
  dashboard_title_et: string | null
  dashboard_title_fr: string | null
  dashboard_title_nl: string | null
  default_projects_tag_classification?: string
  default_projects_tags?: string[]
  default_skills_tag_classification?: string
  default_skills_tags?: string[]
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  enabled_projects_tag_classifications?: string[]
  enabled_skills_tag_classifications?: string[]
  force_login_form_display?: boolean
  google_sync_enabled: boolean
  id: number
  identity_providers: IdentityProvider[]
  is_logo_visible_on_parent_dashboard?: boolean
  language?: LanguageEnum
  languages?: LanguagesEnum[]
  logo_image: Image
  /** @maxLength 255 */
  name: string
  name_ca: string | null
  name_de: string | null
  name_detected_language: string | null
  name_en: string | null
  name_es: string | null
  name_et: string | null
  name_fr: string | null
  name_nl: string | null
  onboarding_enabled?: boolean
  parent_code?: string
  terms_and_conditions: TermsAndConditions
  /** @format date-time */
  updated_at: string
  /** @maxLength 255 */
  website_url: string
}

export type OrganizationAccessRequestAcceptCreateData = ProcessAccessRequest

export type OrganizationAccessRequestCreateData = AccessRequest

export type OrganizationAccessRequestDeclineCreateData = ProcessAccessRequest

export type OrganizationAccessRequestListData = PaginatedAccessRequestList

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
  attachment_type?: AttachmentTypeEnum
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  /** @format uri */
  file: string
  id: number
  /** @maxLength 100 */
  mime: string
  /** @maxLength 255 */
  title: string
  title_ca: string | null
  title_de: string | null
  title_detected_language: string | null
  title_en: string | null
  title_es: string | null
  title_et: string | null
  title_fr: string | null
  title_nl: string | null
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface OrganizationAttachmentFileRequest {
  attachment_type?: AttachmentTypeEnum
  description?: string
  /** @format binary */
  file: File
  /** @minLength 1 */
  hashcode?: string
  /**
   * @minLength 1
   * @maxLength 100
   */
  mime: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
}

export type OrganizationBannerCreateData = Image

/** @format binary */
export type OrganizationBannerCreatePayload = File

export type OrganizationBannerDestroyData = any

export type OrganizationBannerPartialUpdateData = Image

export type OrganizationBannerUpdateData = Image

export type OrganizationCategoriesHierarchyRetrieveData = Organization

export type OrganizationCategoryBackgroundCreateData = Image

/** @format binary */
export type OrganizationCategoryBackgroundCreatePayload = File

export type OrganizationCategoryBackgroundDestroyData = any

export type OrganizationCategoryBackgroundPartialUpdateData = Image

export type OrganizationCategoryBackgroundUpdateData = Image

export type OrganizationCategoryCreateData = ProjectCategory

export type OrganizationCategoryDestroyData = any

export type OrganizationCategoryHierarchyRetrieveData = ProjectCategory

export type OrganizationCategoryListData = PaginatedProjectCategoryList

export type OrganizationCategoryPartialUpdateData = ProjectCategory

export type OrganizationCategoryProjectsLifeStatusCreateData = object

export interface OrganizationCategoryProjectsLifeStatusCreatePayload {
  life_status?: 'running' | 'completed' | 'canceled' | 'toreview'
}

export type OrganizationCategoryProjectsLockedStatusCreateData = object

export interface OrganizationCategoryProjectsLockedStatusCreatePayload {
  is_locked?: boolean
}

export type OrganizationCategoryRetrieveData = ProjectCategory

export type OrganizationCategoryUpdateData = ProjectCategory

export type OrganizationContactUsCreateData = Contact

export type OrganizationCreateData = Organization

export type OrganizationDestroyData = any

export type OrganizationEventCreateData = any

export type OrganizationEventDestroyData = any

export type OrganizationEventImageCreateData = Image

/** @format binary */
export type OrganizationEventImageCreatePayload = File

export type OrganizationEventImageDestroyData = any

export type OrganizationEventImagePartialUpdateData = Image

export type OrganizationEventImageRetrieveData = Image

export type OrganizationEventImageUpdateData = Image

export type OrganizationEventListData = PaginatedEventList

export type OrganizationEventPartialUpdateData = any

export type OrganizationEventRetrieveData = Event

export type OrganizationEventUpdateData = any

export type OrganizationFeaturedProjectAddCreateData = Organization

export type OrganizationFeaturedProjectRemoveCreateData = Organization

export type OrganizationFeaturedProjectRetrieveData = Organization

export type OrganizationFileCreateData = OrganizationAttachmentFile

export type OrganizationFileDestroyData = any

export type OrganizationFileListData = PaginatedOrganizationAttachmentFileList

export type OrganizationFilePartialUpdateData = OrganizationAttachmentFile

export type OrganizationFileRetrieveData = OrganizationAttachmentFile

export type OrganizationFileUpdateData = OrganizationAttachmentFile

export type OrganizationImageCreateData = Image

/** @format binary */
export type OrganizationImageCreatePayload = File

export type OrganizationImageDestroyData = any

export type OrganizationImagePartialUpdateData = Image

export type OrganizationImageRetrieveData = Image

export type OrganizationImageUpdateData = Image

export type OrganizationInstructionCreateData = any

export type OrganizationInstructionDestroyData = any

export type OrganizationInstructionImageCreateData = Image

/** @format binary */
export type OrganizationInstructionImageCreatePayload = File

export type OrganizationInstructionImageDestroyData = any

export type OrganizationInstructionImagePartialUpdateData = Image

export type OrganizationInstructionImageRetrieveData = Image

export type OrganizationInstructionImageUpdateData = Image

export type OrganizationInstructionListData = PaginatedInstructionList

export type OrganizationInstructionPartialUpdateData = any

export type OrganizationInstructionRetrieveData = Instruction

export type OrganizationInstructionUpdateData = any

export type OrganizationInvitationCreateData = Invitation

export type OrganizationInvitationDestroyData = any

export type OrganizationInvitationListData = PaginatedInvitationList

export type OrganizationInvitationPartialUpdateData = Invitation

export type OrganizationInvitationRetrieveData = Invitation

export type OrganizationInvitationUpdateData = Invitation

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface OrganizationLight {
  /** @maxLength 9 */
  background_color?: string
  /** @maxLength 50 */
  code: string
  id: number
  is_logo_visible_on_parent_dashboard?: boolean
  logo_image: Image
  /** @maxLength 255 */
  name: string
  name_ca: string | null
  name_de: string | null
  name_detected_language: string | null
  name_en: string | null
  name_es: string | null
  name_et: string | null
  name_fr: string | null
  name_nl: string | null
  /** @maxLength 255 */
  website_url: string
}

export type OrganizationListData = PaginatedOrganizationLightList

export type OrganizationLogoCreateData = Image

/** @format binary */
export type OrganizationLogoCreatePayload = File

export type OrganizationLogoDestroyData = any

export type OrganizationLogoPartialUpdateData = Image

export type OrganizationLogoRetrieveData = Image

export type OrganizationLogoUpdateData = Image

export type OrganizationMemberAddCreateData = User

export type OrganizationMemberRemoveCreateData = User

export type OrganizationMentoredSkillRetrieveData = Tag

export type OrganizationMentoreeSkillRetrieveData = Tag

export type OrganizationMentoringContactMentorCreateData = Mentoring

export type OrganizationMentoringContactMentoreeCreateData = Mentoring

export type OrganizationMentoringDestroyData = any

export type OrganizationMentoringListData = PaginatedMentoringList

export type OrganizationMentoringRespondCreateData = Mentoring

export type OrganizationMentoringRetrieveData = Mentoring

export type OrganizationNewsCreateData = any

export type OrganizationNewsDestroyData = any

export type OrganizationNewsHeaderCreateData = Image

/** @format binary */
export type OrganizationNewsHeaderCreatePayload = File

export type OrganizationNewsHeaderDestroyData = any

export type OrganizationNewsHeaderPartialUpdateData = Image

export type OrganizationNewsHeaderRetrieveData = Image

export type OrganizationNewsHeaderUpdateData = Image

export type OrganizationNewsImageCreateData = Image

/** @format binary */
export type OrganizationNewsImageCreatePayload = File

export type OrganizationNewsImageDestroyData = any

export type OrganizationNewsImagePartialUpdateData = Image

export type OrganizationNewsImageRetrieveData = Image

export type OrganizationNewsImageUpdateData = Image

export type OrganizationNewsListData = PaginatedNewsList

export type OrganizationNewsPartialUpdateData = any

export type OrganizationNewsRetrieveData = News

export type OrganizationNewsUpdateData = any

export type OrganizationNewsfeedListData = PaginatedNewsfeedList

export type OrganizationPartialUpdateData = Organization

export type OrganizationPeopleGroupCreateData = PeopleGroup

export type OrganizationPeopleGroupDestroyData = any

export type OrganizationPeopleGroupHeaderCreateData = Image

/** @format binary */
export type OrganizationPeopleGroupHeaderCreatePayload = File

export type OrganizationPeopleGroupHeaderDestroyData = any

export type OrganizationPeopleGroupHeaderPartialUpdateData = Image

export type OrganizationPeopleGroupHeaderUpdateData = Image

export type OrganizationPeopleGroupHierarchyRetrieveData = PeopleGroup

export type OrganizationPeopleGroupListData = PaginatedPeopleGroupLightList

export type OrganizationPeopleGroupLogoCreateData = Image

/** @format binary */
export type OrganizationPeopleGroupLogoCreatePayload = File

export type OrganizationPeopleGroupLogoDestroyData = any

export type OrganizationPeopleGroupLogoPartialUpdateData = Image

export type OrganizationPeopleGroupLogoUpdateData = Image

export type OrganizationPeopleGroupMemberAddCreateData = PeopleGroup

export type OrganizationPeopleGroupMemberRemoveCreateData = PeopleGroup

export type OrganizationPeopleGroupMemberRetrieveData = PeopleGroup

export type OrganizationPeopleGroupPartialUpdateData = PeopleGroup

export type OrganizationPeopleGroupProjectAddCreateData = PeopleGroup

export type OrganizationPeopleGroupProjectRemoveCreateData = PeopleGroup

export type OrganizationPeopleGroupProjectRetrieveData = PeopleGroup

export type OrganizationPeopleGroupRetrieveData = PeopleGroup

export type OrganizationPeopleGroupUpdateData = PeopleGroup

export type OrganizationPeopleGroupsHierarchyRetrieveData = Organization

export type OrganizationRecommendedProjectProjectRandomRetrieveData = ProjectLight

export type OrganizationRecommendedProjectProjectRetrieveData = ProjectLight

export type OrganizationRecommendedProjectUserRandomRetrieveData = ProjectLight

export type OrganizationRecommendedProjectUserRetrieveData = ProjectLight

export type OrganizationRecommendedUserProjectRandomRetrieveData = UserLight

export type OrganizationRecommendedUserProjectRetrieveData = UserLight

export type OrganizationRecommendedUserUserRandomRetrieveData = UserLight

export type OrganizationRecommendedUserUserRetrieveData = UserLight

export interface OrganizationRemoveFeaturedProjectsRequest {
  featured_projects_ids?: string[]
}

export interface OrganizationRemoveTeamMembersRequest {
  users?: string[]
}

export type OrganizationReportAbuseCreateData = EmailReport

export type OrganizationReportBugCreateData = EmailReport

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface OrganizationRequest {
  access_request_enabled?: boolean
  /** @maxLength 9 */
  background_color?: string
  banner_image_id?: number
  /** @maxLength 255 */
  chat_button_text?: string
  /**
   * @format uri
   * @maxLength 255
   */
  chat_url?: string
  /**
   * @minLength 1
   * @maxLength 50
   */
  code: string
  /**
   * @format email
   * @maxLength 255
   */
  contact_email?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  dashboard_subtitle: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  dashboard_title: string
  default_projects_tag_classification?: string
  default_projects_tags?: string[]
  default_skills_tag_classification?: string
  default_skills_tags?: string[]
  description?: string
  enabled_projects_tag_classifications?: string[]
  enabled_skills_tag_classifications?: string[]
  force_login_form_display?: boolean
  is_logo_visible_on_parent_dashboard?: boolean
  language?: LanguageEnum
  languages?: LanguagesEnum[]
  logo_image_id: number
  /**
   * @minLength 1
   * @maxLength 255
   */
  name: string
  onboarding_enabled?: boolean
  /** @minLength 1 */
  parent_code?: string
  team?: OrganizationAddTeamMembersRequest
  /**
   * @minLength 1
   * @maxLength 255
   */
  website_url: string
}

export type OrganizationRetrieveData = Organization

export type OrganizationStatsListData = PaginatedStatsList

export type OrganizationTagAutocompleteRetrieveData = string[]

export type OrganizationTagClassificationAddTagsCreateData = any

export type OrganizationTagClassificationCreateData = TagClassification

export type OrganizationTagClassificationDestroyData = any

export type OrganizationTagClassificationListData = PaginatedTagClassificationList

export type OrganizationTagClassificationPartialUpdateData = TagClassification

export type OrganizationTagClassificationRemoveTagsCreateData = any

export type OrganizationTagClassificationRetrieveData = TagClassification

export type OrganizationTagClassificationTagAutocompleteRetrieveData = string[]

export type OrganizationTagClassificationTagCreateData = Tag

export type OrganizationTagClassificationTagDestroyData = any

export type OrganizationTagClassificationTagListData = PaginatedTagList

export type OrganizationTagClassificationTagPartialUpdateData = Tag

export type OrganizationTagClassificationTagRetrieveData = Tag

export type OrganizationTagClassificationTagUpdateData = Tag

export type OrganizationTagClassificationUpdateData = TagClassification

export type OrganizationTagCreateData = Tag

export type OrganizationTagDestroyData = any

export type OrganizationTagListData = PaginatedTagList

export type OrganizationTagPartialUpdateData = Tag

export type OrganizationTagRetrieveData = Tag

export type OrganizationTagUpdateData = Tag

export type OrganizationTemplateCreateData = Template

export type OrganizationTemplateDestroyData = any

export type OrganizationTemplateImageCreateData = Image

/** @format binary */
export type OrganizationTemplateImageCreatePayload = File

export type OrganizationTemplateImageDestroyData = any

export type OrganizationTemplateImagePartialUpdateData = Image

export type OrganizationTemplateImageRetrieveData = Image

export type OrganizationTemplateImageUpdateData = Image

export type OrganizationTemplateListData = PaginatedTemplateList

export type OrganizationTemplatePartialUpdateData = Template

export type OrganizationTemplateRetrieveData = Template

export type OrganizationTemplateUpdateData = Template

export type OrganizationTermsAndConditionsPartialUpdateData = TermsAndConditions

export type OrganizationTermsAndConditionsUpdateData = TermsAndConditions

export type OrganizationUpdateData = Organization

export type OrganizationUserMentorCandidateRetrieveData = UserLight

export type OrganizationUserMentoreeCandidateRetrieveData = UserLight

export interface PaginatedAccessRequestList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: AccessRequest[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedAnnouncementList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: Announcement[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedAttachmentFileList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: AttachmentFile[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedAttachmentLinkList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: AttachmentLink[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedBlogEntryList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: BlogEntry[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedCommentList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: Comment[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedEmailList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: Email[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedEventList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: Event[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedFollowList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: Follow[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedGoalList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: Goal[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedInstructionList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: Instruction[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedInvitationList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: Invitation[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedMentoringList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: Mentoring[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedNewsList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: News[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedNewsfeedList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: Newsfeed[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedNotificationsList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: Notifications[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedOrganizationAttachmentFileList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: OrganizationAttachmentFile[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedOrganizationLightList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: OrganizationLight[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedPeopleGroupLightList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: PeopleGroupLight[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedProjectCategoryList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: ProjectCategory[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedProjectLightList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: ProjectLight[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedProjectMessageList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: ProjectMessage[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedProjectTabItemList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: ProjectTabItem[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedProjectTabList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: ProjectTab[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedProjectVersionListList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: ProjectVersionList[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedReviewList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: Review[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedSearchObjectList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: SearchObject[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedStatsList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: Stats[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedTagClassificationList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: TagClassification[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedTagList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: Tag[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedTemplateList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: Template[]
  /** @example 123 */
  total_page?: number
}

export interface PaginatedUserLightList {
  /** @example 123 */
  count: number
  /** @example 123 */
  current_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=0&limit=100"
   */
  first?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  last?: string
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=400&limit=100"
   */
  next?: string | null
  /** @example 123 */
  next_page?: number
  /**
   * @format uri
   * @example "http://api.example.org/accounts/?offset=200&limit=100"
   */
  previous?: string | null
  /** @example 123 */
  previous_page?: number
  results: UserLight[]
  /** @example 123 */
  total_page?: number
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedAnnouncementRequest {
  /** @format date */
  deadline?: string | null
  description?: string
  is_remunerated?: boolean
  /** @minLength 1 */
  project_id?: string
  status?: AnnouncementStatusEnum
  /**
   * @minLength 1
   * @maxLength 100
   */
  title?: string
  type?: AnnouncementTypeEnum
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedAttachmentFileRequest {
  attachment_type?: AttachmentTypeEnum
  description?: string
  /** @format binary */
  file?: File
  /** @minLength 1 */
  hashcode?: string
  /**
   * @minLength 1
   * @maxLength 100
   */
  mime?: string
  /** @minLength 1 */
  project_id?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  title?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedAttachmentLinkRequest {
  attachment_type?: AttachmentTypeEnum
  category?: CategoryEnum
  description?: string
  /** @minLength 1 */
  project_id?: string
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
  content?: string
  images_ids?: number[]
  /** @minLength 1 */
  project_id?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  title?: string
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
  images_ids?: number[]
  /** @minLength 1 */
  project_id?: string
  reply_on_id?: number | null
}

export interface PatchedEmailRequest {
  content?: string
  /**
   * Content [ca]
   * @minLength 1
   */
  content_ca?: string | null
  /**
   * Content [de]
   * @minLength 1
   */
  content_de?: string | null
  /**
   * Content [en]
   * @minLength 1
   */
  content_en?: string | null
  /**
   * Content [es]
   * @minLength 1
   */
  content_es?: string | null
  /**
   * Content [et]
   * @minLength 1
   */
  content_et?: string | null
  /**
   * Content [fr]
   * @minLength 1
   */
  content_fr?: string | null
  /**
   * Content [nl]
   * @minLength 1
   */
  content_nl?: string | null
  images?: number[]
  recipients?: number[]
  send_to?: SendToEnum
  sent_to?: number[]
  /** @maxLength 255 */
  subject?: string
  /**
   * Subject [ca]
   * @minLength 1
   * @maxLength 255
   */
  subject_ca?: string | null
  /**
   * Subject [de]
   * @minLength 1
   * @maxLength 255
   */
  subject_de?: string | null
  /**
   * Subject [en]
   * @minLength 1
   * @maxLength 255
   */
  subject_en?: string | null
  /**
   * Subject [es]
   * @minLength 1
   * @maxLength 255
   */
  subject_es?: string | null
  /**
   * Subject [et]
   * @minLength 1
   * @maxLength 255
   */
  subject_et?: string | null
  /**
   * Subject [fr]
   * @minLength 1
   * @maxLength 255
   */
  subject_fr?: string | null
  /**
   * Subject [nl]
   * @minLength 1
   * @maxLength 255
   */
  subject_nl?: string | null
  template?: TemplateEnum
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedGoalRequest {
  /** @format date */
  deadline_at?: string | null
  description?: string
  /** @minLength 1 */
  project_id?: string
  status?: GoalStatusEnum
  /** @maxLength 255 */
  title?: string
}

export interface PatchedImageRequest {
  /** @format binary */
  file?: File
  /**
   * @min -2147483648
   * @max 2147483647
   */
  height?: number | null
  /** @format double */
  left?: number | null
  /**
   * @minLength 1
   * @maxLength 255
   */
  name?: string
  /** @format double */
  natural_ratio?: number | null
  /** @format double */
  scale_x?: number | null
  /** @format double */
  scale_y?: number | null
  /** @format double */
  top?: number | null
  /**
   * @min -2147483648
   * @max 2147483647
   */
  width?: number | null
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedInvitationRequest {
  /** @maxLength 255 */
  description?: string
  /** @format date-time */
  expire_at?: string
  people_group_id?: number
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
  description?: string
  /** @format double */
  lat?: number
  /** @format double */
  lng?: number
  /** @minLength 1 */
  project_id?: string
  /** @maxLength 255 */
  title?: string
  type?: LocationTypeEnum
}

export interface PatchedNotificationSettingsRequest {
  announcement_has_new_application?: boolean
  announcement_published?: boolean
  comment_received_a_response?: boolean
  followed_project_has_been_edited?: boolean
  invitation_link_will_expire?: boolean
  new_instruction?: boolean
  notify_added_to_project?: boolean
  organization_has_new_access_request?: boolean
  project_has_been_commented?: boolean
  project_has_been_edited?: boolean
  project_has_been_reviewed?: boolean
  project_has_new_private_message?: boolean
  project_ready_for_review?: boolean
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedOrganizationAttachmentFileRequest {
  attachment_type?: AttachmentTypeEnum
  description?: string
  /** @format binary */
  file?: File
  /** @minLength 1 */
  hashcode?: string
  /**
   * @minLength 1
   * @maxLength 100
   */
  mime?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  title?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedOrganizationRequest {
  access_request_enabled?: boolean
  /** @maxLength 9 */
  background_color?: string
  banner_image_id?: number
  /** @maxLength 255 */
  chat_button_text?: string
  /**
   * @format uri
   * @maxLength 255
   */
  chat_url?: string
  /**
   * @minLength 1
   * @maxLength 50
   */
  code?: string
  /**
   * @format email
   * @maxLength 255
   */
  contact_email?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  dashboard_subtitle?: string
  /**
   * @minLength 1
   * @maxLength 255
   */
  dashboard_title?: string
  default_projects_tag_classification?: string
  default_projects_tags?: string[]
  default_skills_tag_classification?: string
  default_skills_tags?: string[]
  description?: string
  enabled_projects_tag_classifications?: string[]
  enabled_skills_tag_classifications?: string[]
  force_login_form_display?: boolean
  is_logo_visible_on_parent_dashboard?: boolean
  language?: LanguageEnum
  languages?: LanguagesEnum[]
  logo_image_id?: number
  /**
   * @minLength 1
   * @maxLength 255
   */
  name?: string
  onboarding_enabled?: boolean
  /** @minLength 1 */
  parent_code?: string
  team?: OrganizationAddTeamMembersRequest
  /**
   * @minLength 1
   * @maxLength 255
   */
  website_url?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedPeopleGroupRequest {
  description?: string
  /**
   * @format email
   * @maxLength 254
   */
  email?: string
  featured_projects?: string[]
  /** @maxLength 255 */
  name?: string
  /** @minLength 1 */
  organization?: string
  parent?: number | null
  /** Visibility */
  publication_status?: PublicationStatus
  short_description?: string
  team?: PeopleGroupAddTeamMembersRequest
}

export interface PatchedPrivacySettingsRequest {
  email?: PrivacySettingsChoices
  mobile_phone?: PrivacySettingsChoices
  profile_picture?: PrivacySettingsChoices
  publication_status?: PrivacySettingsChoices
  skills?: PrivacySettingsChoices
  socials?: PrivacySettingsChoices
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedProjectCategoryRequest {
  /** @maxLength 9 */
  background_color?: string
  background_image_id?: number
  /** description of the category */
  description?: string
  /** @maxLength 9 */
  foreground_color?: string
  is_reviewable?: boolean
  /**
   * name of the category
   * @minLength 1
   * @maxLength 100
   */
  name?: string
  only_reviewer_can_publish?: boolean
  /**
   * @min -32768
   * @max 32767
   */
  order_index?: number
  parent?: number | null
  tags?: string[]
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
  /** @format date-time */
  deleted_at?: string | null
  description?: string
  header_image_id?: number
  /**
   * @minLength 1
   * @maxLength 8
   */
  id?: string
  images_ids?: number[]
  is_shareable?: boolean
  language?: LanguageEnum
  life_status?: LifeStatusEnum
  organizations_codes?: string[]
  project_categories_ids?: number[]
  /** Visibility */
  publication_status?: PublicationStatus
  /** Main goal */
  purpose?: string
  /**
   * Sustainable development goals
   * @maxItems 17
   */
  sdgs?: SdgsEnum[]
  tags?: string[]
  team?: ProjectAddTeamMembersRequest
  template_id?: number
  /**
   * @minLength 1
   * @maxLength 255
   */
  title?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedProjectTabItemRequest {
  content?: string
  images?: number[]
  /**
   * @minLength 1
   * @maxLength 255
   */
  title?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedProjectTabRequest {
  description?: string
  /** @maxLength 255 */
  icon?: string
  images?: number[]
  /**
   * @minLength 1
   * @maxLength 255
   */
  title?: string
  type?: ProjectTabTypeEnum
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedReviewRequest {
  description?: string
  /** @minLength 1 */
  project_id?: string
  /**
   * @minLength 1
   * @maxLength 100
   */
  title?: string
}

export interface PatchedSkillRequest {
  can_mentor?: boolean
  /** @maxLength 255 */
  category?: string
  comment?: string
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
  needs_mentor?: boolean
  tag?: string
  type?: TypeD3EEnum
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedTagClassificationRequest {
  /** @maxLength 500 */
  description?: string
  is_public?: boolean
  /**
   * @minLength 1
   * @maxLength 50
   */
  title?: string
}

/** Automatically translate model fields for model with registered translation */
export interface PatchedTagRequest {
  description?: string
  /**
   * Description [ca]
   * @minLength 1
   */
  description_ca?: string | null
  /**
   * Description [de]
   * @minLength 1
   */
  description_de?: string | null
  /**
   * Description [en]
   * @minLength 1
   */
  description_en?: string | null
  /**
   * Description [es]
   * @minLength 1
   */
  description_es?: string | null
  /**
   * Description [et]
   * @minLength 1
   */
  description_et?: string | null
  /**
   * Description [fr]
   * @minLength 1
   */
  description_fr?: string | null
  /**
   * Description [nl]
   * @minLength 1
   */
  description_nl?: string | null
  /**
   * @minLength 1
   * @maxLength 255
   */
  title?: string
  /**
   * Title [ca]
   * @minLength 1
   * @maxLength 255
   */
  title_ca?: string | null
  /**
   * Title [de]
   * @minLength 1
   * @maxLength 255
   */
  title_de?: string | null
  /**
   * Title [en]
   * @minLength 1
   * @maxLength 255
   */
  title_en?: string | null
  /**
   * Title [es]
   * @minLength 1
   * @maxLength 255
   */
  title_es?: string | null
  /**
   * Title [et]
   * @minLength 1
   * @maxLength 255
   */
  title_et?: string | null
  /**
   * Title [fr]
   * @minLength 1
   * @maxLength 255
   */
  title_fr?: string | null
  /**
   * Title [nl]
   * @minLength 1
   * @maxLength 255
   */
  title_nl?: string | null
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PatchedTemplateRequest {
  audience?: AudienceEnum | BlankEnum
  blogentry_content?: string
  /** @maxLength 255 */
  blogentry_title?: string
  categories_ids?: number[]
  comment_content?: string
  description?: string
  goal_description?: string
  /** @maxLength 255 */
  goal_title?: string
  language?: LanguageEnum
  /** @maxLength 255 */
  name?: string
  project_description?: string
  project_purpose?: string
  project_tags?: string[]
  /** @maxLength 255 */
  project_title?: string
  review_description?: string
  /** @maxLength 255 */
  review_title?: string
  share_globally?: boolean
  time_estimation?: TimeEstimationEnum | BlankEnum
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
  /** @format date */
  birthdate?: string | null
  description?: string
  /** @format email */
  email?: string
  facebook?: string
  /** @maxLength 255 */
  family_name?: string
  /** @maxLength 255 */
  given_name?: string
  /** @maxLength 255 */
  job?: string
  landline_phone?: string
  language?: LanguageEnum
  linkedin?: string
  location?: string
  medium?: string
  mobile_phone?: string
  onboarding_status?: Record<string, any>
  /**
   * id of user in people
   * @format uuid
   */
  people_id?: string | null
  /** @format email */
  personal_email?: string
  /** @format binary */
  profile_picture_file?: File | null
  /** @format double */
  profile_picture_left?: number | null
  /** @format double */
  profile_picture_natural_ratio?: number | null
  /** @format double */
  profile_picture_scale_x?: number | null
  /** @format double */
  profile_picture_scale_y?: number | null
  /** @format double */
  profile_picture_top?: number | null
  /** @maxLength 32 */
  pronouns?: string
  roles_to_add?: string[]
  roles_to_remove?: string[]
  sdgs?: number[]
  short_description?: string
  signed_terms_and_conditions?: Record<string, any>
  skype?: string
  twitter?: string
  website?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PeopleGroup {
  children: Record<string, string | number>[]
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  /**
   * @format email
   * @maxLength 254
   */
  email?: string
  header_image: Image
  hierarchy: Record<string, string | number>[]
  id: number
  is_root: boolean
  logo_image: Image
  /** @maxLength 255 */
  name?: string
  name_ca: string | null
  name_de: string | null
  name_detected_language: string | null
  name_en: string | null
  name_es: string | null
  name_et: string | null
  name_fr: string | null
  name_nl: string | null
  organization: string
  /** Visibility */
  publication_status?: PublicationStatus
  roles: string[]
  short_description?: string
  short_description_ca: string | null
  short_description_de: string | null
  short_description_detected_language: string | null
  short_description_en: string | null
  short_description_es: string | null
  short_description_et: string | null
  short_description_fr: string | null
  short_description_nl: string | null
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
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
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  /**
   * @format email
   * @maxLength 254
   */
  email?: string
  header_image: Image
  id: number
  is_root: boolean
  members_count: number
  /** @maxLength 255 */
  name?: string
  name_ca: string | null
  name_de: string | null
  name_detected_language: string | null
  name_en: string | null
  name_es: string | null
  name_et: string | null
  name_fr: string | null
  name_nl: string | null
  organization: string
  /** Visibility */
  publication_status: PublicationStatus
  roles: string[]
  short_description?: string
  short_description_ca: string | null
  short_description_de: string | null
  short_description_detected_language: string | null
  short_description_en: string | null
  short_description_es: string | null
  short_description_et: string | null
  short_description_fr: string | null
  short_description_nl: string | null
  /**
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PeopleGroupLightRequest {
  description?: string
  /**
   * @format email
   * @maxLength 254
   */
  email?: string
  /** @maxLength 255 */
  name?: string
  short_description?: string
  /**
   * @minLength 1
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PeopleGroupLightSerializerPrimaryKeyRelatedField {
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  /**
   * @format email
   * @maxLength 254
   */
  email?: string
  header_image: Image
  id: number
  is_root: boolean
  members_count: number
  /** @maxLength 255 */
  name?: string
  name_ca: string | null
  name_de: string | null
  name_detected_language: string | null
  name_en: string | null
  name_es: string | null
  name_et: string | null
  name_fr: string | null
  name_nl: string | null
  organization: string
  /** Visibility */
  publication_status: PublicationStatus
  roles: string[]
  short_description?: string
  short_description_ca: string | null
  short_description_de: string | null
  short_description_detected_language: string | null
  short_description_en: string | null
  short_description_es: string | null
  short_description_et: string | null
  short_description_fr: string | null
  short_description_nl: string | null
  /**
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface PeopleGroupLightSerializerPrimaryKeyRelatedFieldRequest {
  description?: string
  /**
   * @format email
   * @maxLength 254
   */
  email?: string
  /** @maxLength 255 */
  name?: string
  short_description?: string
  /**
   * @minLength 1
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
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
  description?: string
  /**
   * @format email
   * @maxLength 254
   */
  email?: string
  featured_projects?: string[]
  /** @maxLength 255 */
  name?: string
  /** @minLength 1 */
  organization: string
  parent?: number | null
  /** Visibility */
  publication_status?: PublicationStatus
  short_description?: string
  team?: PeopleGroupAddTeamMembersRequest
}

export interface PrivacySettings {
  email?: PrivacySettingsChoices
  id: number
  mobile_phone?: PrivacySettingsChoices
  profile_picture?: PrivacySettingsChoices
  publication_status?: PrivacySettingsChoices
  skills?: PrivacySettingsChoices
  socials?: PrivacySettingsChoices
}

export enum PrivacySettingsChoices {
  Hide = 'hide',
  Org = 'org',
  Pub = 'pub',
}

export type PrivacySettingsPartialUpdateData = PrivacySettings

export interface PrivacySettingsRequest {
  email?: PrivacySettingsChoices
  mobile_phone?: PrivacySettingsChoices
  profile_picture?: PrivacySettingsChoices
  publication_status?: PrivacySettingsChoices
  skills?: PrivacySettingsChoices
  socials?: PrivacySettingsChoices
}

export type PrivacySettingsRetrieveData = PrivacySettings

export type PrivacySettingsUpdateData = PrivacySettings

export interface ProcessAccessRequest {
  error?: AccessRequestResult[]
  success?: AccessRequestResult[]
  warning?: AccessRequestResult[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Project {
  announcements: Announcement[]
  blog_entries: BlogEntry[]
  categories: ProjectCategoryLight[]
  /** @format date-time */
  created_at: string
  /** @format date-time */
  deleted_at?: string | null
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  files: AttachmentFile[]
  goals: Goal[]
  header_image: Image
  /** @maxLength 8 */
  id?: string
  images: Image[]
  is_followed: Record<string, any>
  is_locked: boolean
  is_shareable?: boolean
  language?: LanguageEnum
  last_comment: Record<string, any>
  life_status?: LifeStatusEnum
  linked_projects: Record<string, any>
  links: AttachmentLink[]
  locations: Location[]
  organizations: Organization[]
  /** Visibility */
  publication_status?: PublicationStatus
  /** Main goal */
  purpose?: string
  /** Main goal */
  purpose_ca: string | null
  /** Main goal */
  purpose_de: string | null
  purpose_detected_language: string | null
  /** Main goal */
  purpose_en: string | null
  /** Main goal */
  purpose_es: string | null
  /** Main goal */
  purpose_et: string | null
  /** Main goal */
  purpose_fr: string | null
  /** Main goal */
  purpose_nl: string | null
  reviews: Review[]
  /**
   * Sustainable development goals
   * @maxItems 17
   */
  sdgs?: SdgsEnum[]
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
  tags?: string[]
  team?: ProjectAddTeamMembers
  template: ProjectTemplate
  /** @maxLength 255 */
  title: string
  /** Title */
  title_ca: string | null
  /** Title */
  title_de: string | null
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_es: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_nl: string | null
  /** @format date-time */
  updated_at: string
  views: number
}

/** Used to link projects to another one. */
export interface ProjectAddLinkedProjectRequest {
  projects: LinkedProjectRequest[]
}

export interface ProjectAddTeamMembers {
  member_groups?: PeopleGroupLightSerializerPrimaryKeyRelatedField[]
  members?: UserLighterSerializerKeycloakRelatedField[]
  owner_groups?: PeopleGroupLightSerializerPrimaryKeyRelatedField[]
  owners?: UserLighterSerializerKeycloakRelatedField[]
  reviewer_groups?: PeopleGroupLightSerializerPrimaryKeyRelatedField[]
  reviewers?: UserLighterSerializerKeycloakRelatedField[]
}

export interface ProjectAddTeamMembersRequest {
  member_groups?: PeopleGroupLightSerializerPrimaryKeyRelatedFieldRequest[]
  members?: UserLighterSerializerKeycloakRelatedFieldRequest[]
  owner_groups?: PeopleGroupLightSerializerPrimaryKeyRelatedFieldRequest[]
  owners?: UserLighterSerializerKeycloakRelatedFieldRequest[]
  reviewer_groups?: PeopleGroupLightSerializerPrimaryKeyRelatedFieldRequest[]
  reviewers?: UserLighterSerializerKeycloakRelatedFieldRequest[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectAnnouncement {
  header_image: Image
  /** @maxLength 8 */
  id?: string
  language?: LanguageEnum
  /** Visibility */
  publication_status?: PublicationStatus
  /** Main goal */
  purpose?: string
  /** Main goal */
  purpose_ca: string | null
  /** Main goal */
  purpose_de: string | null
  purpose_detected_language: string | null
  /** Main goal */
  purpose_en: string | null
  /** Main goal */
  purpose_es: string | null
  /** Main goal */
  purpose_et: string | null
  /** Main goal */
  purpose_fr: string | null
  /** Main goal */
  purpose_nl: string | null
  /**
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /** @maxLength 255 */
  title: string
  /** Title */
  title_ca: string | null
  /** Title */
  title_de: string | null
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_es: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_nl: string | null
}

export type ProjectAnnouncementApplyCreateData = Announcement

export type ProjectAnnouncementCreateData = Announcement

export type ProjectAnnouncementDestroyData = any

export type ProjectAnnouncementListData = PaginatedAnnouncementList

export type ProjectAnnouncementPartialUpdateData = Announcement

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
  language?: LanguageEnum
  /** Visibility */
  publication_status?: PublicationStatus
  /** Main goal */
  purpose?: string
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
}

export type ProjectAnnouncementRetrieveData = Announcement

export type ProjectAnnouncementUpdateData = Announcement

export type ProjectBlogEntryCreateData = BlogEntry

export type ProjectBlogEntryDestroyData = any

export type ProjectBlogEntryImageCreateData = Image

/** @format binary */
export type ProjectBlogEntryImageCreatePayload = File

export type ProjectBlogEntryImageDestroyData = any

export type ProjectBlogEntryImagePartialUpdateData = Image

export type ProjectBlogEntryImageRetrieveData = Image

export type ProjectBlogEntryImageUpdateData = Image

export type ProjectBlogEntryListData = PaginatedBlogEntryList

export type ProjectBlogEntryPartialUpdateData = BlogEntry

export type ProjectBlogEntryRetrieveData = BlogEntry

export type ProjectBlogEntryUpdateData = BlogEntry

export interface ProjectByMonth {
  created_count: number
  /** @format date */
  month: string
  updated_count: number
}

export interface ProjectBySDG {
  project_count: number
  sdg: number
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectCategory {
  /** @maxLength 9 */
  background_color?: string
  background_image: Image
  children: Record<string, string | number>[]
  /** description of the category */
  description?: string
  /** description of the category */
  description_ca: string | null
  /** description of the category */
  description_de: string | null
  description_detected_language: string | null
  /** description of the category */
  description_en: string | null
  /** description of the category */
  description_es: string | null
  /** description of the category */
  description_et: string | null
  /** description of the category */
  description_fr: string | null
  /** description of the category */
  description_nl: string | null
  /** @maxLength 9 */
  foreground_color?: string
  hierarchy: Record<string, string | number>[]
  id: number
  is_reviewable?: boolean
  /**
   * name of the category
   * @maxLength 100
   */
  name: string
  /** name of the category */
  name_ca: string | null
  /** name of the category */
  name_de: string | null
  name_detected_language: string | null
  /** name of the category */
  name_en: string | null
  /** name of the category */
  name_es: string | null
  /** name of the category */
  name_et: string | null
  /** name of the category */
  name_fr: string | null
  /** name of the category */
  name_nl: string | null
  only_reviewer_can_publish?: boolean
  /**
   * @min -32768
   * @max 32767
   */
  order_index?: number
  organization: string
  projects_count: number
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
  tags?: string[]
  templates: TemplateLight[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectCategoryLight {
  /** @maxLength 9 */
  background_color?: string
  /** @maxLength 9 */
  foreground_color?: string
  id: number
  is_reviewable?: boolean
  /**
   * name of the category
   * @maxLength 100
   */
  name: string
  /** name of the category */
  name_ca: string | null
  /** name of the category */
  name_de: string | null
  name_detected_language: string | null
  /** name of the category */
  name_en: string | null
  /** name of the category */
  name_es: string | null
  /** name of the category */
  name_et: string | null
  /** name of the category */
  name_fr: string | null
  /** name of the category */
  name_nl: string | null
  organization: string
  /**
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectCategoryLightRequest {
  /** @maxLength 9 */
  background_color?: string
  /** @maxLength 9 */
  foreground_color?: string
  is_reviewable?: boolean
  /**
   * name of the category
   * @minLength 1
   * @maxLength 100
   */
  name: string
  /**
   * @minLength 1
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectCategoryRequest {
  /** @maxLength 9 */
  background_color?: string
  background_image_id?: number
  /** description of the category */
  description?: string
  /** @maxLength 9 */
  foreground_color?: string
  is_reviewable?: boolean
  /**
   * name of the category
   * @minLength 1
   * @maxLength 100
   */
  name: string
  only_reviewer_can_publish?: boolean
  /**
   * @min -32768
   * @max 32767
   */
  order_index?: number
  parent?: number | null
  tags?: string[]
  templates_ids?: number[]
}

export type ProjectCommentCreateData = Comment

export type ProjectCommentDestroyData = any

export type ProjectCommentImageCreateData = Image

export type ProjectCommentImageDestroyData = any

export type ProjectCommentImagePartialUpdateData = Image

export type ProjectCommentImageRetrieveData = Image

export type ProjectCommentImageUpdateData = Image

export type ProjectCommentListData = PaginatedCommentList

export type ProjectCommentPartialUpdateData = Comment

export type ProjectCommentRetrieveData = Comment

export type ProjectCommentUpdateData = Comment

export type ProjectCreateData = Project

export type ProjectDestroyData = any

export type ProjectDuplicateCreateData = Project

export type ProjectFileCreateData = AttachmentFile

export type ProjectFileDestroyData = any

export type ProjectFileListData = PaginatedAttachmentFileList

export type ProjectFilePartialUpdateData = AttachmentFile

export type ProjectFileRetrieveData = AttachmentFile

export type ProjectFileUpdateData = AttachmentFile

export type ProjectFollowCreateData = Follow

export type ProjectFollowDestroyData = any

export type ProjectFollowListData = PaginatedFollowList

export type ProjectGoalCreateData = Goal

export type ProjectGoalDestroyData = any

export type ProjectGoalListData = PaginatedGoalList

export type ProjectGoalPartialUpdateData = Goal

export type ProjectGoalRetrieveData = Goal

export type ProjectGoalUpdateData = Goal

export type ProjectHeaderCreateData = Image

/** @format binary */
export type ProjectHeaderCreatePayload = File

export type ProjectHeaderDestroyData = any

export type ProjectHeaderPartialUpdateData = Image

export type ProjectHeaderUpdateData = Image

export type ProjectHistoryListData = PaginatedProjectVersionListList

export type ProjectHistoryRetrieveData = ProjectVersion

export type ProjectImageCreateData = Image

/** @format binary */
export type ProjectImageCreatePayload = File

export type ProjectImageDestroyData = any

export type ProjectImagePartialUpdateData = Image

export type ProjectImageRetrieveData = Image

export type ProjectImageUpdateData = Image

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectLight {
  categories: ProjectCategoryLight[]
  /** @format date-time */
  created_at: string
  header_image: Image
  /** @maxLength 8 */
  id?: string
  is_featured: boolean
  is_followed: Record<string, any>
  is_group_project: boolean
  language?: LanguageEnum
  life_status?: LifeStatusEnum
  /** Visibility */
  publication_status?: PublicationStatus
  /** Main goal */
  purpose?: string
  /** Main goal */
  purpose_ca: string | null
  /** Main goal */
  purpose_de: string | null
  purpose_detected_language: string | null
  /** Main goal */
  purpose_en: string | null
  /** Main goal */
  purpose_es: string | null
  /** Main goal */
  purpose_et: string | null
  /** Main goal */
  purpose_fr: string | null
  /** Main goal */
  purpose_nl: string | null
  /**
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /** @maxLength 255 */
  title: string
  /** Title */
  title_ca: string | null
  /** Title */
  title_de: string | null
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_es: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_nl: string | null
  /** @format date-time */
  updated_at: string
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
  language?: LanguageEnum
  life_status?: LifeStatusEnum
  /** Visibility */
  publication_status?: PublicationStatus
  /** Main goal */
  purpose?: string
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
}

export type ProjectLinkCreateData = AttachmentLink

export type ProjectLinkDestroyData = any

export type ProjectLinkListData = PaginatedAttachmentLinkList

export type ProjectLinkPartialUpdateData = AttachmentLink

export type ProjectLinkRetrieveData = AttachmentLink

export type ProjectLinkUpdateData = AttachmentLink

export type ProjectLinkedProjectAddManyCreateData = Project

export type ProjectLinkedProjectCreateData = LinkedProject

export type ProjectLinkedProjectDeleteManyDestroyData = any

export type ProjectLinkedProjectDestroyData = any

export type ProjectLinkedProjectPartialUpdateData = LinkedProject

export type ProjectListData = PaginatedProjectLightList

export type ProjectLocationCreateData = Location

export type ProjectLocationDestroyData = any

export type ProjectLocationListData = Location[]

export type ProjectLocationPartialUpdateData = Location

export type ProjectLocationRetrieveData = Location

export type ProjectLocationUpdateData = Location

export type ProjectLockCreateData = Project

export type ProjectMemberAddCreateData = Project

export type ProjectMemberRemoveCreateData = Project

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectMessage {
  author: UserLighter
  content?: string
  content_ca: string | null
  content_de: string | null
  content_detected_language: string | null
  content_en: string | null
  content_es: string | null
  content_et: string | null
  content_fr: string | null
  content_nl: string | null
  /** @format date-time */
  created_at: string
  /** @format date-time */
  deleted_at?: string | null
  id: number
  images: number[]
  reply_on?: number | null
  /** @format date-time */
  updated_at: string
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

export type ProjectPartialUpdateData = Project

export type ProjectProjectMessageCreateData = ProjectMessage

export type ProjectProjectMessageDestroyData = any

export type ProjectProjectMessageImageCreateData = Image

/** @format binary */
export type ProjectProjectMessageImageCreatePayload = File

export type ProjectProjectMessageImageDestroyData = any

export type ProjectProjectMessageImagePartialUpdateData = Image

export type ProjectProjectMessageImageRetrieveData = Image

export type ProjectProjectMessageImageUpdateData = Image

export type ProjectProjectMessageListData = PaginatedProjectMessageList

export type ProjectProjectMessagePartialUpdateData = ProjectMessage

export type ProjectProjectMessageRetrieveData = ProjectMessage

export type ProjectProjectMessageUpdateData = ProjectMessage

export type ProjectQuitDestroyData = any

export interface ProjectRemoveTeamMembersRequest {
  people_groups?: number[]
  users?: string[]
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectRequest {
  /** @format date-time */
  deleted_at?: string | null
  description?: string
  header_image_id?: number
  /**
   * @minLength 1
   * @maxLength 8
   */
  id?: string
  images_ids?: number[]
  is_shareable?: boolean
  language?: LanguageEnum
  life_status?: LifeStatusEnum
  organizations_codes: string[]
  project_categories_ids?: number[]
  /** Visibility */
  publication_status?: PublicationStatus
  /** Main goal */
  purpose?: string
  /**
   * Sustainable development goals
   * @maxItems 17
   */
  sdgs?: SdgsEnum[]
  tags?: string[]
  team?: ProjectAddTeamMembersRequest
  template_id?: number
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
}

export type ProjectRetrieveData = Project

export type ProjectReviewCreateData = Review

export type ProjectReviewDestroyData = any

export type ProjectReviewListData = PaginatedReviewList

export type ProjectReviewPartialUpdateData = Review

export type ProjectReviewRetrieveData = Review

export type ProjectReviewUpdateData = Review

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectSearch {
  categories: ProjectCategoryLight[]
  /** @format date-time */
  created_at: string
  header_image: Image
  /** @maxLength 8 */
  id?: string
  is_followed: Record<string, any>
  language?: LanguageEnum
  life_status?: LifeStatusEnum
  /** Visibility */
  publication_status?: PublicationStatus
  /** Main goal */
  purpose?: string
  /** Main goal */
  purpose_ca: string | null
  /** Main goal */
  purpose_de: string | null
  purpose_detected_language: string | null
  /** Main goal */
  purpose_en: string | null
  /** Main goal */
  purpose_es: string | null
  /** Main goal */
  purpose_et: string | null
  /** Main goal */
  purpose_fr: string | null
  /** Main goal */
  purpose_nl: string | null
  /**
   * Sustainable development goals
   * @maxItems 17
   */
  sdgs?: SdgsEnum[]
  /**
   * @maxLength 50
   * @pattern ^[-a-zA-Z0-9_]+$
   */
  slug: string
  /** @maxLength 255 */
  title: string
  /** Title */
  title_ca: string | null
  /** Title */
  title_de: string | null
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_es: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_nl: string | null
  /** @format date-time */
  updated_at: string
}

export type ProjectSimilarRetrieveData = ProjectLight

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
  /** Title */
  title_ca: string | null
  /** Title */
  title_de: string | null
  title_detected_language: string | null
  /** Title */
  title_en: string | null
  /** Title */
  title_es: string | null
  /** Title */
  title_et: string | null
  /** Title */
  title_fr: string | null
  /** Title */
  title_nl: string | null
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectTab {
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  /** @maxLength 255 */
  icon?: string
  id: number
  images?: number[]
  /** @maxLength 255 */
  title: string
  title_ca: string | null
  title_de: string | null
  title_detected_language: string | null
  title_en: string | null
  title_es: string | null
  title_et: string | null
  title_fr: string | null
  title_nl: string | null
  type?: ProjectTabTypeEnum
}

export type ProjectTabCreateData = ProjectTab

export type ProjectTabDestroyData = any

export type ProjectTabImageCreateData = Image

/** @format binary */
export type ProjectTabImageCreatePayload = File

export type ProjectTabImageDestroyData = any

export type ProjectTabImagePartialUpdateData = Image

export type ProjectTabImageRetrieveData = Image

export type ProjectTabImageUpdateData = Image

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectTabItem {
  content?: string
  content_ca: string | null
  content_de: string | null
  content_detected_language: string | null
  content_en: string | null
  content_es: string | null
  content_et: string | null
  content_fr: string | null
  content_nl: string | null
  /** @format date-time */
  created_at: string
  id: number
  images?: number[]
  /** @maxLength 255 */
  title: string
  title_ca: string | null
  title_de: string | null
  title_detected_language: string | null
  title_en: string | null
  title_es: string | null
  title_et: string | null
  title_fr: string | null
  title_nl: string | null
  /** @format date-time */
  updated_at: string
}

export type ProjectTabItemCreateData = ProjectTabItem

export type ProjectTabItemDestroyData = any

export type ProjectTabItemImageCreateData = Image

/** @format binary */
export type ProjectTabItemImageCreatePayload = File

export type ProjectTabItemImageDestroyData = any

export type ProjectTabItemImagePartialUpdateData = Image

export type ProjectTabItemImageRetrieveData = Image

export type ProjectTabItemImageUpdateData = Image

export type ProjectTabItemListData = PaginatedProjectTabItemList

export type ProjectTabItemPartialUpdateData = ProjectTabItem

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectTabItemRequest {
  content?: string
  images?: number[]
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
}

export type ProjectTabItemRetrieveData = ProjectTabItem

export type ProjectTabItemUpdateData = ProjectTabItem

export type ProjectTabListData = PaginatedProjectTabList

export type ProjectTabPartialUpdateData = ProjectTab

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectTabRequest {
  description?: string
  /** @maxLength 255 */
  icon?: string
  images?: number[]
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
  type?: ProjectTabTypeEnum
}

export type ProjectTabRetrieveData = ProjectTab

export enum ProjectTabTypeEnum {
  Text = 'text',
  Blog = 'blog',
}

export type ProjectTabUpdateData = ProjectTab

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ProjectTemplate {
  audience: AudienceEnum
  blogentry_content: string
  blogentry_content_ca: string | null
  blogentry_content_de: string | null
  blogentry_content_detected_language: string | null
  blogentry_content_en: string | null
  blogentry_content_es: string | null
  blogentry_content_et: string | null
  blogentry_content_fr: string | null
  blogentry_content_nl: string | null
  blogentry_title: string
  blogentry_title_ca: string | null
  blogentry_title_de: string | null
  blogentry_title_detected_language: string | null
  blogentry_title_en: string | null
  blogentry_title_es: string | null
  blogentry_title_et: string | null
  blogentry_title_fr: string | null
  blogentry_title_nl: string | null
  comment_content: string
  comment_content_ca: string | null
  comment_content_de: string | null
  comment_content_detected_language: string | null
  comment_content_en: string | null
  comment_content_es: string | null
  comment_content_et: string | null
  comment_content_fr: string | null
  comment_content_nl: string | null
  description: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  goal_description: string
  goal_description_ca: string | null
  goal_description_de: string | null
  goal_description_detected_language: string | null
  goal_description_en: string | null
  goal_description_es: string | null
  goal_description_et: string | null
  goal_description_fr: string | null
  goal_description_nl: string | null
  goal_title: string
  goal_title_ca: string | null
  goal_title_de: string | null
  goal_title_detected_language: string | null
  goal_title_en: string | null
  goal_title_es: string | null
  goal_title_et: string | null
  goal_title_fr: string | null
  goal_title_nl: string | null
  id: number
  language: LanguageEnum
  name: string
  name_ca: string | null
  name_de: string | null
  name_detected_language: string | null
  name_en: string | null
  name_es: string | null
  name_et: string | null
  name_fr: string | null
  name_nl: string | null
  project_description: string
  project_description_ca: string | null
  project_description_de: string | null
  project_description_detected_language: string | null
  project_description_en: string | null
  project_description_es: string | null
  project_description_et: string | null
  project_description_fr: string | null
  project_description_nl: string | null
  project_purpose: string
  project_purpose_ca: string | null
  project_purpose_de: string | null
  project_purpose_detected_language: string | null
  project_purpose_en: string | null
  project_purpose_es: string | null
  project_purpose_et: string | null
  project_purpose_fr: string | null
  project_purpose_nl: string | null
  project_tags: string[]
  project_title: string
  project_title_ca: string | null
  project_title_de: string | null
  project_title_detected_language: string | null
  project_title_en: string | null
  project_title_es: string | null
  project_title_et: string | null
  project_title_fr: string | null
  project_title_nl: string | null
  review_description: string
  review_description_ca: string | null
  review_description_de: string | null
  review_description_detected_language: string | null
  review_description_en: string | null
  review_description_es: string | null
  review_description_et: string | null
  review_description_fr: string | null
  review_description_nl: string | null
  review_title: string
  review_title_ca: string | null
  review_title_de: string | null
  review_title_detected_language: string | null
  review_title_en: string | null
  review_title_es: string | null
  review_title_et: string | null
  review_title_fr: string | null
  review_title_nl: string | null
  share_globally: boolean
  time_estimation: TimeEstimationEnum
}

export type ProjectUnlockCreateData = Project

export type ProjectUpdateData = Project

export interface ProjectVersion {
  categories: string[]
  comments: Record<string, any>
  delta: Record<string, string>
  description?: string
  /** @maxLength 100 */
  history_change_reason?: string | null
  /** @format date-time */
  history_date: string
  id: number
  linked_projects: Record<string, any>
  members: string[]
  project_id: string
  /** Main goal */
  purpose?: string
  tags: string[]
  /** @maxLength 255 */
  title: string
}

export interface ProjectVersionList {
  /** @maxLength 100 */
  history_change_reason?: string | null
  /** @format date-time */
  history_date: string
  id: number
  project_id: string
  updated_fields: string[]
}

export enum PublicationStatus {
  Public = 'public',
  Private = 'private',
  Org = 'org',
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
  /** @format date-time */
  created_at: string
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  id: number
  project_id: string
  reviewer: UserLighter
  /** @maxLength 100 */
  title: string
  title_ca: string | null
  title_de: string | null
  title_detected_language: string | null
  title_en: string | null
  title_es: string | null
  title_et: string | null
  title_fr: string | null
  title_nl: string | null
  /** @format date-time */
  updated_at: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface ReviewRequest {
  description?: string
  /** @minLength 1 */
  project_id: string
  /**
   * @minLength 1
   * @maxLength 100
   */
  title: string
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

export type SearchList2Data = PaginatedSearchObjectList

export type SearchListData = PaginatedSearchObjectList

export interface SearchObject {
  id: number
  /** @format date-time */
  last_update: string | null
  people_group: PeopleGroupLight
  project: ProjectSearch
  type: SearchObjectTypeEnum
  user: UserLighter
}

export enum SearchObjectTypeEnum {
  Project = 'project',
  PeopleGroup = 'people_group',
  User = 'user',
}

export enum SecondaryTypeEnum {
  Skill = 'skill',
  Occupation = 'occupation',
  Tag = 'tag',
}

export enum SendToEnum {
  Primary = 'primary',
  Personal = 'personal',
}

export interface Skill {
  can_mentor?: boolean
  /** @maxLength 255 */
  category?: string
  comment?: string
  id: number
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
  needs_mentor?: boolean
  tag: string
  type?: TypeD3EEnum
  /** @format uuid */
  user: string
}

export interface SkillLight {
  can_mentor: boolean
  category: string
  comment: string
  id: number
  level: number
  level_to_reach: number
  needs_mentor: boolean
  tag: Tag
  type: TypeD3EEnum
}

export interface SkillRequest {
  can_mentor?: boolean
  /** @maxLength 255 */
  category?: string
  comment?: string
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
  needs_mentor?: boolean
  tag: string
  type?: TypeD3EEnum
}

export interface Stats {
  by_month: ProjectByMonth[]
  by_sdg: ProjectBySDG[]
  top_tags: TagProject[]
  total: number
}

export enum StatusD3DEnum {
  Pending = 'pending',
  Accepted = 'accepted',
  Rejected = 'rejected',
}

/** Automatically translate model fields for model with registered translation */
export interface Tag {
  description?: string
  /** Description [ca] */
  description_ca?: string | null
  /** Description [de] */
  description_de?: string | null
  /** Description [en] */
  description_en?: string | null
  /** Description [es] */
  description_es?: string | null
  /** Description [et] */
  description_et?: string | null
  /** Description [fr] */
  description_fr?: string | null
  /** Description [nl] */
  description_nl?: string | null
  highlight: Record<string, any>
  id: number
  mentorees_count: number
  mentors_count: number
  secondary_type: SecondaryTypeEnum
  /** @maxLength 255 */
  title: string
  /**
   * Title [ca]
   * @maxLength 255
   */
  title_ca?: string | null
  /**
   * Title [de]
   * @maxLength 255
   */
  title_de?: string | null
  /**
   * Title [en]
   * @maxLength 255
   */
  title_en?: string | null
  /**
   * Title [es]
   * @maxLength 255
   */
  title_es?: string | null
  /**
   * Title [et]
   * @maxLength 255
   */
  title_et?: string | null
  /**
   * Title [fr]
   * @maxLength 255
   */
  title_fr?: string | null
  /**
   * Title [nl]
   * @maxLength 255
   */
  title_nl?: string | null
  type: Type06EEnum
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface TagClassification {
  /** @maxLength 500 */
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  id: number
  is_enabled_for_projects: boolean
  is_enabled_for_skills: boolean
  is_owned: boolean
  is_public?: boolean
  organization: string
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
  /** @maxLength 50 */
  title: string
  title_ca: string | null
  title_de: string | null
  title_detected_language: string | null
  title_en: string | null
  title_es: string | null
  title_et: string | null
  title_fr: string | null
  title_nl: string | null
  type: Type06EEnum
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
  /** @maxLength 500 */
  description?: string
  is_public?: boolean
  /**
   * @minLength 1
   * @maxLength 50
   */
  title: string
}

export type TagListData = PaginatedTagList

/** Automatically translate model fields for model with registered translation */
export interface TagProject {
  id: number
  project_count: number
  projects: string[]
  /** @maxLength 255 */
  title: string
  /**
   * Title [ca]
   * @maxLength 255
   */
  title_ca?: string | null
  /**
   * Title [de]
   * @maxLength 255
   */
  title_de?: string | null
  /**
   * Title [en]
   * @maxLength 255
   */
  title_en?: string | null
  /**
   * Title [es]
   * @maxLength 255
   */
  title_es?: string | null
  /**
   * Title [et]
   * @maxLength 255
   */
  title_et?: string | null
  /**
   * Title [fr]
   * @maxLength 255
   */
  title_fr?: string | null
  /**
   * Title [nl]
   * @maxLength 255
   */
  title_nl?: string | null
}

/** Automatically translate model fields for model with registered translation */
export interface TagRequest {
  description?: string
  /**
   * Description [ca]
   * @minLength 1
   */
  description_ca?: string | null
  /**
   * Description [de]
   * @minLength 1
   */
  description_de?: string | null
  /**
   * Description [en]
   * @minLength 1
   */
  description_en?: string | null
  /**
   * Description [es]
   * @minLength 1
   */
  description_es?: string | null
  /**
   * Description [et]
   * @minLength 1
   */
  description_et?: string | null
  /**
   * Description [fr]
   * @minLength 1
   */
  description_fr?: string | null
  /**
   * Description [nl]
   * @minLength 1
   */
  description_nl?: string | null
  /**
   * @minLength 1
   * @maxLength 255
   */
  title: string
  /**
   * Title [ca]
   * @minLength 1
   * @maxLength 255
   */
  title_ca?: string | null
  /**
   * Title [de]
   * @minLength 1
   * @maxLength 255
   */
  title_de?: string | null
  /**
   * Title [en]
   * @minLength 1
   * @maxLength 255
   */
  title_en?: string | null
  /**
   * Title [es]
   * @minLength 1
   * @maxLength 255
   */
  title_es?: string | null
  /**
   * Title [et]
   * @minLength 1
   * @maxLength 255
   */
  title_et?: string | null
  /**
   * Title [fr]
   * @minLength 1
   * @maxLength 255
   */
  title_fr?: string | null
  /**
   * Title [nl]
   * @minLength 1
   * @maxLength 255
   */
  title_nl?: string | null
}

export type TagRetrieveData = Tag

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface Template {
  audience?: AudienceEnum | BlankEnum
  blogentry_content?: string
  blogentry_content_ca: string | null
  blogentry_content_de: string | null
  blogentry_content_detected_language: string | null
  blogentry_content_en: string | null
  blogentry_content_es: string | null
  blogentry_content_et: string | null
  blogentry_content_fr: string | null
  blogentry_content_nl: string | null
  /** @maxLength 255 */
  blogentry_title?: string
  blogentry_title_ca: string | null
  blogentry_title_de: string | null
  blogentry_title_detected_language: string | null
  blogentry_title_en: string | null
  blogentry_title_es: string | null
  blogentry_title_et: string | null
  blogentry_title_fr: string | null
  blogentry_title_nl: string | null
  categories: ProjectCategoryLight[]
  comment_content?: string
  comment_content_ca: string | null
  comment_content_de: string | null
  comment_content_detected_language: string | null
  comment_content_en: string | null
  comment_content_es: string | null
  comment_content_et: string | null
  comment_content_fr: string | null
  comment_content_nl: string | null
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  goal_description?: string
  goal_description_ca: string | null
  goal_description_de: string | null
  goal_description_detected_language: string | null
  goal_description_en: string | null
  goal_description_es: string | null
  goal_description_et: string | null
  goal_description_fr: string | null
  goal_description_nl: string | null
  /** @maxLength 255 */
  goal_title?: string
  goal_title_ca: string | null
  goal_title_de: string | null
  goal_title_detected_language: string | null
  goal_title_en: string | null
  goal_title_es: string | null
  goal_title_et: string | null
  goal_title_fr: string | null
  goal_title_nl: string | null
  id: number
  language?: LanguageEnum
  /** @maxLength 255 */
  name?: string
  name_ca: string | null
  name_de: string | null
  name_detected_language: string | null
  name_en: string | null
  name_es: string | null
  name_et: string | null
  name_fr: string | null
  name_nl: string | null
  organization: string
  project_description?: string
  project_description_ca: string | null
  project_description_de: string | null
  project_description_detected_language: string | null
  project_description_en: string | null
  project_description_es: string | null
  project_description_et: string | null
  project_description_fr: string | null
  project_description_nl: string | null
  project_purpose?: string
  project_purpose_ca: string | null
  project_purpose_de: string | null
  project_purpose_detected_language: string | null
  project_purpose_en: string | null
  project_purpose_es: string | null
  project_purpose_et: string | null
  project_purpose_fr: string | null
  project_purpose_nl: string | null
  project_tags?: string[]
  /** @maxLength 255 */
  project_title?: string
  project_title_ca: string | null
  project_title_de: string | null
  project_title_detected_language: string | null
  project_title_en: string | null
  project_title_es: string | null
  project_title_et: string | null
  project_title_fr: string | null
  project_title_nl: string | null
  review_description?: string
  review_description_ca: string | null
  review_description_de: string | null
  review_description_detected_language: string | null
  review_description_en: string | null
  review_description_es: string | null
  review_description_et: string | null
  review_description_fr: string | null
  review_description_nl: string | null
  /** @maxLength 255 */
  review_title?: string
  review_title_ca: string | null
  review_title_de: string | null
  review_title_detected_language: string | null
  review_title_en: string | null
  review_title_es: string | null
  review_title_et: string | null
  review_title_fr: string | null
  review_title_nl: string | null
  share_globally?: boolean
  time_estimation?: TimeEstimationEnum | BlankEnum
}

export enum TemplateEnum {
  EmailWithName = 'email_with_name',
  EmailWithoutName = 'email_without_name',
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface TemplateLight {
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  id: number
  /** @maxLength 255 */
  name?: string
  name_ca: string | null
  name_de: string | null
  name_detected_language: string | null
  name_en: string | null
  name_es: string | null
  name_et: string | null
  name_fr: string | null
  name_nl: string | null
  organization: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface TemplateLightRequest {
  description?: string
  /** @maxLength 255 */
  name?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface TemplateRequest {
  audience?: AudienceEnum | BlankEnum
  blogentry_content?: string
  /** @maxLength 255 */
  blogentry_title?: string
  categories_ids?: number[]
  comment_content?: string
  description?: string
  goal_description?: string
  /** @maxLength 255 */
  goal_title?: string
  language?: LanguageEnum
  /** @maxLength 255 */
  name?: string
  project_description?: string
  project_purpose?: string
  project_tags?: string[]
  /** @maxLength 255 */
  project_title?: string
  review_description?: string
  /** @maxLength 255 */
  review_title?: string
  share_globally?: boolean
  time_estimation?: TimeEstimationEnum | BlankEnum
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
  content_ca: string | null
  content_de: string | null
  content_detected_language: string | null
  content_en: string | null
  content_es: string | null
  content_et: string | null
  content_fr: string | null
  content_nl: string | null
  displayed_content: string
  displayed_content_organization: string
  displayed_version: number
  id: number
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

export enum TimeEstimationEnum {
  Value110Hrs = '1-10hrs',
  Value1140Hrs = '11-40hrs',
  Value41120Hrs = '41-120hrs',
  Over120Hrs = 'Over 120hrs',
}

export enum Type06EEnum {
  Wikipedia = 'Wikipedia',
  ESCO = 'ESCO',
  Custom = 'Custom',
}

export enum TypeD3EEnum {
  Skill = 'skill',
  Hobby = 'hobby',
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface User {
  /** @format date */
  birthdate?: string | null
  /** @format date-time */
  created_at: string
  description?: string
  description_ca: string | null
  description_de: string | null
  description_detected_language: string | null
  description_en: string | null
  description_es: string | null
  description_et: string | null
  description_fr: string | null
  description_nl: string | null
  /** @format email */
  email?: string
  facebook?: string
  /** @maxLength 255 */
  family_name?: string
  /** @maxLength 255 */
  given_name?: string
  id: number
  is_superuser: boolean
  /** @maxLength 255 */
  job?: string
  job_ca: string | null
  job_de: string | null
  job_detected_language: string | null
  job_en: string | null
  job_es: string | null
  job_et: string | null
  job_fr: string | null
  job_nl: string | null
  /** @format uuid */
  keycloak_id: string | null
  landline_phone?: string
  language?: LanguageEnum
  linkedin?: string
  location?: string
  medium?: string
  mobile_phone?: string
  notifications: number
  onboarding_status?: Record<string, any>
  people_groups: any[]
  /**
   * id of user in people
   * @format uuid
   */
  people_id?: string | null
  permissions: string[]
  /** @format email */
  personal_email?: string
  privacy_settings: PrivacySettings
  profile_picture: Record<string, any>
  /** @maxLength 32 */
  pronouns?: string
  sdgs?: number[]
  short_description?: string
  short_description_ca: string | null
  short_description_de: string | null
  short_description_detected_language: string | null
  short_description_en: string | null
  short_description_es: string | null
  short_description_et: string | null
  short_description_fr: string | null
  short_description_nl: string | null
  signed_terms_and_conditions?: Record<string, any>
  skills: Record<string, any>[]
  skype?: string
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
  twitter?: string
  website?: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface UserAdminList {
  /** @format date-time */
  created_at: string
  current_org_role: string
  email: string
  email_verified: boolean
  family_name: string
  given_name: string
  id: number
  job: string
  job_ca: string | null
  job_de: string | null
  job_detected_language: string | null
  job_en: string | null
  job_es: string | null
  job_et: string | null
  job_fr: string | null
  job_nl: string | null
  /** @format uuid */
  keycloak_id: string | null
  /** @format date-time */
  last_login: string | null
  people_groups: any[]
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
}

export type UserAdminListRetrieveData = UserAdminList

export type UserAnonymousRetrieveData = User

export type UserCreateData = User

export type UserDestroyData = any

export type UserFollowCreateData = Follow

export type UserFollowDestroyData = any

export type UserFollowFollowManyCreateData = Follow

export type UserFollowListData = PaginatedFollowList

/** Used to follow several projects at once. */
export interface UserFollowManyRequest {
  follows: FollowRequest[]
}

export type UserGetByEmailRetrieveData = User

export type UserHasPermissionsRetrieveData = Result

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface UserLight {
  can_mentor_on: Record<string, any>[]
  /** @format date-time */
  created_at: string
  current_org_role: string
  /** @format email */
  email?: string
  family_name: string
  given_name: string
  id: number
  job: string
  job_ca: string | null
  job_de: string | null
  job_detected_language: string | null
  job_en: string | null
  job_es: string | null
  job_et: string | null
  job_fr: string | null
  job_nl: string | null
  /** @format uuid */
  keycloak_id: string | null
  /** @format date-time */
  last_login: string | null
  needs_mentor_on: Record<string, any>[]
  people_groups: any[]
  /**
   * id of user in people
   * @format uuid
   */
  people_id: string | null
  profile_picture: Record<string, any> | string
  pronouns?: string
  skills: Record<string, any>[]
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
}

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface UserLighter {
  /** @format email */
  email?: string
  family_name: string
  given_name: string
  id: number
  is_leader: boolean
  is_manager: boolean
  job: string
  job_ca: string | null
  job_de: string | null
  job_detected_language: string | null
  job_en: string | null
  job_es: string | null
  job_et: string | null
  job_fr: string | null
  job_nl: string | null
  /** @format uuid */
  keycloak_id: string | null
  profile_picture: Record<string, any>
  pronouns: string
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
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
  /** @format email */
  email?: string
  family_name: string
  given_name: string
  id: number
  is_leader: boolean
  is_manager: boolean
  job: string
  job_ca: string | null
  job_de: string | null
  job_detected_language: string | null
  job_en: string | null
  job_es: string | null
  job_et: string | null
  job_fr: string | null
  job_nl: string | null
  /** @format uuid */
  keycloak_id: string | null
  profile_picture: Record<string, any>
  pronouns: string
  /** @pattern ^[-a-zA-Z0-9_]+$ */
  slug: string
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

export type UserListData = PaginatedUserLightList

export type UserPartialUpdateData = User

export type UserProfilePictureCreateData = Image

/** @format binary */
export type UserProfilePictureCreatePayload = File

export type UserProfilePictureDestroyData = any

export type UserProfilePicturePartialUpdateData = Image

export type UserProfilePictureUpdateData = Image

export type UserRefreshKeycloakActionsLinkRetrieveData = Record<string, any>

export type UserRemoveAuthenticationCookieRetrieveData = EmptyPayloadResponse

/**
 * Automatically include translations fields for models with `HasAutoTranslatedFields` mixin.
 *
 * Because these are automatically generated, they are read-only.
 */
export interface UserRequest {
  /** @format date */
  birthdate?: string | null
  description?: string
  /** @format email */
  email?: string
  facebook?: string
  /** @maxLength 255 */
  family_name?: string
  /** @maxLength 255 */
  given_name?: string
  /** @maxLength 255 */
  job?: string
  landline_phone?: string
  language?: LanguageEnum
  linkedin?: string
  location?: string
  medium?: string
  mobile_phone?: string
  onboarding_status?: Record<string, any>
  /**
   * id of user in people
   * @format uuid
   */
  people_id?: string | null
  /** @format email */
  personal_email?: string
  /** @format binary */
  profile_picture_file?: File | null
  /** @format double */
  profile_picture_left?: number | null
  /** @format double */
  profile_picture_natural_ratio?: number | null
  /** @format double */
  profile_picture_scale_x?: number | null
  /** @format double */
  profile_picture_scale_y?: number | null
  /** @format double */
  profile_picture_top?: number | null
  /** @maxLength 32 */
  pronouns?: string
  roles_to_add?: string[]
  roles_to_remove?: string[]
  sdgs?: number[]
  short_description?: string
  signed_terms_and_conditions?: Record<string, any>
  skype?: string
  twitter?: string
  website?: string
}

export type UserResetPasswordCreateData = Record<string, any>

export type UserResetPasswordRetrieveData = Record<string, any>

export type UserRetrieveData = User

export type UserReviewCreateData = Review

export type UserReviewDestroyData = any

export type UserReviewListData = PaginatedReviewList

export type UserReviewPartialUpdateData = Review

export type UserReviewRetrieveData = Review

export type UserReviewUpdateData = Review

export type UserSkillCreateData = Skill

export type UserSkillDestroyData = any

export type UserSkillPartialUpdateData = Skill

export type UserSkillUpdateData = Skill

export type UserUpdateData = User

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
  }: FullRequestParams): Promise<T> => {
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

      if (!response.ok) throw data
      return data.data
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
    apiSchemaRetrieve: (
      query?: {
        format?: 'json' | 'yaml'
        lang?: 'ca' | 'de' | 'en' | 'es' | 'et' | 'fr' | 'nl'
      },
      params: RequestParams = {}
    ) =>
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
    announcementList: (
      query?: {
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
      },
      params: RequestParams = {}
    ) =>
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
    announcementRetrieve: (id: string, params: RequestParams = {}) =>
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
     * No description
     *
     * @tags email
     * @name EmailDestroy
     * @request DELETE:/v1/email/{id}/
     * @secure
     */
    emailDestroy: (id: string, params: RequestParams = {}) =>
      this.request<EmailDestroyData, any>({
        path: `/v1/email/${id}/`,
        method: 'DELETE',
        secure: true,
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
      emailId: string,
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
     * @name EmailImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/email/{emailId}/image/{id}/
     * @secure
     */
    emailImageDestroy: (emailId: string, id: number, params: RequestParams = {}) =>
      this.request<EmailImageDestroyData, any>({
        path: `/v1/email/${emailId}/image/${id}/`,
        method: 'DELETE',
        secure: true,
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
      emailId: string,
      id: number,
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
     * @name EmailImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/email/{emailId}/image/{id}/
     * @secure
     */
    emailImageRetrieve: (emailId: string, id: number, params: RequestParams = {}) =>
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
      emailId: string,
      id: number,
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
     * No description
     *
     * @tags email
     * @name EmailList
     * @request GET:/v1/email/
     * @secure
     */
    emailList: (
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
        /** Which field to use when ordering the results. */
        ordering?: string
        /** A search term. */
        search?: string
      },
      params: RequestParams = {}
    ) =>
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
     * @name EmailPartialUpdate
     * @request PATCH:/v1/email/{id}/
     * @secure
     */
    emailPartialUpdate: (id: string, data: PatchedEmailRequest, params: RequestParams = {}) =>
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
     * @name EmailRetrieve
     * @request GET:/v1/email/{id}/
     * @secure
     */
    emailRetrieve: (id: string, params: RequestParams = {}) =>
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
    emailUpdate: (id: string, data: EmailRequest, params: RequestParams = {}) =>
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
    locationList: (
      query?: {
        /** Which field to use when ordering the results. */
        ordering?: string
        /** Multiple values may be separated by commas. */
        organizations?: string[]
        /** A search term. */
        search?: string
      },
      params: RequestParams = {}
    ) =>
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
    locationRetrieve: (id: string, params: RequestParams = {}) =>
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
    notificationList: (
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
        /** Which field to use when ordering the results. */
        ordering?: string
        /** A search term. */
        search?: string
      },
      params: RequestParams = {}
    ) =>
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
     * @name NotificationsSettingPartialUpdate
     * @summary Allows getting or modifying a user's notification settings.
     * @request PATCH:/v1/notifications-setting/{userId}/
     * @secure
     */
    notificationsSettingPartialUpdate: (
      userId: number,
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
     * @description Allows getting or modifying a user's notification settings.
     *
     * @tags notifications-setting
     * @name NotificationsSettingRetrieve
     * @summary Allows getting or modifying a user's notification settings.
     * @request GET:/v1/notifications-setting/{userId}/
     * @secure
     */
    notificationsSettingRetrieve: (userId: number, params: RequestParams = {}) =>
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
      userId: number,
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
      organizationCode: string,
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
 * @name OrganizationAccessRequestCreate
 * @summary A viewset that provides `list` and `create` actions.

To use it, override the class and set the `.queryset` and
`.serializer_class` attributes.
 * @request POST:/v1/organization/{organizationCode}/access-request/
 * @secure
 */
    organizationAccessRequestCreate: (
      organizationCode: string,
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
 * @name OrganizationAccessRequestDeclineCreate
 * @summary A viewset that provides `list` and `create` actions.

To use it, override the class and set the `.queryset` and
`.serializer_class` attributes.
 * @request POST:/v1/organization/{organizationCode}/access-request/decline/
 * @secure
 */
    organizationAccessRequestDeclineCreate: (
      organizationCode: string,
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
      organizationCode: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
        /** Which field to use when ordering the results. */
        ordering?: string
        /** A search term. */
        search?: string
        status?: 'accepted' | 'declined' | 'pending'
      },
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
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationBannerCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/organization/{organizationCode}/banner/
     * @secure
     */
    organizationBannerCreate: (
      organizationCode: string,
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
     * @name OrganizationBannerDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/banner/{id}/
     * @secure
     */
    organizationBannerDestroy: (id: number, organizationCode: string, params: RequestParams = {}) =>
      this.request<OrganizationBannerDestroyData, any>({
        path: `/v1/organization/${organizationCode}/banner/${id}/`,
        method: 'DELETE',
        secure: true,
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
      id: number,
      organizationCode: string,
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
     * @name OrganizationBannerUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/organization/{organizationCode}/banner/{id}/
     * @secure
     */
    organizationBannerUpdate: (
      id: number,
      organizationCode: string,
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
     * @description Get the people groups hierarchy of the organization.
     *
     * @tags organization
     * @name OrganizationCategoriesHierarchyRetrieve
     * @summary Get the people groups hierarchy of the organization.
     * @request GET:/v1/organization/{code}/categories-hierarchy/
     * @secure
     */
    organizationCategoriesHierarchyRetrieve: (code: string, params: RequestParams = {}) =>
      this.request<OrganizationCategoriesHierarchyRetrieveData, any>({
        path: `/v1/organization/${code}/categories-hierarchy/`,
        method: 'GET',
        secure: true,
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
      categoryId: string,
      organizationCode: string,
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
     * @name OrganizationCategoryBackgroundDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/category/{categoryId}/background/{id}/
     * @secure
     */
    organizationCategoryBackgroundDestroy: (
      categoryId: string,
      id: number,
      organizationCode: string,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationCategoryBackgroundDestroyData, any>({
        path: `/v1/organization/${organizationCode}/category/${categoryId}/background/${id}/`,
        method: 'DELETE',
        secure: true,
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
      categoryId: string,
      id: number,
      organizationCode: string,
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
     * @name OrganizationCategoryBackgroundUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/organization/{organizationCode}/category/{categoryId}/background/{id}/
     * @secure
     */
    organizationCategoryBackgroundUpdate: (
      categoryId: string,
      id: number,
      organizationCode: string,
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
     * No description
     *
     * @tags organization
     * @name OrganizationCategoryCreate
     * @request POST:/v1/organization/{organizationCode}/category/
     * @secure
     */
    organizationCategoryCreate: (
      organizationCode: string,
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
     * No description
     *
     * @tags organization
     * @name OrganizationCategoryDestroy
     * @request DELETE:/v1/organization/{organizationCode}/category/{id}/
     * @secure
     */
    organizationCategoryDestroy: (
      id: string,
      organizationCode: string,
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
      id: string,
      organizationCode: string,
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
     * @name OrganizationCategoryList
     * @request GET:/v1/organization/{organizationCode}/category/
     * @secure
     */
    organizationCategoryList: (
      organizationCode: string,
      query?: {
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
      },
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
     * @name OrganizationCategoryPartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/category/{id}/
     * @secure
     */
    organizationCategoryPartialUpdate: (
      id: string,
      organizationCode: string,
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
     * @name OrganizationCategoryProjectsLifeStatusCreate
     * @request POST:/v1/organization/{organizationCode}/category/{id}/projects-life-status/
     * @secure
     */
    organizationCategoryProjectsLifeStatusCreate: (
      id: string,
      organizationCode: string,
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
      id: string,
      organizationCode: string,
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
     * No description
     *
     * @tags organization
     * @name OrganizationCategoryRetrieve
     * @request GET:/v1/organization/{organizationCode}/category/{id}/
     * @secure
     */
    organizationCategoryRetrieve: (
      id: string,
      organizationCode: string,
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
      id: string,
      organizationCode: string,
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
     * @description Allow to send an abuse report email.
     *
     * @tags organization
     * @name OrganizationContactUsCreate
     * @summary Allow to send an abuse report email.
     * @request POST:/v1/organization/{organizationCode}/contact/us/
     * @secure
     */
    organizationContactUsCreate: (
      organizationCode: string,
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
     * @name OrganizationDestroy
     * @request DELETE:/v1/organization/{code}/
     * @secure
     */
    organizationDestroy: (code: string, params: RequestParams = {}) =>
      this.request<OrganizationDestroyData, any>({
        path: `/v1/organization/${code}/`,
        method: 'DELETE',
        secure: true,
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
    organizationEventCreate: (organizationCode: string, params: RequestParams = {}) =>
      this.request<OrganizationEventCreateData, any>({
        path: `/v1/organization/${organizationCode}/event/`,
        method: 'POST',
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
    organizationEventDestroy: (id: string, organizationCode: string, params: RequestParams = {}) =>
      this.request<OrganizationEventDestroyData, any>({
        path: `/v1/organization/${organizationCode}/event/${id}/`,
        method: 'DELETE',
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
      eventId: string,
      organizationCode: string,
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
     * @name OrganizationEventImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/event/{eventId}/image/{id}/
     * @secure
     */
    organizationEventImageDestroy: (
      eventId: string,
      id: number,
      organizationCode: string,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationEventImageDestroyData, any>({
        path: `/v1/organization/${organizationCode}/event/${eventId}/image/${id}/`,
        method: 'DELETE',
        secure: true,
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
      eventId: string,
      id: number,
      organizationCode: string,
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
     * @name OrganizationEventImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/organization/{organizationCode}/event/{eventId}/image/{id}/
     * @secure
     */
    organizationEventImageRetrieve: (
      eventId: string,
      id: number,
      organizationCode: string,
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
      eventId: string,
      id: number,
      organizationCode: string,
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
     * @description Main endpoints for projects.
     *
     * @tags organization
     * @name OrganizationEventList
     * @summary Main endpoints for projects.
     * @request GET:/v1/organization/{organizationCode}/event/
     * @secure
     */
    organizationEventList: (
      organizationCode: string,
      query?: {
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
      },
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
     * @name OrganizationEventPartialUpdate
     * @summary Main endpoints for projects.
     * @request PATCH:/v1/organization/{organizationCode}/event/{id}/
     * @secure
     */
    organizationEventPartialUpdate: (
      id: string,
      organizationCode: string,
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
     * @name OrganizationEventRetrieve
     * @summary Main endpoints for projects.
     * @request GET:/v1/organization/{organizationCode}/event/{id}/
     * @secure
     */
    organizationEventRetrieve: (id: string, organizationCode: string, params: RequestParams = {}) =>
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
    organizationEventUpdate: (id: string, organizationCode: string, params: RequestParams = {}) =>
      this.request<OrganizationEventUpdateData, any>({
        path: `/v1/organization/${organizationCode}/event/${id}/`,
        method: 'PUT',
        secure: true,
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
      code: string,
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
      code: string,
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
     * No description
     *
     * @tags organization
     * @name OrganizationFeaturedProjectRetrieve
     * @request GET:/v1/organization/{code}/featured-project/
     * @secure
     */
    organizationFeaturedProjectRetrieve: (
      code: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
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
     * @name OrganizationFileCreate
     * @request POST:/v1/organization/{organizationCode}/file/
     * @secure
     */
    organizationFileCreate: (
      organizationCode: string,
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
     * @name OrganizationFileDestroy
     * @request DELETE:/v1/organization/{organizationCode}/file/{id}/
     * @secure
     */
    organizationFileDestroy: (id: string, organizationCode: string, params: RequestParams = {}) =>
      this.request<OrganizationFileDestroyData, any>({
        path: `/v1/organization/${organizationCode}/file/${id}/`,
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
      organizationCode: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
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
     * @name OrganizationFilePartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/file/{id}/
     * @secure
     */
    organizationFilePartialUpdate: (
      id: string,
      organizationCode: string,
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
     * @name OrganizationFileRetrieve
     * @request GET:/v1/organization/{organizationCode}/file/{id}/
     * @secure
     */
    organizationFileRetrieve: (id: string, organizationCode: string, params: RequestParams = {}) =>
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
      id: string,
      organizationCode: string,
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
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationImageCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/organization/{organizationCode}/image/
     * @secure
     */
    organizationImageCreate: (
      organizationCode: string,
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
     * @name OrganizationImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/image/{id}/
     * @secure
     */
    organizationImageDestroy: (id: number, organizationCode: string, params: RequestParams = {}) =>
      this.request<OrganizationImageDestroyData, any>({
        path: `/v1/organization/${organizationCode}/image/${id}/`,
        method: 'DELETE',
        secure: true,
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
      id: number,
      organizationCode: string,
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
     * @name OrganizationImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/organization/{organizationCode}/image/{id}/
     * @secure
     */
    organizationImageRetrieve: (id: number, organizationCode: string, params: RequestParams = {}) =>
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
      id: number,
      organizationCode: string,
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
     * @description Main endpoints for instructions.
     *
     * @tags organization
     * @name OrganizationInstructionCreate
     * @summary Main endpoints for instructions.
     * @request POST:/v1/organization/{organizationCode}/instruction/
     * @secure
     */
    organizationInstructionCreate: (organizationCode: string, params: RequestParams = {}) =>
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
     * @name OrganizationInstructionDestroy
     * @summary Main endpoints for instructions.
     * @request DELETE:/v1/organization/{organizationCode}/instruction/{id}/
     * @secure
     */
    organizationInstructionDestroy: (
      id: string,
      organizationCode: string,
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
      instructionId: string,
      organizationCode: string,
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
     * @name OrganizationInstructionImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/instruction/{instructionId}/image/{id}/
     * @secure
     */
    organizationInstructionImageDestroy: (
      id: number,
      instructionId: string,
      organizationCode: string,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInstructionImageDestroyData, any>({
        path: `/v1/organization/${organizationCode}/instruction/${instructionId}/image/${id}/`,
        method: 'DELETE',
        secure: true,
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
      id: number,
      instructionId: string,
      organizationCode: string,
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
     * @name OrganizationInstructionImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/organization/{organizationCode}/instruction/{instructionId}/image/{id}/
     * @secure
     */
    organizationInstructionImageRetrieve: (
      id: number,
      instructionId: string,
      organizationCode: string,
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
      id: number,
      instructionId: string,
      organizationCode: string,
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
     * @description Main endpoints for instructions.
     *
     * @tags organization
     * @name OrganizationInstructionList
     * @summary Main endpoints for instructions.
     * @request GET:/v1/organization/{organizationCode}/instruction/
     * @secure
     */
    organizationInstructionList: (
      organizationCode: string,
      query?: {
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
      },
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
     * @name OrganizationInstructionPartialUpdate
     * @summary Main endpoints for instructions.
     * @request PATCH:/v1/organization/{organizationCode}/instruction/{id}/
     * @secure
     */
    organizationInstructionPartialUpdate: (
      id: string,
      organizationCode: string,
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
     * @name OrganizationInstructionRetrieve
     * @summary Main endpoints for instructions.
     * @request GET:/v1/organization/{organizationCode}/instruction/{id}/
     * @secure
     */
    organizationInstructionRetrieve: (
      id: string,
      organizationCode: string,
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
      id: string,
      organizationCode: string,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInstructionUpdateData, any>({
        path: `/v1/organization/${organizationCode}/instruction/${id}/`,
        method: 'PUT',
        secure: true,
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
      organizationCode: string,
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
     * @name OrganizationInvitationDestroy
     * @request DELETE:/v1/organization/{organizationCode}/invitation/{id}/
     * @secure
     */
    organizationInvitationDestroy: (
      id: number,
      organizationCode: string,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationInvitationDestroyData, any>({
        path: `/v1/organization/${organizationCode}/invitation/${id}/`,
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
      organizationCode: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
        /** Which field to use when ordering the results. */
        ordering?: string
      },
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
     * @name OrganizationInvitationPartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/invitation/{id}/
     * @secure
     */
    organizationInvitationPartialUpdate: (
      id: number,
      organizationCode: string,
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
     * @name OrganizationInvitationRetrieve
     * @request GET:/v1/organization/{organizationCode}/invitation/{id}/
     * @secure
     */
    organizationInvitationRetrieve: (
      id: number,
      organizationCode: string,
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
      id: number,
      organizationCode: string,
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
     * @name OrganizationList
     * @request GET:/v1/organization/
     * @secure
     */
    organizationList: (
      query?: {
        /** Multiple values may be separated by commas. */
        codes?: string[]
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
        /** Multiple values may be separated by commas. */
        tags?: string[]
      },
      params: RequestParams = {}
    ) =>
      this.request<OrganizationListData, any>({
        path: `/v1/organization/`,
        method: 'GET',
        query: query,
        secure: true,
        format: 'json',
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
      organizationCode: string,
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
     * @name OrganizationLogoDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/logo/{id}/
     * @secure
     */
    organizationLogoDestroy: (id: number, organizationCode: string, params: RequestParams = {}) =>
      this.request<OrganizationLogoDestroyData, any>({
        path: `/v1/organization/${organizationCode}/logo/${id}/`,
        method: 'DELETE',
        secure: true,
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
      id: number,
      organizationCode: string,
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
     * @name OrganizationLogoRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/organization/{organizationCode}/logo/{id}/
     * @secure
     */
    organizationLogoRetrieve: (id: number, organizationCode: string, params: RequestParams = {}) =>
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
      id: number,
      organizationCode: string,
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
     * @description Add users to the organization's group of the given name.
     *
     * @tags organization
     * @name OrganizationMemberAddCreate
     * @summary Add users to the organization's group of the given name.
     * @request POST:/v1/organization/{code}/member/add/
     * @secure
     */
    organizationMemberAddCreate: (
      code: string,
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
      code: string,
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
     * @description Get all skills in current organization that have at least one mentor.
     *
     * @tags organization
     * @name OrganizationMentoredSkillRetrieve
     * @summary Get all skills in current organization that have at least one mentor.
     * @request GET:/v1/organization/{organizationCode}/mentored-skill/
     * @secure
     */
    organizationMentoredSkillRetrieve: (
      organizationCode: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
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
      organizationCode: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
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
 * @name OrganizationMentoringContactMentorCreate
 * @summary A viewset that provides `retrieve`, `list`, `update`, and `destroy` actions.

To use it, override the class and set the `queryset` and
`serializer_c...
 * @request POST:/v1/organization/{organizationCode}/mentoring/contact-mentor/{skillId}/
 * @secure
 */
    organizationMentoringContactMentorCreate: (
      organizationCode: string,
      skillId: string,
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
      organizationCode: string,
      skillId: string,
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
      id: number,
      organizationCode: string,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationMentoringDestroyData, any>({
        path: `/v1/organization/${organizationCode}/mentoring/${id}/`,
        method: 'DELETE',
        secure: true,
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
      organizationCode: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
        /** Which field to use when ordering the results. */
        ordering?: string
        /** A search term. */
        search?: string
      },
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
      id: number,
      organizationCode: string,
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
 * @name OrganizationMentoringRetrieve
 * @summary A viewset that provides `retrieve`, `list`, `update`, and `destroy` actions.

To use it, override the class and set the `queryset` and
`serializer_c...
 * @request GET:/v1/organization/{organizationCode}/mentoring/{id}/
 * @secure
 */
    organizationMentoringRetrieve: (
      id: number,
      organizationCode: string,
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
     * @description Main endpoints for news.
     *
     * @tags organization
     * @name OrganizationNewsCreate
     * @summary Main endpoints for news.
     * @request POST:/v1/organization/{organizationCode}/news/
     * @secure
     */
    organizationNewsCreate: (organizationCode: string, params: RequestParams = {}) =>
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
     * @name OrganizationNewsDestroy
     * @summary Main endpoints for news.
     * @request DELETE:/v1/organization/{organizationCode}/news/{id}/
     * @secure
     */
    organizationNewsDestroy: (id: string, organizationCode: string, params: RequestParams = {}) =>
      this.request<OrganizationNewsDestroyData, any>({
        path: `/v1/organization/${organizationCode}/news/${id}/`,
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
      organizationCode: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
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
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationNewsHeaderCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/organization/{organizationCode}/news/{newsId}/header/
     * @secure
     */
    organizationNewsHeaderCreate: (
      newsId: string,
      organizationCode: string,
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
     * @name OrganizationNewsHeaderDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/news/{newsId}/header/{id}/
     * @secure
     */
    organizationNewsHeaderDestroy: (
      id: number,
      newsId: string,
      organizationCode: string,
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
     * @name OrganizationNewsHeaderPartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/organization/{organizationCode}/news/{newsId}/header/{id}/
     * @secure
     */
    organizationNewsHeaderPartialUpdate: (
      id: number,
      newsId: string,
      organizationCode: string,
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
     * @name OrganizationNewsHeaderRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/organization/{organizationCode}/news/{newsId}/header/{id}/
     * @secure
     */
    organizationNewsHeaderRetrieve: (
      id: number,
      newsId: string,
      organizationCode: string,
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
      id: number,
      newsId: string,
      organizationCode: string,
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
     * @name OrganizationNewsImageCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/organization/{organizationCode}/news/{newsId}/image/
     * @secure
     */
    organizationNewsImageCreate: (
      newsId: string,
      organizationCode: string,
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
     * @name OrganizationNewsImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/news/{newsId}/image/{id}/
     * @secure
     */
    organizationNewsImageDestroy: (
      id: number,
      newsId: string,
      organizationCode: string,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationNewsImageDestroyData, any>({
        path: `/v1/organization/${organizationCode}/news/${newsId}/image/${id}/`,
        method: 'DELETE',
        secure: true,
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
      id: number,
      newsId: string,
      organizationCode: string,
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
     * @name OrganizationNewsImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/organization/{organizationCode}/news/{newsId}/image/{id}/
     * @secure
     */
    organizationNewsImageRetrieve: (
      id: number,
      newsId: string,
      organizationCode: string,
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
      id: number,
      newsId: string,
      organizationCode: string,
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
     * @description Main endpoints for news.
     *
     * @tags organization
     * @name OrganizationNewsList
     * @summary Main endpoints for news.
     * @request GET:/v1/organization/{organizationCode}/news/
     * @secure
     */
    organizationNewsList: (
      organizationCode: string,
      query?: {
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
      },
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
     * @name OrganizationNewsPartialUpdate
     * @summary Main endpoints for news.
     * @request PATCH:/v1/organization/{organizationCode}/news/{id}/
     * @secure
     */
    organizationNewsPartialUpdate: (
      id: string,
      organizationCode: string,
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
     * @name OrganizationNewsRetrieve
     * @summary Main endpoints for news.
     * @request GET:/v1/organization/{organizationCode}/news/{id}/
     * @secure
     */
    organizationNewsRetrieve: (id: string, organizationCode: string, params: RequestParams = {}) =>
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
    organizationNewsUpdate: (id: string, organizationCode: string, params: RequestParams = {}) =>
      this.request<OrganizationNewsUpdateData, any>({
        path: `/v1/organization/${organizationCode}/news/${id}/`,
        method: 'PUT',
        secure: true,
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
      code: string,
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
     * @name OrganizationPeopleGroupCreate
     * @request POST:/v1/organization/{organizationCode}/people-group/
     * @secure
     */
    organizationPeopleGroupCreate: (
      organizationCode: string,
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
     * @name OrganizationPeopleGroupDestroy
     * @request DELETE:/v1/organization/{organizationCode}/people-group/{id}/
     * @secure
     */
    organizationPeopleGroupDestroy: (
      id: number,
      organizationCode: string,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupDestroyData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${id}/`,
        method: 'DELETE',
        secure: true,
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
      organizationCode: string,
      peopleGroupId: string,
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
     * @name OrganizationPeopleGroupHeaderDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/people-group/{peopleGroupId}/header/
     * @secure
     */
    organizationPeopleGroupHeaderDestroy: (
      organizationCode: string,
      peopleGroupId: string,
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
     * @name OrganizationPeopleGroupHeaderPartialUpdate
     * @summary Allows the upload of images.
     * @request PATCH:/v1/organization/{organizationCode}/people-group/{peopleGroupId}/header/
     * @secure
     */
    organizationPeopleGroupHeaderPartialUpdate: (
      organizationCode: string,
      peopleGroupId: string,
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
     * @name OrganizationPeopleGroupHeaderUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/organization/{organizationCode}/people-group/{peopleGroupId}/header/
     * @secure
     */
    organizationPeopleGroupHeaderUpdate: (
      organizationCode: string,
      peopleGroupId: string,
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
     * No description
     *
     * @tags organization
     * @name OrganizationPeopleGroupHierarchyRetrieve
     * @request GET:/v1/organization/{organizationCode}/people-group/{id}/hierarchy/
     * @secure
     */
    organizationPeopleGroupHierarchyRetrieve: (
      id: number,
      organizationCode: string,
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
     * @name OrganizationPeopleGroupList
     * @request GET:/v1/organization/{organizationCode}/people-group/
     * @secure
     */
    organizationPeopleGroupList: (
      organizationCode: string,
      query?: {
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
      },
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
     * @description Allows the upload of images.
     *
     * @tags organization
     * @name OrganizationPeopleGroupLogoCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/organization/{organizationCode}/people-group/{peopleGroupId}/logo/
     * @secure
     */
    organizationPeopleGroupLogoCreate: (
      organizationCode: string,
      peopleGroupId: string,
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
     * @name OrganizationPeopleGroupLogoDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/people-group/{peopleGroupId}/logo/
     * @secure
     */
    organizationPeopleGroupLogoDestroy: (
      organizationCode: string,
      peopleGroupId: string,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationPeopleGroupLogoDestroyData, any>({
        path: `/v1/organization/${organizationCode}/people-group/${peopleGroupId}/logo/`,
        method: 'DELETE',
        secure: true,
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
      organizationCode: string,
      peopleGroupId: string,
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
     * @name OrganizationPeopleGroupLogoUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/organization/{organizationCode}/people-group/{peopleGroupId}/logo/
     * @secure
     */
    organizationPeopleGroupLogoUpdate: (
      organizationCode: string,
      peopleGroupId: string,
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
     * No description
     *
     * @tags organization
     * @name OrganizationPeopleGroupMemberAddCreate
     * @request POST:/v1/organization/{organizationCode}/people-group/{id}/member/add/
     * @secure
     */
    organizationPeopleGroupMemberAddCreate: (
      id: number,
      organizationCode: string,
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
      id: number,
      organizationCode: string,
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
     * @name OrganizationPeopleGroupMemberRetrieve
     * @request GET:/v1/organization/{organizationCode}/people-group/{id}/member/
     * @secure
     */
    organizationPeopleGroupMemberRetrieve: (
      id: number,
      organizationCode: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
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
     * @name OrganizationPeopleGroupPartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/people-group/{id}/
     * @secure
     */
    organizationPeopleGroupPartialUpdate: (
      id: number,
      organizationCode: string,
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
     * @name OrganizationPeopleGroupProjectAddCreate
     * @request POST:/v1/organization/{organizationCode}/people-group/{id}/project/add/
     * @secure
     */
    organizationPeopleGroupProjectAddCreate: (
      id: number,
      organizationCode: string,
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
      id: number,
      organizationCode: string,
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
     * No description
     *
     * @tags organization
     * @name OrganizationPeopleGroupProjectRetrieve
     * @request GET:/v1/organization/{organizationCode}/people-group/{id}/project/
     * @secure
     */
    organizationPeopleGroupProjectRetrieve: (
      id: number,
      organizationCode: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
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
     * @name OrganizationPeopleGroupRetrieve
     * @request GET:/v1/organization/{organizationCode}/people-group/{id}/
     * @secure
     */
    organizationPeopleGroupRetrieve: (
      id: number,
      organizationCode: string,
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
     * @description Get the people groups hierarchy of the organization.
     *
     * @tags organization
     * @name OrganizationPeopleGroupsHierarchyRetrieve
     * @summary Get the people groups hierarchy of the organization.
     * @request GET:/v1/organization/{code}/people-groups-hierarchy/
     * @secure
     */
    organizationPeopleGroupsHierarchyRetrieve: (code: string, params: RequestParams = {}) =>
      this.request<OrganizationPeopleGroupsHierarchyRetrieveData, any>({
        path: `/v1/organization/${code}/people-groups-hierarchy/`,
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
      id: number,
      organizationCode: string,
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
      organizationCode: string,
      projectId: string,
      query?: {
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
      },
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
     * @description Get recommendations for a project.
     *
     * @tags organization
     * @name OrganizationRecommendedProjectProjectRetrieve
     * @summary Get recommendations for a project.
     * @request GET:/v1/organization/{organizationCode}/recommended-project/project/{projectId}/
     * @secure
     */
    organizationRecommendedProjectProjectRetrieve: (
      organizationCode: string,
      projectId: string,
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
      organizationCode: string,
      query?: {
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
      },
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
     * @description Get recommendations for a user.
     *
     * @tags organization
     * @name OrganizationRecommendedProjectUserRetrieve
     * @summary Get recommendations for a user.
     * @request GET:/v1/organization/{organizationCode}/recommended-project/user/
     * @secure
     */
    organizationRecommendedProjectUserRetrieve: (
      organizationCode: string,
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
      organizationCode: string,
      projectId: string,
      query?: {
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
      },
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
     * @description Get recommendations for a project.
     *
     * @tags organization
     * @name OrganizationRecommendedUserProjectRetrieve
     * @summary Get recommendations for a project.
     * @request GET:/v1/organization/{organizationCode}/recommended-user/project/{projectId}/
     * @secure
     */
    organizationRecommendedUserProjectRetrieve: (
      organizationCode: string,
      projectId: string,
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
      organizationCode: string,
      query?: {
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
      },
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
     * @description Get recommendations for a user.
     *
     * @tags organization
     * @name OrganizationRecommendedUserUserRetrieve
     * @summary Get recommendations for a user.
     * @request GET:/v1/organization/{organizationCode}/recommended-user/user/
     * @secure
     */
    organizationRecommendedUserUserRetrieve: (
      organizationCode: string,
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
     * @description Allow to send an abuse report email.
     *
     * @tags organization
     * @name OrganizationReportAbuseCreate
     * @summary Allow to send an abuse report email.
     * @request POST:/v1/organization/{organizationCode}/report/abuse/
     * @secure
     */
    organizationReportAbuseCreate: (
      organizationCode: string,
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
      organizationCode: string,
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
     * @name OrganizationRetrieve
     * @request GET:/v1/organization/{code}/
     * @secure
     */
    organizationRetrieve: (code: string, params: RequestParams = {}) =>
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
     * @name OrganizationStatsList
     * @request GET:/v1/organization/{organizationCode}/stats/
     * @secure
     */
    organizationStatsList: (
      organizationCode: string,
      query?: {
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
      },
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
      organizationCode: string,
      query: {
        /** Choose the language you want for your results (en or fr), default to en. */
        language?: string
        /** Maximum number of results in response, default to 5. */
        limit?: number
        /** Search for a specific page name in the Wikipedia database. */
        search: string
      },
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
     * @name OrganizationTagClassificationAddTagsCreate
     * @request POST:/v1/organization/{organizationCode}/tag-classification/{id}/add-tags/
     * @secure
     */
    organizationTagClassificationAddTagsCreate: (
      id: number,
      organizationCode: string,
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
     * @name OrganizationTagClassificationCreate
     * @request POST:/v1/organization/{organizationCode}/tag-classification/
     * @secure
     */
    organizationTagClassificationCreate: (
      organizationCode: string,
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
     * @name OrganizationTagClassificationDestroy
     * @request DELETE:/v1/organization/{organizationCode}/tag-classification/{id}/
     * @secure
     */
    organizationTagClassificationDestroy: (
      id: number,
      organizationCode: string,
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
     * @name OrganizationTagClassificationList
     * @request GET:/v1/organization/{organizationCode}/tag-classification/
     * @secure
     */
    organizationTagClassificationList: (
      organizationCode: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
        /** Which field to use when ordering the results. */
        ordering?: string
        /** A search term. */
        search?: string
      },
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
     * @name OrganizationTagClassificationPartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/tag-classification/{id}/
     * @secure
     */
    organizationTagClassificationPartialUpdate: (
      id: number,
      organizationCode: string,
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
     * @name OrganizationTagClassificationRemoveTagsCreate
     * @request POST:/v1/organization/{organizationCode}/tag-classification/{id}/remove-tags/
     * @secure
     */
    organizationTagClassificationRemoveTagsCreate: (
      id: number,
      organizationCode: string,
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
     * @name OrganizationTagClassificationRetrieve
     * @request GET:/v1/organization/{organizationCode}/tag-classification/{id}/
     * @secure
     */
    organizationTagClassificationRetrieve: (
      id: number,
      organizationCode: string,
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
      organizationCode: string,
      tagClassificationId: string,
      query: {
        /** Choose the language you want for your results (en or fr), default to en. */
        language?: string
        /** Maximum number of results in response, default to 5. */
        limit?: number
        /** Search for a specific page name in the Wikipedia database. */
        search: string
      },
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
     * @name OrganizationTagClassificationTagCreate
     * @request POST:/v1/organization/{organizationCode}/tag-classification/{tagClassificationId}/tag/
     * @secure
     */
    organizationTagClassificationTagCreate: (
      organizationCode: string,
      tagClassificationId: string,
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
     * @name OrganizationTagClassificationTagDestroy
     * @request DELETE:/v1/organization/{organizationCode}/tag-classification/{tagClassificationId}/tag/{id}/
     * @secure
     */
    organizationTagClassificationTagDestroy: (
      id: number,
      organizationCode: string,
      tagClassificationId: string,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTagClassificationTagDestroyData, any>({
        path: `/v1/organization/${organizationCode}/tag-classification/${tagClassificationId}/tag/${id}/`,
        method: 'DELETE',
        secure: true,
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
      organizationCode: string,
      tagClassificationId: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
        /** Which field to use when ordering the results. */
        ordering?: string
        /** A search term. */
        search?: string
      },
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
     * @name OrganizationTagClassificationTagPartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/tag-classification/{tagClassificationId}/tag/{id}/
     * @secure
     */
    organizationTagClassificationTagPartialUpdate: (
      id: number,
      organizationCode: string,
      tagClassificationId: string,
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
     * @name OrganizationTagClassificationTagRetrieve
     * @request GET:/v1/organization/{organizationCode}/tag-classification/{tagClassificationId}/tag/{id}/
     * @secure
     */
    organizationTagClassificationTagRetrieve: (
      id: number,
      organizationCode: string,
      tagClassificationId: string,
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
      id: number,
      organizationCode: string,
      tagClassificationId: string,
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
     * @name OrganizationTagClassificationUpdate
     * @request PUT:/v1/organization/{organizationCode}/tag-classification/{id}/
     * @secure
     */
    organizationTagClassificationUpdate: (
      id: number,
      organizationCode: string,
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
     * @name OrganizationTagCreate
     * @request POST:/v1/organization/{organizationCode}/tag/
     * @secure
     */
    organizationTagCreate: (
      organizationCode: string,
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
     * @name OrganizationTagDestroy
     * @request DELETE:/v1/organization/{organizationCode}/tag/{id}/
     * @secure
     */
    organizationTagDestroy: (id: number, organizationCode: string, params: RequestParams = {}) =>
      this.request<OrganizationTagDestroyData, any>({
        path: `/v1/organization/${organizationCode}/tag/${id}/`,
        method: 'DELETE',
        secure: true,
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
      organizationCode: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
        /** Which field to use when ordering the results. */
        ordering?: string
        /** A search term. */
        search?: string
      },
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
     * @name OrganizationTagPartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/tag/{id}/
     * @secure
     */
    organizationTagPartialUpdate: (
      id: number,
      organizationCode: string,
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
     * @name OrganizationTagRetrieve
     * @request GET:/v1/organization/{organizationCode}/tag/{id}/
     * @secure
     */
    organizationTagRetrieve: (id: number, organizationCode: string, params: RequestParams = {}) =>
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
      id: number,
      organizationCode: string,
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
     * @name OrganizationTemplateCreate
     * @request POST:/v1/organization/{organizationCode}/template/
     * @secure
     */
    organizationTemplateCreate: (
      organizationCode: string,
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
     * @name OrganizationTemplateDestroy
     * @request DELETE:/v1/organization/{organizationCode}/template/{id}/
     * @secure
     */
    organizationTemplateDestroy: (
      id: string,
      organizationCode: string,
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
      organizationCode: string,
      templateId: string,
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
     * @name OrganizationTemplateImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/organization/{organizationCode}/template/{templateId}/image/{id}/
     * @secure
     */
    organizationTemplateImageDestroy: (
      id: number,
      organizationCode: string,
      templateId: string,
      params: RequestParams = {}
    ) =>
      this.request<OrganizationTemplateImageDestroyData, any>({
        path: `/v1/organization/${organizationCode}/template/${templateId}/image/${id}/`,
        method: 'DELETE',
        secure: true,
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
      id: number,
      organizationCode: string,
      templateId: string,
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
     * @name OrganizationTemplateImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/organization/{organizationCode}/template/{templateId}/image/{id}/
     * @secure
     */
    organizationTemplateImageRetrieve: (
      id: number,
      organizationCode: string,
      templateId: string,
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
      id: number,
      organizationCode: string,
      templateId: string,
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
     * No description
     *
     * @tags organization
     * @name OrganizationTemplateList
     * @request GET:/v1/organization/{organizationCode}/template/
     * @secure
     */
    organizationTemplateList: (
      organizationCode: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
        /** Which field to use when ordering the results. */
        ordering?: string
        /** A search term. */
        search?: string
      },
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
     * @name OrganizationTemplatePartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/template/{id}/
     * @secure
     */
    organizationTemplatePartialUpdate: (
      id: string,
      organizationCode: string,
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
     * @name OrganizationTemplateRetrieve
     * @request GET:/v1/organization/{organizationCode}/template/{id}/
     * @secure
     */
    organizationTemplateRetrieve: (
      id: string,
      organizationCode: string,
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
      id: string,
      organizationCode: string,
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
     * @name OrganizationTermsAndConditionsPartialUpdate
     * @request PATCH:/v1/organization/{organizationCode}/terms-and-conditions/{id}/
     * @secure
     */
    organizationTermsAndConditionsPartialUpdate: (
      id: string,
      organizationCode: string,
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
     * No description
     *
     * @tags organization
     * @name OrganizationTermsAndConditionsUpdate
     * @request PUT:/v1/organization/{organizationCode}/terms-and-conditions/{id}/
     * @secure
     */
    organizationTermsAndConditionsUpdate: (
      id: string,
      organizationCode: string,
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
     * @name OrganizationUpdate
     * @request PUT:/v1/organization/{code}/
     * @secure
     */
    organizationUpdate: (code: string, data: OrganizationRequest, params: RequestParams = {}) =>
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
     * @description Get all users in current organization that have at least one skill that could be mentored by the user.
     *
     * @tags organization
     * @name OrganizationUserMentorCandidateRetrieve
     * @summary Get all users in current organization that have at least one skill that could be mentored by the user.
     * @request GET:/v1/organization/{organizationCode}/user/{userId}/mentor-candidate/
     * @secure
     */
    organizationUserMentorCandidateRetrieve: (
      organizationCode: string,
      userId: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
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
      organizationCode: string,
      userId: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
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
     * @name PrivacySettingsPartialUpdate
     * @summary Allows getting or modifying a user's privacy settings.
     * @request PATCH:/v1/privacy-settings/{userId}/
     * @secure
     */
    privacySettingsPartialUpdate: (
      userId: number,
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
     * @description Allows getting or modifying a user's privacy settings.
     *
     * @tags privacy-settings
     * @name PrivacySettingsRetrieve
     * @summary Allows getting or modifying a user's privacy settings.
     * @request GET:/v1/privacy-settings/{userId}/
     * @secure
     */
    privacySettingsRetrieve: (userId: number, params: RequestParams = {}) =>
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
      userId: number,
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
     * No description
     *
     * @tags project
     * @name ProjectAnnouncementApplyCreate
     * @request POST:/v1/project/{projectId}/announcement/{id}/apply/
     * @secure
     */
    projectAnnouncementApplyCreate: (
      id: string,
      projectId: string,
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
     * @name ProjectAnnouncementCreate
     * @request POST:/v1/project/{projectId}/announcement/
     * @secure
     */
    projectAnnouncementCreate: (
      projectId: string,
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
     * @name ProjectAnnouncementDestroy
     * @request DELETE:/v1/project/{projectId}/announcement/{id}/
     * @secure
     */
    projectAnnouncementDestroy: (id: string, projectId: string, params: RequestParams = {}) =>
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
     * @name ProjectAnnouncementList
     * @request GET:/v1/project/{projectId}/announcement/
     * @secure
     */
    projectAnnouncementList: (
      projectId: string,
      query?: {
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
      },
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
     * @name ProjectAnnouncementPartialUpdate
     * @request PATCH:/v1/project/{projectId}/announcement/{id}/
     * @secure
     */
    projectAnnouncementPartialUpdate: (
      id: string,
      projectId: string,
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
     * @name ProjectAnnouncementRetrieve
     * @request GET:/v1/project/{projectId}/announcement/{id}/
     * @secure
     */
    projectAnnouncementRetrieve: (id: string, projectId: string, params: RequestParams = {}) =>
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
      id: string,
      projectId: string,
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
     * @name ProjectBlogEntryCreate
     * @request POST:/v1/project/{projectId}/blog-entry/
     * @secure
     */
    projectBlogEntryCreate: (
      projectId: string,
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
     * No description
     *
     * @tags project
     * @name ProjectBlogEntryDestroy
     * @request DELETE:/v1/project/{projectId}/blog-entry/{id}/
     * @secure
     */
    projectBlogEntryDestroy: (id: string, projectId: string, params: RequestParams = {}) =>
      this.request<ProjectBlogEntryDestroyData, any>({
        path: `/v1/project/${projectId}/blog-entry/${id}/`,
        method: 'DELETE',
        secure: true,
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
      projectId: string,
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
     * @name ProjectBlogEntryImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/project/{projectId}/blog-entry-image/{id}/
     * @secure
     */
    projectBlogEntryImageDestroy: (id: number, projectId: string, params: RequestParams = {}) =>
      this.request<ProjectBlogEntryImageDestroyData, any>({
        path: `/v1/project/${projectId}/blog-entry-image/${id}/`,
        method: 'DELETE',
        secure: true,
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
      id: number,
      projectId: string,
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
     * @name ProjectBlogEntryImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/project/{projectId}/blog-entry-image/{id}/
     * @secure
     */
    projectBlogEntryImageRetrieve: (id: number, projectId: string, params: RequestParams = {}) =>
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
      id: number,
      projectId: string,
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
     * No description
     *
     * @tags project
     * @name ProjectBlogEntryList
     * @request GET:/v1/project/{projectId}/blog-entry/
     * @secure
     */
    projectBlogEntryList: (
      projectId: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
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
     * @name ProjectBlogEntryPartialUpdate
     * @request PATCH:/v1/project/{projectId}/blog-entry/{id}/
     * @secure
     */
    projectBlogEntryPartialUpdate: (
      id: string,
      projectId: string,
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
     * @name ProjectBlogEntryRetrieve
     * @request GET:/v1/project/{projectId}/blog-entry/{id}/
     * @secure
     */
    projectBlogEntryRetrieve: (id: string, projectId: string, params: RequestParams = {}) =>
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
      id: string,
      projectId: string,
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
     * @name ProjectCommentCreate
     * @request POST:/v1/project/{projectId}/comment/
     * @secure
     */
    projectCommentCreate: (projectId: string, data: CommentRequest, params: RequestParams = {}) =>
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
     * No description
     *
     * @tags project
     * @name ProjectCommentDestroy
     * @request DELETE:/v1/project/{projectId}/comment/{id}/
     * @secure
     */
    projectCommentDestroy: (id: string, projectId: string, params: RequestParams = {}) =>
      this.request<ProjectCommentDestroyData, any>({
        path: `/v1/project/${projectId}/comment/${id}/`,
        method: 'DELETE',
        secure: true,
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
      projectId: string,
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
     * @name ProjectCommentImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/project/{projectId}/comment-image/{id}/
     * @secure
     */
    projectCommentImageDestroy: (id: number, projectId: string, params: RequestParams = {}) =>
      this.request<ProjectCommentImageDestroyData, any>({
        path: `/v1/project/${projectId}/comment-image/${id}/`,
        method: 'DELETE',
        secure: true,
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
      id: number,
      projectId: string,
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
     * @name ProjectCommentImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/project/{projectId}/comment-image/{id}/
     * @secure
     */
    projectCommentImageRetrieve: (id: number, projectId: string, params: RequestParams = {}) =>
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
      id: number,
      projectId: string,
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
     * No description
     *
     * @tags project
     * @name ProjectCommentList
     * @request GET:/v1/project/{projectId}/comment/
     * @secure
     */
    projectCommentList: (
      projectId: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
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
     * @name ProjectCommentPartialUpdate
     * @request PATCH:/v1/project/{projectId}/comment/{id}/
     * @secure
     */
    projectCommentPartialUpdate: (
      id: string,
      projectId: string,
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
     * @name ProjectCommentRetrieve
     * @request GET:/v1/project/{projectId}/comment/{id}/
     * @secure
     */
    projectCommentRetrieve: (id: string, projectId: string, params: RequestParams = {}) =>
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
      id: string,
      projectId: string,
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
     * @name ProjectDestroy
     * @summary Main endpoints for projects.
     * @request DELETE:/v1/project/{id}/
     * @secure
     */
    projectDestroy: (id: string, params: RequestParams = {}) =>
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
    projectDuplicateCreate: (id: string, data: ProjectRequest, params: RequestParams = {}) =>
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
     * No description
     *
     * @tags project
     * @name ProjectFileCreate
     * @request POST:/v1/project/{projectId}/file/
     * @secure
     */
    projectFileCreate: (
      projectId: string,
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
     * @name ProjectFileDestroy
     * @request DELETE:/v1/project/{projectId}/file/{id}/
     * @secure
     */
    projectFileDestroy: (id: string, projectId: string, params: RequestParams = {}) =>
      this.request<ProjectFileDestroyData, any>({
        path: `/v1/project/${projectId}/file/${id}/`,
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
    projectFileList: (
      projectId: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
      params: RequestParams = {}
    ) =>
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
     * @name ProjectFilePartialUpdate
     * @request PATCH:/v1/project/{projectId}/file/{id}/
     * @secure
     */
    projectFilePartialUpdate: (
      id: string,
      projectId: string,
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
     * @name ProjectFileRetrieve
     * @request GET:/v1/project/{projectId}/file/{id}/
     * @secure
     */
    projectFileRetrieve: (id: string, projectId: string, params: RequestParams = {}) =>
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
      id: string,
      projectId: string,
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
    projectFollowCreate: (projectId: string, data: FollowRequest, params: RequestParams = {}) =>
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
    projectFollowDestroy: (id: string, projectId: string, params: RequestParams = {}) =>
      this.request<ProjectFollowDestroyData, any>({
        path: `/v1/project/${projectId}/follow/${id}/`,
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
      projectId: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
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
     * No description
     *
     * @tags project
     * @name ProjectGoalCreate
     * @request POST:/v1/project/{projectId}/goal/
     * @secure
     */
    projectGoalCreate: (projectId: string, data: GoalRequest, params: RequestParams = {}) =>
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
     * @name ProjectGoalDestroy
     * @request DELETE:/v1/project/{projectId}/goal/{id}/
     * @secure
     */
    projectGoalDestroy: (id: string, projectId: string, params: RequestParams = {}) =>
      this.request<ProjectGoalDestroyData, any>({
        path: `/v1/project/${projectId}/goal/${id}/`,
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
    projectGoalList: (
      projectId: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
      params: RequestParams = {}
    ) =>
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
     * @name ProjectGoalPartialUpdate
     * @request PATCH:/v1/project/{projectId}/goal/{id}/
     * @secure
     */
    projectGoalPartialUpdate: (
      id: string,
      projectId: string,
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
     * @name ProjectGoalRetrieve
     * @request GET:/v1/project/{projectId}/goal/{id}/
     * @secure
     */
    projectGoalRetrieve: (id: string, projectId: string, params: RequestParams = {}) =>
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
      id: string,
      projectId: string,
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
     * @description Allows the upload of images.
     *
     * @tags project
     * @name ProjectHeaderCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/project/{projectId}/header/
     * @secure
     */
    projectHeaderCreate: (
      projectId: string,
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
     * @name ProjectHeaderDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/project/{projectId}/header/{id}/
     * @secure
     */
    projectHeaderDestroy: (id: number, projectId: string, params: RequestParams = {}) =>
      this.request<ProjectHeaderDestroyData, any>({
        path: `/v1/project/${projectId}/header/${id}/`,
        method: 'DELETE',
        secure: true,
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
      id: number,
      projectId: string,
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
     * @name ProjectHeaderUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/project/{projectId}/header/{id}/
     * @secure
     */
    projectHeaderUpdate: (
      id: number,
      projectId: string,
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
     * No description
     *
     * @tags project
     * @name ProjectHistoryList
     * @request GET:/v1/project/{projectId}/history/
     * @secure
     */
    projectHistoryList: (
      projectId: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
        /** Which field to use when ordering the results. */
        ordering?: string
        /** A search term. */
        search?: string
      },
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
    projectHistoryRetrieve: (id: string, projectId: string, params: RequestParams = {}) =>
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
      projectId: string,
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
     * @name ProjectImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/project/{projectId}/image/{id}/
     * @secure
     */
    projectImageDestroy: (id: number, projectId: string, params: RequestParams = {}) =>
      this.request<ProjectImageDestroyData, any>({
        path: `/v1/project/${projectId}/image/${id}/`,
        method: 'DELETE',
        secure: true,
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
      id: number,
      projectId: string,
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
     * @name ProjectImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/project/{projectId}/image/{id}/
     * @secure
     */
    projectImageRetrieve: (id: number, projectId: string, params: RequestParams = {}) =>
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
      id: number,
      projectId: string,
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
     * No description
     *
     * @tags project
     * @name ProjectLinkCreate
     * @request POST:/v1/project/{projectId}/link/
     * @secure
     */
    projectLinkCreate: (
      projectId: string,
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
     * @name ProjectLinkDestroy
     * @request DELETE:/v1/project/{projectId}/link/{id}/
     * @secure
     */
    projectLinkDestroy: (id: string, projectId: string, params: RequestParams = {}) =>
      this.request<ProjectLinkDestroyData, any>({
        path: `/v1/project/${projectId}/link/${id}/`,
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
      projectId: string,
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
     * No description
     *
     * @tags project
     * @name ProjectLinkedProjectCreate
     * @request POST:/v1/project/{projectId}/linked-project/
     * @secure
     */
    projectLinkedProjectCreate: (
      projectId: string,
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
     * @description Unlink projects from another projects.
     *
     * @tags project
     * @name ProjectLinkedProjectDeleteManyDestroy
     * @summary Unlink projects from another projects.
     * @request DELETE:/v1/project/{projectId}/linked-project/delete-many/
     * @secure
     */
    projectLinkedProjectDeleteManyDestroy: (
      id: string,
      projectId: string,
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
     * @name ProjectLinkedProjectDestroy
     * @request DELETE:/v1/project/{projectId}/linked-project/{id}/
     * @secure
     */
    projectLinkedProjectDestroy: (id: string, projectId: string, params: RequestParams = {}) =>
      this.request<ProjectLinkedProjectDestroyData, any>({
        path: `/v1/project/${projectId}/linked-project/${id}/`,
        method: 'DELETE',
        secure: true,
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
      id: string,
      projectId: string,
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
     * @name ProjectLinkList
     * @request GET:/v1/project/{projectId}/link/
     * @secure
     */
    projectLinkList: (
      projectId: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
        /** Which field to use when ordering the results. */
        ordering?: string
        /** A search term. */
        search?: string
      },
      params: RequestParams = {}
    ) =>
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
     * @name ProjectLinkPartialUpdate
     * @request PATCH:/v1/project/{projectId}/link/{id}/
     * @secure
     */
    projectLinkPartialUpdate: (
      id: string,
      projectId: string,
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
     * @name ProjectLinkRetrieve
     * @request GET:/v1/project/{projectId}/link/{id}/
     * @secure
     */
    projectLinkRetrieve: (id: string, projectId: string, params: RequestParams = {}) =>
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
      id: string,
      projectId: string,
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
     * @description Main endpoints for projects.
     *
     * @tags project
     * @name ProjectList
     * @summary Main endpoints for projects.
     * @request GET:/v1/project/
     * @secure
     */
    projectList: (
      query?: {
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
      },
      params: RequestParams = {}
    ) =>
      this.request<ProjectListData, any>({
        path: `/v1/project/`,
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
    projectLocationCreate: (projectId: string, data: LocationRequest, params: RequestParams = {}) =>
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
     * @name ProjectLocationDestroy
     * @request DELETE:/v1/project/{projectId}/location/{id}/
     * @secure
     */
    projectLocationDestroy: (id: string, projectId: string, params: RequestParams = {}) =>
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
     * @name ProjectLocationList
     * @request GET:/v1/project/{projectId}/location/
     * @secure
     */
    projectLocationList: (
      projectId: string,
      query?: {
        /** Which field to use when ordering the results. */
        ordering?: string
        /** A search term. */
        search?: string
      },
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
     * @name ProjectLocationPartialUpdate
     * @request PATCH:/v1/project/{projectId}/location/{id}/
     * @secure
     */
    projectLocationPartialUpdate: (
      id: string,
      projectId: string,
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
     * @name ProjectLocationRetrieve
     * @request GET:/v1/project/{projectId}/location/{id}/
     * @secure
     */
    projectLocationRetrieve: (id: string, projectId: string, params: RequestParams = {}) =>
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
      id: string,
      projectId: string,
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
     * @description Main endpoints for projects.
     *
     * @tags project
     * @name ProjectLockCreate
     * @summary Main endpoints for projects.
     * @request POST:/v1/project/{id}/lock/
     * @secure
     */
    projectLockCreate: (id: string, data: ProjectRequest, params: RequestParams = {}) =>
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
      id: string,
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
      id: string,
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
     * @description Main endpoints for projects.
     *
     * @tags project
     * @name ProjectPartialUpdate
     * @summary Main endpoints for projects.
     * @request PATCH:/v1/project/{id}/
     * @secure
     */
    projectPartialUpdate: (id: string, data: PatchedProjectRequest, params: RequestParams = {}) =>
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
     * No description
     *
     * @tags project
     * @name ProjectProjectMessageCreate
     * @request POST:/v1/project/{projectId}/project-message/
     * @secure
     */
    projectProjectMessageCreate: (
      projectId: string,
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
     * No description
     *
     * @tags project
     * @name ProjectProjectMessageDestroy
     * @request DELETE:/v1/project/{projectId}/project-message/{id}/
     * @secure
     */
    projectProjectMessageDestroy: (id: string, projectId: string, params: RequestParams = {}) =>
      this.request<ProjectProjectMessageDestroyData, any>({
        path: `/v1/project/${projectId}/project-message/${id}/`,
        method: 'DELETE',
        secure: true,
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
      projectId: string,
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
     * @name ProjectProjectMessageImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/project/{projectId}/project-message-image/{id}/
     * @secure
     */
    projectProjectMessageImageDestroy: (
      id: number,
      projectId: string,
      params: RequestParams = {}
    ) =>
      this.request<ProjectProjectMessageImageDestroyData, any>({
        path: `/v1/project/${projectId}/project-message-image/${id}/`,
        method: 'DELETE',
        secure: true,
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
      id: number,
      projectId: string,
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
     * @name ProjectProjectMessageImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/project/{projectId}/project-message-image/{id}/
     * @secure
     */
    projectProjectMessageImageRetrieve: (
      id: number,
      projectId: string,
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
      id: number,
      projectId: string,
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
     * No description
     *
     * @tags project
     * @name ProjectProjectMessageList
     * @request GET:/v1/project/{projectId}/project-message/
     * @secure
     */
    projectProjectMessageList: (
      projectId: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
        /** Which field to use when ordering the results. */
        ordering?: string
        /** A search term. */
        search?: string
      },
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
     * @name ProjectProjectMessagePartialUpdate
     * @request PATCH:/v1/project/{projectId}/project-message/{id}/
     * @secure
     */
    projectProjectMessagePartialUpdate: (
      id: string,
      projectId: string,
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
     * @name ProjectProjectMessageRetrieve
     * @request GET:/v1/project/{projectId}/project-message/{id}/
     * @secure
     */
    projectProjectMessageRetrieve: (id: string, projectId: string, params: RequestParams = {}) =>
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
      id: string,
      projectId: string,
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
     * @description Remove users from the project's group of the given name.
     *
     * @tags project
     * @name ProjectQuitDestroy
     * @summary Remove users from the project's group of the given name.
     * @request DELETE:/v1/project/{id}/quit/
     * @secure
     */
    projectQuitDestroy: (id: string, params: RequestParams = {}) =>
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
     * @name ProjectRetrieve
     * @summary Main endpoints for projects.
     * @request GET:/v1/project/{id}/
     * @secure
     */
    projectRetrieve: (id: string, params: RequestParams = {}) =>
      this.request<ProjectRetrieveData, any>({
        path: `/v1/project/${id}/`,
        method: 'GET',
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
    projectReviewCreate: (projectId: string, data: ReviewRequest, params: RequestParams = {}) =>
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
     * @name ProjectReviewDestroy
     * @request DELETE:/v1/project/{projectId}/review/{id}/
     * @secure
     */
    projectReviewDestroy: (id: string, projectId: string, params: RequestParams = {}) =>
      this.request<ProjectReviewDestroyData, any>({
        path: `/v1/project/${projectId}/review/${id}/`,
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
      projectId: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
        project?: string
        /** Multiple values may be separated by commas. */
        reviewer?: string[]
      },
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
     * @name ProjectReviewPartialUpdate
     * @request PATCH:/v1/project/{projectId}/review/{id}/
     * @secure
     */
    projectReviewPartialUpdate: (
      id: string,
      projectId: string,
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
     * @name ProjectReviewRetrieve
     * @request GET:/v1/project/{projectId}/review/{id}/
     * @secure
     */
    projectReviewRetrieve: (id: string, projectId: string, params: RequestParams = {}) =>
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
      id: string,
      projectId: string,
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
     * @description Main endpoints for projects.
     *
     * @tags project
     * @name ProjectSimilarRetrieve
     * @summary Main endpoints for projects.
     * @request GET:/v1/project/{id}/similar/
     * @secure
     */
    projectSimilarRetrieve: (
      id: string,
      query?: {
        /** Comma-separated list of organization codes. */
        organizations?: string
        /**
         * Maximum number of results.
         * @default 5
         */
        threshold?: number
      },
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
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabCreate
     * @summary Project tabs.
     * @request POST:/v1/project/{projectId}/tab/
     * @secure
     */
    projectTabCreate: (projectId: string, data: ProjectTabRequest, params: RequestParams = {}) =>
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
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabDestroy
     * @summary Project tabs.
     * @request DELETE:/v1/project/{projectId}/tab/{id}/
     * @secure
     */
    projectTabDestroy: (id: string, projectId: string, params: RequestParams = {}) =>
      this.request<ProjectTabDestroyData, any>({
        path: `/v1/project/${projectId}/tab/${id}/`,
        method: 'DELETE',
        secure: true,
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
      projectId: string,
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
     * @name ProjectTabImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/project/{projectId}/tab-image/{id}/
     * @secure
     */
    projectTabImageDestroy: (id: number, projectId: string, params: RequestParams = {}) =>
      this.request<ProjectTabImageDestroyData, any>({
        path: `/v1/project/${projectId}/tab-image/${id}/`,
        method: 'DELETE',
        secure: true,
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
      id: number,
      projectId: string,
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
     * @name ProjectTabImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/project/{projectId}/tab-image/{id}/
     * @secure
     */
    projectTabImageRetrieve: (id: number, projectId: string, params: RequestParams = {}) =>
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
      id: number,
      projectId: string,
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
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabItemCreate
     * @summary Project tabs.
     * @request POST:/v1/project/{projectId}/tab/{tabId}/item/
     * @secure
     */
    projectTabItemCreate: (
      projectId: string,
      tabId: string,
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
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabItemDestroy
     * @summary Project tabs.
     * @request DELETE:/v1/project/{projectId}/tab/{tabId}/item/{id}/
     * @secure
     */
    projectTabItemDestroy: (
      id: string,
      projectId: string,
      tabId: string,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabItemDestroyData, any>({
        path: `/v1/project/${projectId}/tab/${tabId}/item/${id}/`,
        method: 'DELETE',
        secure: true,
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
      projectId: string,
      tabId: string,
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
     * @name ProjectTabItemImageDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/project/{projectId}/tab/{tabId}/item-image/{id}/
     * @secure
     */
    projectTabItemImageDestroy: (
      id: number,
      projectId: string,
      tabId: string,
      params: RequestParams = {}
    ) =>
      this.request<ProjectTabItemImageDestroyData, any>({
        path: `/v1/project/${projectId}/tab/${tabId}/item-image/${id}/`,
        method: 'DELETE',
        secure: true,
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
      id: number,
      projectId: string,
      tabId: string,
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
     * @name ProjectTabItemImageRetrieve
     * @summary Allows the upload of images.
     * @request GET:/v1/project/{projectId}/tab/{tabId}/item-image/{id}/
     * @secure
     */
    projectTabItemImageRetrieve: (
      id: number,
      projectId: string,
      tabId: string,
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
      id: number,
      projectId: string,
      tabId: string,
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
     * @description Project tabs.
     *
     * @tags project
     * @name ProjectTabItemList
     * @summary Project tabs.
     * @request GET:/v1/project/{projectId}/tab/{tabId}/item/
     * @secure
     */
    projectTabItemList: (
      projectId: string,
      tabId: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
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
     * @name ProjectTabItemPartialUpdate
     * @summary Project tabs.
     * @request PATCH:/v1/project/{projectId}/tab/{tabId}/item/{id}/
     * @secure
     */
    projectTabItemPartialUpdate: (
      id: string,
      projectId: string,
      tabId: string,
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
     * @name ProjectTabItemRetrieve
     * @summary Project tabs.
     * @request GET:/v1/project/{projectId}/tab/{tabId}/item/{id}/
     * @secure
     */
    projectTabItemRetrieve: (
      id: string,
      projectId: string,
      tabId: string,
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
      id: string,
      projectId: string,
      tabId: string,
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
     * @name ProjectTabList
     * @summary Project tabs.
     * @request GET:/v1/project/{projectId}/tab/
     * @secure
     */
    projectTabList: (
      projectId: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
      params: RequestParams = {}
    ) =>
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
     * @name ProjectTabPartialUpdate
     * @summary Project tabs.
     * @request PATCH:/v1/project/{projectId}/tab/{id}/
     * @secure
     */
    projectTabPartialUpdate: (
      id: string,
      projectId: string,
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
     * @name ProjectTabRetrieve
     * @summary Project tabs.
     * @request GET:/v1/project/{projectId}/tab/{id}/
     * @secure
     */
    projectTabRetrieve: (id: string, projectId: string, params: RequestParams = {}) =>
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
      id: string,
      projectId: string,
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
     * @description Main endpoints for projects.
     *
     * @tags project
     * @name ProjectUnlockCreate
     * @summary Main endpoints for projects.
     * @request POST:/v1/project/{id}/unlock/
     * @secure
     */
    projectUnlockCreate: (id: string, data: ProjectRequest, params: RequestParams = {}) =>
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
     * @description Main endpoints for projects.
     *
     * @tags project
     * @name ProjectUpdate
     * @summary Main endpoints for projects.
     * @request PUT:/v1/project/{id}/
     * @secure
     */
    projectUpdate: (id: string, data: ProjectRequest, params: RequestParams = {}) =>
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
    searchList: (
      query?: {
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
      },
      params: RequestParams = {}
    ) =>
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
    searchList2: (
      search: string,
      query?: {
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
      },
      params: RequestParams = {}
    ) =>
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
    tagList: (
      query?: {
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
      },
      params: RequestParams = {}
    ) =>
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
    tagRetrieve: (id: number, params: RequestParams = {}) =>
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
     * @name UserAdminListRetrieve
     * @request GET:/v1/user/admin-list/
     * @secure
     */
    userAdminListRetrieve: (
      query?: {
        /** Organization id used to fetch the role of the users in the organization */
        current_org_pk?: string
        /** Used to filter the users by role in the organization */
        current_org_role?: string
      },
      params: RequestParams = {}
    ) =>
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
     * @name UserDestroy
     * @request DELETE:/v1/user/{id}/
     * @secure
     */
    userDestroy: (id: string, params: RequestParams = {}) =>
      this.request<UserDestroyData, any>({
        path: `/v1/user/${id}/`,
        method: 'DELETE',
        secure: true,
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
    userFollowCreate: (userId: string, data: FollowRequest, params: RequestParams = {}) =>
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
    userFollowDestroy: (id: string, userId: string, params: RequestParams = {}) =>
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
      userId: string,
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
    userFollowList: (
      userId: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
      },
      params: RequestParams = {}
    ) =>
      this.request<UserFollowListData, any>({
        path: `/v1/user/${userId}/follow/`,
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
     * @name UserGetByEmailRetrieve
     * @request GET:/v1/user/get-by-email/{email}/
     * @secure
     */
    userGetByEmailRetrieve: (
      email: string,
      query?: {
        /** Organization id used to fetch the role of the users in the organization */
        current_org_pk?: string
      },
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
     * @name UserHasPermissionsRetrieve
     * @request GET:/v1/user/{id}/has_permissions/
     * @secure
     */
    userHasPermissionsRetrieve: (
      id: string,
      query?: {
        /** Representations of the permissions to check, separated by a comma */
        permissions?: string
      },
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
     * @name UserList
     * @request GET:/v1/user/
     * @secure
     */
    userList: (
      query?: {
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
      },
      params: RequestParams = {}
    ) =>
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
     * @name UserPartialUpdate
     * @request PATCH:/v1/user/{id}/
     * @secure
     */
    userPartialUpdate: (id: string, data: PatchedUserRequest, params: RequestParams = {}) =>
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
     * @description Allows the upload of images.
     *
     * @tags user
     * @name UserProfilePictureCreate
     * @summary Allows the upload of images.
     * @request POST:/v1/user/{userId}/profile-picture/
     * @secure
     */
    userProfilePictureCreate: (
      userId: string,
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
     * @name UserProfilePictureDestroy
     * @summary Allows the upload of images.
     * @request DELETE:/v1/user/{userId}/profile-picture/{id}/
     * @secure
     */
    userProfilePictureDestroy: (id: number, userId: string, params: RequestParams = {}) =>
      this.request<UserProfilePictureDestroyData, any>({
        path: `/v1/user/${userId}/profile-picture/${id}/`,
        method: 'DELETE',
        secure: true,
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
      id: number,
      userId: string,
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
     * @name UserProfilePictureUpdate
     * @summary Allows the upload of images.
     * @request PUT:/v1/user/{userId}/profile-picture/{id}/
     * @secure
     */
    userProfilePictureUpdate: (
      id: number,
      userId: string,
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
     * No description
     *
     * @tags user
     * @name UserRefreshKeycloakActionsLinkRetrieve
     * @request GET:/v1/user/{id}/refresh-keycloak-actions-link/
     * @secure
     */
    userRefreshKeycloakActionsLinkRetrieve: (id: string, params: RequestParams = {}) =>
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

    /**
     * No description
     *
     * @tags user
     * @name UserResetPasswordRetrieve
     * @request GET:/v1/user/{id}/reset-password/
     * @secure
     */
    userResetPasswordRetrieve: (id: string, params: RequestParams = {}) =>
      this.request<UserResetPasswordRetrieveData, any>({
        path: `/v1/user/${id}/reset-password/`,
        method: 'GET',
        secure: true,
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
    userRetrieve: (id: string, params: RequestParams = {}) =>
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
     * @name UserReviewCreate
     * @request POST:/v1/user/{userId}/review/
     * @secure
     */
    userReviewCreate: (userId: string, data: ReviewRequest, params: RequestParams = {}) =>
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
     * @name UserReviewDestroy
     * @request DELETE:/v1/user/{userId}/review/{id}/
     * @secure
     */
    userReviewDestroy: (id: string, userId: string, params: RequestParams = {}) =>
      this.request<UserReviewDestroyData, any>({
        path: `/v1/user/${userId}/review/${id}/`,
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
    userReviewList: (
      userId: string,
      query?: {
        /** Number of results to return per page. */
        limit?: number
        /** The initial index from which to return the results. */
        offset?: number
        project?: string
        /** Multiple values may be separated by commas. */
        reviewer?: string[]
      },
      params: RequestParams = {}
    ) =>
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
     * @name UserReviewPartialUpdate
     * @request PATCH:/v1/user/{userId}/review/{id}/
     * @secure
     */
    userReviewPartialUpdate: (
      id: string,
      userId: string,
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
     * @name UserReviewRetrieve
     * @request GET:/v1/user/{userId}/review/{id}/
     * @secure
     */
    userReviewRetrieve: (id: string, userId: string, params: RequestParams = {}) =>
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
      id: string,
      userId: string,
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
    userSkillCreate: (userId: string, data: SkillRequest, params: RequestParams = {}) =>
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
 * @name UserSkillDestroy
 * @summary A viewset that provides `create` and `update` actions.

To use it, override the class and set the `queryset` and
`serializer_class` attributes.
 * @request DELETE:/v1/user/{userId}/skill/{id}/
 * @secure
 */
    userSkillDestroy: (id: number, userId: string, params: RequestParams = {}) =>
      this.request<UserSkillDestroyData, any>({
        path: `/v1/user/${userId}/skill/${id}/`,
        method: 'DELETE',
        secure: true,
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
      id: number,
      userId: string,
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
 * @name UserSkillUpdate
 * @summary A viewset that provides `create` and `update` actions.

To use it, override the class and set the `queryset` and
`serializer_class` attributes.
 * @request PUT:/v1/user/{userId}/skill/{id}/
 * @secure
 */
    userSkillUpdate: (id: number, userId: string, data: SkillRequest, params: RequestParams = {}) =>
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
     * No description
     *
     * @tags user
     * @name UserUpdate
     * @request PUT:/v1/user/{id}/
     * @secure
     */
    userUpdate: (id: string, data: UserRequest, params: RequestParams = {}) =>
      this.request<UserUpdateData, any>({
        path: `/v1/user/${id}/`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  }
}
