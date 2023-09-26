import { User } from './lib/interfaces'

export const users: User[] = [
    // IMPORTANT : Décommanter pour ajouter des utilisateurs aux tests. Il faut également ajouter un nombre de workers en fonction du nombre de compte.

    // {
    //     email: process.env.USER_TEST_EMAIL as string,
    //     password: process.env.USER_TEST_PASSWORD as string,
    // },
    // {
    //     email: process.env.USER_ADMIN_EMAIL as string,
    //     password: process.env.USER_ADMIN_PASSWORD as string,
    // },
    // {
    //     email: process.env.USER_COMMUNITY_EMAIL as string,
    //     password: process.env.USER_COMMUNITY_PASSWORD as string,
    // },
    {
        email: process.env.PLAYWRIGHT_TEST_EMAIL as string,
        password: process.env.PLAYWRIGHT_TEST_PASSWORD as string,
    },
]

export const frontURL: string = process.env.FRONTEND_URL
export const emailToReport: string = 'test.report@gmail.com'
