import { test } from '@playwright/test'
import { usersDict } from '../variables'
import { logIn, logOut, createInvitaionLink, createUserFromInvitationLink } from '../lib'
import { LogLevel, Logger } from '../logger'

const logger = new Logger(LogLevel.Debug)

test(`test-user-creation ${usersDict.admin.email}`, async ({ context }) => {
    const pageOne = await context.newPage()
    logger.info(` User creation test ${usersDict.admin.email}`)
    try {
        await logIn(pageOne, usersDict.admin)
        logger.info('Login successful')
    } catch (err) {
        logger.error('Login has failed')
        logger.error(err)
        throw err
    }
    const clipboardText = await createInvitaionLink(pageOne)
    try {
        await logOut(pageOne)
        logger.info('Logout successful')
    } catch (err) {
        logger.error('Logout has failed')
        logger.error(err)
        throw err
    }
    const pageTwo = await context.newPage()
    await createUserFromInvitationLink(pageTwo, clipboardText, usersDict.playwright)
})
