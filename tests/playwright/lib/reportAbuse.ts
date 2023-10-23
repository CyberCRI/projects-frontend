import { emailToReport } from '../variables'
import { LogLevel, Logger } from '../logger'

const logger = new Logger(LogLevel.Debug)

export async function reportAbuse(page) {
    logger.info('Click on project settings')
    await page.locator('[data-test="project-settings"]').click()
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
    await page.locator('[data-test="report-button"]').click()
    logger.info('Click to confirm report ')
}
