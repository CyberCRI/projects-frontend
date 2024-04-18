/**
 * @name UserModel
 * @description user data set on the project app
 */
export interface UserModel {
    id: string
    name: {
        firstname: string
        lastname: string
    }
    email: string
    roles: string[]
    orgs: string[]
    permissions: object
    personal_description?: string
    professional_description?: string
    people_groups?: object[] // TODO: define this type
    skills?: UserSkillModel[]
    hobbies?: UserSkillModel[]
}

export interface UserFromJWTModel {
    id: string
    given_name: string
    family_name: string
    email: string
    groups: string[]
}

export interface NotificationsSettings {
    notify_added_to_project: boolean
    announcement_published: boolean
    followed_project_has_been_edited: boolean
    project_has_been_commented: boolean
    project_has_been_edited: boolean
    project_ready_for_review: boolean
    project_has_been_reviewed: boolean
    comment_received_a_response: boolean
    organization_has_new_access_request: boolean
    invitation_link_will_expire: boolean
    new_instruction: boolean
}

export interface UserPatchModel {
    birthdate?: string
    pronouns?: string
    personal_description?: string
    short_description?: string
    professional_description?: string
    location?: string
    job?: string
    sdgs?: number[]
    facebook?: string
    mobile_phone?: string
    linkedin?: string
    medium?: string
    website?: string
    skype?: string
    landline_phone?: string
    twitter?: string
    language?: string
    email?: string
    given_name?: string
    family_name?: string
    roles_to_add?: number[]
    roles_to_remove?: number[]
    permissions_ids?: number[]
    onboarding_status?: object
}

export type PrivacyValue = 'hide' | 'org' | 'pub'

export interface UserPrivacyPatchModel {
    profile_picture?: PrivacyValue
    profile?: PrivacyValue
    skills?: PrivacyValue
    hobbies?: PrivacyValue
    facebook?: PrivacyValue
    mobile_phone?: PrivacyValue
    linkedin?: PrivacyValue
    medium?: PrivacyValue
    website?: PrivacyValue
    personal_email?: PrivacyValue
    skype?: PrivacyValue
    landline_phone?: PrivacyValue
    twitter?: PrivacyValue
}

export interface UserSkillModel {
    user: string
    wikipedia_tag: string
    level: number
    level_to_reach: number
    category: string
    type: 'skill' | 'hobby'
}
