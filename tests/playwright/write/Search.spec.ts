import { test } from '@playwright/test'
import { users } from '../variables'
import { LogLevel, Logger } from '../logger'
import { logIn, delay, createProject, search, makeId, destroyProject } from '../lib'

const logger = new Logger(LogLevel.Debug)
const projId = makeId(5)
for (let i = 0; i < users.length; i++) {
  test(`test-${users[i].email}`, async ({ page }) => {
    await page.goto('/')
    logger.info(` SEARCH TEST : ${users[i].email} `)
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
      await createProject(page, `SearchTest_${i}`, projId)
      logger.info(`SearchTest_${i} Project created`)
    } catch (err) {
      logger.error('Project creation has failed')
      logger.error(err)
      throw err
    }
    await delay(1000) // gives tiume for algolia to index
    try {
      await search(page, projId)
      logger.info(`searching for SearchTest_${i}`)
    } catch (err) {
      logger.error('Project search has failed')
      logger.error(err)
      throw err
    }
    try {
      await destroyProject(page)
      logger.info(`SearchTest_${i} Project destroyed`)
    } catch (err) {
      logger.error('Project deletion has failed')
      logger.error(err)
      throw err
    }
  })
}
