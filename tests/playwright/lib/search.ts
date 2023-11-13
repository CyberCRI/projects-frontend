import { expect } from '@playwright/test'
import { delay } from './delay'
import { LogLevel, Logger } from '../logger'

const logger = new Logger(LogLevel.Debug)

export async function search(page, projId) {
    await page.locator('[data-test="lpi-logo"]').click()
    logger.info('Click search input')
    logger.info('Fill it with project ID')
    await page.locator('[data-test="search-input"]').click()
    await page.locator('[data-test="search-input"]').fill(projId)
    logger.info('Wait 15 sec to load results')
    await delay(7000)
    logger.info('Click to launch the search')
    await page.locator('[data-test="search-input-button"]').click()
    await page.locator('[data-test^="project-card-"]').first().click()
}
