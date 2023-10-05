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
        email: process.env.USER_COMMUNITY_EMAIL as string,
        password: process.env.USER_COMMUNITY_PASSWORD as string,
    },
    {
        email: process.env.PLAYWRIGHT_TEST_EMAIL as string,
        password: process.env.PLAYWRIGHT_TEST_PASSWORD as string,
    },
]

export const usersDict: UserType = {
    userTest: {
        email: process.env.USER_TEST_EMAIL as string,
        password: process.env.USER_TEST_PASSWORD as string,
    },
    admin: {
        email: process.env.USER_ADMIN_EMAIL as string,
        password: process.env.USER_ADMIN_PASSWORD as string,
    },
    community: {
        email: process.env.USER_COMMUNITY_EMAIL as string,
        password: process.env.USER_COMMUNITY_PASSWORD as string,
    },
    playwright: {
        email: process.env.PLAYWRIGHT_TEST_EMAIL as string,
        password: process.env.PLAYWRIGHT_TEST_PASSWORD as string,
    },
}

export const frontURL: string | undefined = process.env.FRONTEND_URL
export const emailToReport: string = 'test.report@gmail.com'
export const organizationCode: string | undefined = process.env.VITE_APP_APIBASEORGID
