import { expect } from '@playwright/test'
import { LogLevel, Logger } from '../../logger'

const logger = new Logger(LogLevel.Debug)

export async function addBlogEntry(page) {
  // logger.info('Open drawer to add blog')
  // await page.locator('[data-test="add-to-project"]').click()
  // logger.info('Click on blog entry')
  // await page.locator('[data-test="button-add-blog-to-project"]').click()
  // ;(

  logger.info('Switch to edit mode')
  await page.locator('[data-test="edit-project"]').click()
  logger.info('Open drawer to add blog')
  await page.locator('[data-test="project-blog-add"]').click()

  logger.info('Click on title input')
  await page.locator('[data-test="input-field"]').click()
  logger.info('Fill title')
  await page.locator('[data-test="input-field"]').fill('Test Blog Entry')
  logger.info('Fill text field')
  await page.locator('[data-test="input-editor-content-simple"] div').click()
  await page
    .locator('[data-test="input-editor-content-simple"] div')
    .fill('Testing description blog entry')
  logger.info('Form filled')
  await page.locator('.blog-drawer [data-test="confirm-button"]').click()
  logger.info('Click to save')
  await expect(page.locator('[data-test="drawer-background"]')).toHaveCount(0)
  logger.info('Checked if drawer is closed')
}
