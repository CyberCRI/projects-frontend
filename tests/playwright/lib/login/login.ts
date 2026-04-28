import { LogLevel, Logger } from '~~/tests/playwright/logger'
import { delay } from '~~/tests/playwright/lib/tools'
import { Page, expect } from '@playwright/test'
import { User } from '@sentry/vue'

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
  // page.waitForLoadState('networkidle')
  // check if acceot tos modal is present

  // pass loader
  const appLoader = await page.locator('.app-loader')
  await expect(appLoader).toBeVisible()
  await expect(appLoader).not.toBeVisible()

  await delay(1000) // wait for modals to appear

  const acceptTosModal = page.locator('#approve-terms-modal')
  if (await acceptTosModal.isVisible()) {
    logger.info('Accept TOS modal is visible, accepting terms of service')
    // scroll terms to bottom
    const termsContent = acceptTosModal.locator('.modal-content')
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

  await delay(1000) // wait for modals to appear

  // handle onboarding modals
  const WelcomModal = page.locator('[data-test="welcome-modal"]')
  if (await WelcomModal.isVisible()) {
    logger.info('Welcome modal is visible, skiping it')
    const closeBtn = WelcomModal.locator('[data-test="close-button"]')
    await closeBtn.click()
    await expect(WelcomModal).not.toBeVisible()
    logger.info('Welcome modal skipped')
  }

  await delay(1000) // wait for modals to appear

  // handle onboarding modals
  const taketourModal = page.locator('[data-test="take-tour-modal"]')
  if (await taketourModal.isVisible()) {
    logger.info('Welcome modal is visible, skiping it')
    const closeBtn = taketourModal.locator('[data-test="modal-dismiss-button"]')
    await closeBtn.click()
    await expect(taketourModal).not.toBeVisible()
    logger.info('Welcome modal skipped')
  }
}
