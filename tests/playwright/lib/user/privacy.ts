import { LogLevel, Logger } from '../../logger'
import { delay } from '../index'

const logger = new Logger(LogLevel.Debug)

export async function createInvitaionLink(page) {
  logger.info('Wait 20 sec')
  await page.waitForSelector('[data-test="dropdown-user-account"]')
  await page.locator('[data-test="dropdown-user-account"]').click()
  await page.waitForSelector('[data-test="my-projects"]')
  await page.locator('[data-test="my-projects"]').click()
  await page.locator('[data-test="button-label"]').click()
  await page.locator('[data-test="create-link"]').click()
  await page.locator('[data-test="one-year"]').click()
  await page.locator('[data-test="input-field"]').click()
  await page.locator('[data-test="input-field"]').fill('tester en e2e')
  await page.locator('[data-test="add-group"]').click()
  await delay(1000)
  const group = await page.locator('[data-test^="drawer-group-card-"]').first()
  if (group) {
    await group.click()
  } else {
    logger.error('No groups found')
  }
  await delay(1000)
  await page.locator('[data-test="save-link"]').click()
}
