import { LogLevel, Logger } from '~~/tests/playwright/logger'
import { expect } from '@playwright/test'
import { Page } from '@playwright/test'
// import { delay } from '~~/tests/playwright/lib/index'

const logger = new Logger(LogLevel.Debug)

export async function logOut(page: Page) {
  // await page.locator('[data-test="lpi-logo"]').click()
  // await delay(3000)
  await page.locator('[data-test="dropdown-user-account"]').click()
  logger.info('Click to disconnect')
  await page.locator('[data-test="disconnect"]').click()
  // await delay(1000)
  await expect(page.locator('[data-test="test-login-button"]')).toBeVisible()
  logger.info('Disconnected')
}
