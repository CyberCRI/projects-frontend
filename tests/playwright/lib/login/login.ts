import type { User } from '../interfaces'
import { LogLevel, Logger } from '../../logger'
import { Page } from '@playwright/test'

const logger = new Logger(LogLevel.Debug)

export async function logIn(page: Page, user: User) {
  logger.info('Click on login button')
  //  await page.goto('/') // if needed replace with  await page.locator('[data-test="lpi-logo"]').click()
  await page.locator('[data-test="test-login-button"]').click()
  logger.info(`Fill username or email (${user.email})`)
  let loginForm = await page.locator('#kc-form-login')
  if (await loginForm.isHidden()) {
    await page.locator('.mail-pw-form-details summary').click
  }
  await page.locator('[data-test="username"]').fill(user.email)
  logger.info('Fill password')
  await page.locator('[data-test="password"]').fill(user.password)
  logger.info('Submit')
  await page.locator('[data-test="submit"]').click()
}
