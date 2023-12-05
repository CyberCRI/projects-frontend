import { test } from '@playwright/test'
import { usersDict as users } from '../variables'
import { LogLevel, Logger } from '../logger'
import { logIn, createGroup, makeid } from '../lib'

const logger = new Logger(LogLevel.Debug)
const projId = makeid(5)

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
        await createGroup(page)
        logger.info(`Group Created`)
    } catch (err) {
        logger.error('Group creation has failed')
        logger.error(err)
        throw err
    }
})
