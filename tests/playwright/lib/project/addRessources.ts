import { LogLevel, Logger } from '../../logger'
import { delay } from '../index'

const logger = new Logger(LogLevel.Debug)

export async function addRessources(page) {
  // add ressources link
  logger.info('Click to add ressources to project')
  await page.locator('[data-test="add-to-project"]').click()
  await page.locator('[data-test="button-add-resource-to-project"]').click()
  logger.info('Click on add link')
  await page.locator('[data-test="add-link"]').click()
  await page
    .locator('[data-test="input-link-adress"]')
    .fill('https://www.learningplanetinstitute.org/')
  logger.info('Link added')
  logger.info('Click to add title')
  await page.locator('[data-test="input-link-title"]').fill('test link ressources')
  logger.info('Title added')
  logger.info('Add link description')
  await page.locator('[data-test="input-link-description"]').fill('testing')
  await page.locator('[data-test="confirm-button"]').click()

  await delay(5000)

  // add ressources file
  logger.info('Click to add file')
  await page.locator('[data-test="add-to-project"]').click()
  await page.locator('[data-test="button-add-resource-to-project"]').click()
  await page.locator('[data-test="add-file"]').click()
  logger.info('Fill added')
  logger.info('Fill title file')
  await page.locator('[data-test="input-link-title"]').fill('test file ressources')
  logger.info('Title added title file')
  logger.info('Fill description file')
  await page.locator('[data-test="input-link-description"]').fill('testing')
  logger.info('Description file added')
  logger.info('Click to upload img')
  await page.locator('[data-test="upload-image-button"]').click()
  await page
    .locator('[data-test="upload-image-button"]')
    .setInputFiles('tests/playwright/fixtures/pdf/testing.pdf')
  logger.info('Select and add file from local folder')
  await page.locator('[data-test="confirm-button"]').click()
  await delay(5000)
}
