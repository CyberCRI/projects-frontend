import { test } from '@playwright/test'
import { users } from '../variables'
import { LogLevel, Logger } from '../logger'
import { logIn, destroyProject, createProject, reportAbuse, reportBug, makeId } from '../lib'

const logger = new Logger(LogLevel.Debug)
const projId = makeId(5)
for (let i = 0; i < users.length; i++) {
  test(`test-${users[i].email}`, async ({ page }) => {
    await page.goto('/')
    logger.info(`REPORT BUG/ABUSE TEST : ${users[i].email} `)
    try {
      //  await page.goto('/') // if needed replace with  await page.locator('[data-test="lpi-logo"]').click
      await logIn(page, users[i])
      logger.info('Login successful')
    } catch (err) {
      logger.error('Login test has failed')
      logger.error(err)
      throw err
    }

    try {
      await createProject(page, `reportBugAbuseProject_${i}`, projId)
      logger.info(`reportBugAbuseProject_${i} Project created`)
    } catch (err) {
      logger.error('Project creation has failed')
      logger.error(err)
      throw err
    }
    try {
      await reportAbuse(page)
      logger.info('Abuse reported')
    } catch (err) {
      logger.error('Report abuse has failed')
      logger.error(err)
      throw err
    }
    try {
      await reportBug(page)
      logger.info('Bug reported')
    } catch (err) {
      logger.error('Report bug has failed')
      logger.error(err)
      throw err
    }
    try {
      await destroyProject(page)
      logger.info(`reportBugAbuseProject_${i} Project destroyed`)
    } catch (err) {
      logger.error('Project deletion has failed')
      logger.error(err)
      throw err
    }
  })
}
