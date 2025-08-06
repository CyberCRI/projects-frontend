import { expect } from '@playwright/test'
import { emailToReport } from '../../variables'
import { LogLevel, Logger } from '../../logger'
import { delay } from '../index'

const logger = new Logger(LogLevel.Debug)

export async function reportBug(page) {
  logger.info('Click on project settings')
  await delay(1000) // give times skeleton to kick in
  await expect(page.locator('.project-tabs-skeleton')).toHaveCount(0)
  await delay(2000) // give times for tabs to compute
  // let settings = await page.locator('[data-test="project-settings"]')
  // button might be hidden in extra tabs dropdown
  // const settingsCount = await settings.count()
  // console.log('settings count', settingsCount)
  // if (!settingsCount) {
  //   console.log('will click extra tabs button')
  //   await page.locator('[data-test="extra-tabs-button"]').click()
  //   settings = await page.locator('[data-test="project-settings"]')
  // }
  logger.info('Click on report abuse')
  // await delay(5000)
  await page.locator('[data-test="report-abuse"]').click()
  logger.info('Add email to report')
  await page.locator('[data-test="report-email"]').click()
  await page.locator('[data-test="report-email"]').fill(emailToReport)
  logger.info('Email to report added')
  logger.info('Add Url to report')
  await page.locator('[data-test="report-url"]').click()
  await page.locator('[data-test="report-url"]').fill('https://www.google.com')
  logger.info('Url to report added')
  logger.info('Add title')
  await page.locator('[data-test="report-title"]').click()
  await page.locator('[data-test="report-title"]').fill('test report abuse ')
  logger.info('Title added')
  logger.info('Add description')
  await page.locator('[data-test="report-description"]').click()
  await page.locator('[data-test="report-description"]').fill('testing')
  logger.info('Description added')
  await page.locator('.report-form [data-test="confirm-button"]').click()
  logger.info('Click to confirm report')
  await expect(page.locator('[data-test="drawer-background"]')).toHaveCount(0)
  logger.info('Checked if drawer is closed')
}
