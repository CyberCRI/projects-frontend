import type { User } from '../interfaces'
import { LogLevel, Logger } from '../../logger'
import { Page, expect } from '@playwright/test'

const logger = new Logger(LogLevel.Debug)

export async function logIn(page: Page, user: User) {
  logger.info('Click on login button')
  //  await page.goto('/') // if needed replace with  await page.locator('[data-test="lpi-logo"]').click()
  await page.locator('[data-test="test-login-button"]').click()
  logger.info(`Fill username or email (${user.email})`)
  const loginForm = await page.locator('#kc-form-login')
  if (await loginForm.isHidden()) {
    await page.locator('.mail-pw-form-details summary').click()
  }
  await page.locator('[data-test="username"]').fill(user.email)
  logger.info('Fill password')
  await page.locator('[data-test="password"]').fill(user.password)
  logger.info('Submit')
  await page.locator('[data-test="submit"]').click()
  // await page navigation check
  page.waitForLoadState('networkidle')
  // check if acceot tos modal is present
  const acceptTosModal = page.locator('#approve-terms-modal')
  if (await acceptTosModal.isVisible()) {
    logger.info('Accept TOS modal is visible, accepting terms of service')
    // scroll terms to bottom
    const termsContent = acceptTosModal.locator('.tos-content')
    await termsContent.evaluate((element) => {
      element.scrollTop = element.scrollHeight
    })
    const approveBtn = await page.locator('#approve-terms-modal [data-test="approve-terms"]')
    // wait for button to not have disabled class
    await expect(approveBtn).not.toHaveClass(/disabled/)
    approveBtn.click()
    await expect(acceptTosModal).not.toBeVisible()
    logger.info('TOS accepted')
  }
}
