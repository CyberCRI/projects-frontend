import { test } from '@playwright/test'
import { usersDict as users } from '../variables'
import { LogLevel, Logger } from '../logger'
import { logIn, createGroup, deleteGroup, makeid } from '../lib'

const logger = new Logger(LogLevel.Debug)
const groupName = makeid(5)

test(`test-${users.admin}`, async ({ page }) => {
    logger.info(` PROJECT CREATION TEST : ${users.admin} `)
    try {
        await logIn(page, users.admin)
        logger.info('Login successful')
    } catch (err) {
        logger.error('Login test has failed')
        logger.error(err)
        throw err
    }
    try {
        await createGroup(page, groupName)
        logger.info(`Group Created`)
    } catch (err) {
        logger.error('Group creation has failed')
        logger.error(err)
        throw err
    }
    try {
        await deleteGroup(page, groupName)
        logger.info(`Group Created`)
    } catch (err) {
        logger.error('Group creation has failed')
        logger.error(err)
        throw err
    }
})
