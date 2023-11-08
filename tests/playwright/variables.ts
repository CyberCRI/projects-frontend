import { User, UserType } from './lib/interfaces'

export const users: User[] = [
    {
        email: process.env.USER_ADMIN_EMAIL as string,
        password: process.env.USER_ADMIN_PASSWORD as string,
        firstName: 'pw_admin',
        lastName: 'pw_test',
    },
    {
        email: process.env.PLAYWRIGHT_TEST_EMAIL as string,
        password: process.env.PLAYWRIGHT_TEST_PASSWORD as string,
        firstName: 'pw_playwright',
        lastName: 'pw_test',
    },
    // {
    //     email: process.env.USER_FACILITATOR_EMAIL as string,
    //     password: process.env.USER_FACILITATOR_PASSWORD as string,
    // },
    // {
    //     email: process.env.USER_TEST_EMAIL as string,
    //     password: process.env.USER_TEST_PASSWORD as string,
    // },
]

export const usersDict: UserType = {
    admin: users[0],
    playwright: users[1],
    baseUser: users[0],
    community: users[2],
}

export const frontURL: string | undefined = process.env.FRONTEND_URL
export const emailToReport: string = 'test.report@gmail.com'
export const organizationCode: string | undefined = process.env.VITE_APP_APIBASEORGID
