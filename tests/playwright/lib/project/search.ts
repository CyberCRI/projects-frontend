import { expect } from '@playwright/test'
import { delay } from '../index'
import { LogLevel, Logger } from '../../logger'

const logger = new Logger(LogLevel.Debug)

export async function search(page, projId) {
  await page.locator('[data-test="lpi-logo"]').click()
  logger.info('Click search input')
  logger.info('Fill it with project ID')
  await page.locator('[data-test="search-input"]').click()
  await page.locator('[data-test="search-input"]').fill(projId)
  logger.info('Wait 15 sec to load results')
  await delay(10000)
  logger.info('Click to launch the search')
  await page.locator('[data-test="search-input-button"]').click()
  logger.info('Check to have the right project ID')
  await expect(page.locator('.card-description').first()).toHaveText(projId)
  logger.info('Id checked')
  logger.info('Click on first project of results')
  await page.locator('.card-description').first().click()
}
