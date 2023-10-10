export interface User {
    email: string
    password: string
}
export interface UserType {
    [key: string]: User
}
