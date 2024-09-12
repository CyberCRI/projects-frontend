import { test } from '@playwright/test'
import { users } from '../variables'
import { LogLevel, Logger } from '../logger'
import { delay } from '../lib/index'
import { logIn, createProject, search, makeId, destroyProject, editProjectInfos } from '../lib'

const logger = new Logger(LogLevel.Debug)
const projId = makeId(5)
const projId2 = makeId(5)
for (let i = 0; i < users.length; i++) {
    test(`test-${users[i].email}`, async ({ page }) => {
        logger.info(` SEARCH TEST : ${users[i].email} `)
        try {
            await logIn(page, users[i])
            logger.info('Login successful')
        } catch (err) {
            logger.error('Login test has failed')
            logger.error(err)
            throw err
        }
        try {
            await createProject(page, `SearchTest_${i}`, projId)
            logger.info(`SearchTest_${i} Project created`)
        } catch (err) {
            logger.error('Project creation has failed')
            logger.error(err)
            throw err
        }
        await delay(5000) // gives tiume for algolia to index
        try {
            await search(page, projId)
            logger.info(`searching for SearchTest_${i}`)
        } catch (err) {
            logger.error('Search test has failed')
            logger.error(err)
            throw err
        }
        try {
            await editProjectInfos(page, projId2)
            logger.info(`Edit has been done`)
        } catch (err) {
            logger.error('Edit Project infos has failed')
            logger.error(err)
            throw err
        }
        await delay(5000) // gives tiume for algolia to reindex
        try {
            await search(page, projId2)
            logger.info(`searching for SearchTest_${projId2}`)
        } catch (err) {
            logger.error('Project search has failed')
            logger.error(err)
            throw err
        }
        try {
            await destroyProject(page)
            logger.info(`SearchTest_${projId2} Project destroyed`)
        } catch (err) {
            logger.error('Project deletion has failed')
            logger.error(err)
            throw err
        }
    })
}
