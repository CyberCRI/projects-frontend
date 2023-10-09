import { User, UserType } from './lib/interfaces'

export const users: User[] = [
    {
        email: process.env.USER_TEST_EMAIL as string,
        password: process.env.USER_TEST_PASSWORD as string,
    },
    {
        email: process.env.USER_ADMIN_EMAIL as string,
        password: process.env.USER_ADMIN_PASSWORD as string,
    },
    {
        email: process.env.USER_FACILITATOR_EMAIL as string,
        password: process.env.USER_FACILITATOR_PASSWORD as string,
    },
    {
        email: process.env.PLAYWRIGHT_TEST_EMAIL as string,
        password: process.env.PLAYWRIGHT_TEST_PASSWORD as string,
    },
]

export const usersDict: UserType = {
    baseUser: users[0],
    admin: users[1],
    community: users[2],
    playwright: users[3],
}

export const frontURL: string | undefined = process.env.FRONTEND_URL
export const emailToReport: string = 'test.report@gmail.com'
export const organizationCode: string | undefined = process.env.VITE_APP_APIBASEORGID
