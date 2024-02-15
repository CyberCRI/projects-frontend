/**
 * @name PeopleModel
 * @description user data from people
 */
export interface PeopleModel {
    slug: string
    roles?: Array<string>
    permissions?: Array<string>
    is_superuser?: boolean
    people_groups: Array<Object>
    notifications?: number
    privacy_settings?: Object
    skills: Array<Object>
    hobbies: Array<Object>
    id: number
    language: string
    email: string
    given_name: string
    family_name: string
    birthday?: any
    pronouns?: string
    personal_description?: string
    short_description?: string
    professional_description?: string
    location?: string
    job: string // Job title
    mobile_phone?: string
    personnal_email: string
    sdgs: Array<number>
    facebook?: string
    linkedin?: string
    medium?: string
    website?: string
    skype?: string
    landline_phone?: string
    twitter?: string
}

export interface UserPostData {
    email: string
    given_name: string
    family_name: string
    job: string
}
