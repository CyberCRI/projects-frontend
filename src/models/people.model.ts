/**
 * @name PeopleModel
 * @description user data from people
 */
export interface PeopleModel {
    expire?: Date
    gid?: string
    groups?: string[]
    invite_expire?: Date
    kid: string // Keycloak user id
    maingroup: string
    name: {
        firstname: string
        fullname: string
        lastname: string
    }
    personnalmail: string
    pic?: string
    pid: string // user id
    primaryemail: string
    org?: string
    role?: string
    room?: string
    state?: string
    title: string // Job title
    type: string
    urlname?: string
}

export interface UserPostData {
    email: string
    given_name: string
    family_name: string
    job: string
}
