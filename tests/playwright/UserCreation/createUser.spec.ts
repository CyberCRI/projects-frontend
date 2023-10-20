import { test } from '@playwright/test'
import { usersDict } from '../variables'
import { logIn, logOut, createInvitaionLink } from '../lib'
import { LogLevel, Logger } from '../logger'

const logger = new Logger(LogLevel.Debug)

test(`test-user-creation ${usersDict.admin.email}`, async ({ page }) => {
    logger.info(` User creation test ${usersDict.admin.email}`)
    try {
        await logIn(page, usersDict.admin)
        logger.info('Login successful')
    } catch (err) {
        logger.error('Login has failed')
        logger.error(err)
        throw err
    }
    await createInvitaionLink(page)
    try {
        await logOut(page)
        logger.info('Logout successful')
    } catch (err) {
        logger.error('Logout has failed')
        logger.error(err)
        throw err
    }
})
