import { test } from '@playwright/test'
import { users, usersDict } from '../variables'
import { logIn, logOut } from '../lib'
import { LogLevel, Logger } from '../logger'

const logger = new Logger(LogLevel.Debug)

test(`test-user-creation`, async ({ page }) => {
    logger.info(` User creation test `)
    try {
        await logIn(page, usersDict['admin'])
        logger.info('Login successful')
    } catch (err) {
        logger.error('Login has failed')
        logger.error(err)
        throw err
    }
    //  usercreation
    try {
        await logOut(page)
        logger.info('Logout successful')
    } catch (err) {
        logger.error('Logout has failed')
        logger.error(err)
        throw err
    }
})
