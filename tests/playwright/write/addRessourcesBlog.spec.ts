import { test } from '@playwright/test'
import { users } from '../variables'
import { LogLevel, Logger } from '../logger'
import { logIn, destroyProject, createProject, addBlogEntry, addRessources, makeId } from '../lib'

const logger = new Logger(LogLevel.Debug)
const projId = makeId(5)
for (let i = 0; i < users.length; i++) {
    test(`test-${users[i].email}`, async ({ page }) => {
        logger.info(` ADD RESSOURCES/BLOG TEST : ${users[i].email} `)
        try {
            await page.goto('/')
            await logIn(page, users[i])
            logger.info('Login successful')
        } catch (err) {
            logger.error('login test has failed')
            logger.error(err)
            throw err
        }
        try {
            await createProject(page, `AddRessourceBlogProject_${i}`, projId)
            logger.info(`AddRessourceBlogProject_${i} Project created`)
        } catch (err) {
            logger.error('Project creation has failed')
            logger.error(err)
            throw err
        }
        try {
            await addBlogEntry(page)
            logger.info('Blog created')
        } catch (err) {
            logger.error('Add blog entry has failed')
            logger.error(err)
            throw err
        }
        try {
            await addRessources(page)
            logger.info('Ressources added')
        } catch (err) {
            logger.error('Add Ressources has failed')
            logger.error(err)
            throw err
        }
        try {
            await destroyProject(page)
            logger.info(`AddRessourceBlogProject_${i} destroyed`)
        } catch (err) {
            logger.error('Project deletion has failed')
            logger.error(err)
            throw err
        }
    })
}
