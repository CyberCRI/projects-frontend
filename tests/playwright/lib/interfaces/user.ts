export interface User {
  email: string
  password: string
  firstName: string
  lastName: string
}
export interface UserType {
  [key: string]: User
}
