import { test } from '@playwright/test'
import { usersDict as users } from '../variables'
import { LogLevel, Logger } from '../logger'
import { logIn, createGroup, deleteGroup, makeId } from '../lib'

const logger = new Logger(LogLevel.Debug)
const groupName = makeId(5)

test(`test-${users.admin.email}`, async ({ page }) => {
    logger.info(` PROJECT CREATION TEST : ${users.admin.email} `)
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
        logger.info(`Group Deleted`)
    } catch (err) {
        logger.error('Group deletion has failed')
        logger.error(err)
        throw err
    }
})