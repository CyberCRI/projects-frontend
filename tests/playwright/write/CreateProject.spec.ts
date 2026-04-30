import { logIn, destroyProject, createProject, makeId } from '~~/tests/playwright/lib'
import { LogLevel, Logger } from '~~/tests/playwright/logger'
import { users } from '~~/tests/playwright/variables'
import { test } from '@playwright/test'

const logger = new Logger(LogLevel.Debug)
const projId = makeId(5)

for (let i = 0; i < users.length; i++) {
  test(`test-${users[i].email}`, async ({ page }) => {
    await page.goto('/')
    logger.info(` PROJECT CREATION TEST : ${users[i].email} `)
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
      await createProject(page, `CreateProject_${i}`, projId)
      logger.info(`CreateProject_${i} Project created`)
    } catch (err) {
      logger.error('Project creation has failed')
      logger.error(err)
      throw err
    }
    try {
      await destroyProject(page)
      logger.info(`CreateProject_${i} Project destroyed`)
    } catch (err) {
      logger.error('Project deletion has failed')
      logger.error(err)
      throw err
    }
  })
}
