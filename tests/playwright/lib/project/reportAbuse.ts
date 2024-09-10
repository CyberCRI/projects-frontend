import { expect } from '@playwright/test'
import { emailToReport } from '../../variables'
import { LogLevel, Logger } from '../../logger'

const logger = new Logger(LogLevel.Debug)

export async function reportAbuse(page) {
    logger.info('Click on project settings')
    let settings = await page.locator('[data-test="project-settings"]')
    // button might be hidden in extra tabs dropdown
    if (!settings) {
        await page.locator('[data-test="extra-tabs-button"]').click()
        settings = await page.locator('[data-test="project-settings"]')
    }
    await page.locator('[data-test="report-bug"]').click()
    logger.info('Click on report bug')
    logger.info('Fill email to report')
    await page.locator('[data-test="report-email"]').click()
    await page.locator('[data-test="report-email"]').fill(emailToReport)
    logger.info('Email added')
    logger.info('Add url to report added')
    await page.locator('[data-test="report-url"]').click()
    await page.locator('[data-test="report-url"]').fill('https://www.google.com')
    logger.info('Url to report added')
    logger.info('Add title')
    await page.locator('[data-test="report-title"]').click()
    await page.locator('[data-test="report-title"]').fill('test report bug ')
    logger.info('Title added')
    logger.info('Add Description')
    await page.locator('[data-test="report-description"]').click()
    await page.locator('[data-test="report-description"]').fill('testing')
    logger.info('Description added')
    await page.locator('.report-form [data-test="confirm-button"]').click()
    logger.info('Click to confirm report ')

    await expect(page.locator('[data-test="drawer-background"]')).toHaveCount(0)
    logger.info('Checked if drawer is closed')
}
