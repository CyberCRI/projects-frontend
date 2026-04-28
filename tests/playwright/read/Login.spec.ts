import { LogLevel, Logger } from '~~/tests/playwright/logger'
import { logIn, logOut } from '~~/tests/playwright/lib'
import { users } from '~~/tests/playwright/variables'
import { test } from '@playwright/test'

const logger = new Logger(LogLevel.Debug)

for (let i = 0; i < users.length; i++) {
  test(`test-${users[i].email}`, async ({ page }) => {
    await page.goto('/')
    //  await page.goto('/') // if needed replace with  await page.locator('[data-test="lpi-logo"]').click
    logger.info(` LOGIN/LOGOUT TEST : ${users[i].email} `)
    try {
      await logIn(page, users[i])
      logger.info('Login successful')
    } catch (err) {
      logger.error('Login has failed')
      logger.error(err)
      throw err
    }
    try {
      await logOut(page)
      logger.info('Logout successful')
    } catch (err) {
      logger.error('Logout has failed')
      logger.error(err)
      throw err
    }
  })
}
