import { LogLevel, Logger } from '../../logger'

const logger = new Logger(LogLevel.Debug)

export async function editBio(page) {
  logger.info('Edit Bio info')
  // await page.waitForSelector('[data-test="dropdown-user-account"]')
  // await page.locator('[data-test="dropdown-user-account"]').click()
  // await page.waitForSelector('[data-test="my-profile"]')
  // await page.locator('[data-test="my-profile"]').click()
  await page.waitForSelector('[data-test="edit-profile"]')
  await page.locator('[data-test="edit-profile"]').click()
  await page.waitForSelector('.profile-edit-tabs') // wait edit profile to be loaded
  await page.locator('[data-test="bio"]').click()
  await page.locator('[data-test="short-bio-input"]').fill('e2e testing bio')
  await page.locator('[data-test="long-bio-editor"] p').first().fill('long bio test')
  await page.locator('[data-test="confirm-button"]').click()
}
