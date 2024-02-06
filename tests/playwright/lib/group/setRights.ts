import { Page } from '@playwright/test'
import { delay } from '../index'
import { LogLevel, Logger } from '../../logger'

const logger = new Logger(LogLevel.Debug)

export async function setRights(page: Page, groupName: string, rightToSet: string): Promise<void> {
    logger.info(`Set right to ${groupName} to ${rightToSet}`)
    await page.locator('[data-test="lpi-logo"]').click()
    await page.locator('[data-test="search-input"]').fill(groupName)
    logger.info(`wait for algolia to index ${groupName}`)
    await delay(2000)
    await page.locator('[data-test="search-input-button"]').click()
    await page.locator(`[data-test="group-card-${groupName}"]`).click()
    await page.locator(`[data-test="edit-group"]`).click()
    await page.locator(`[data-test="edit-roles"]`).click()

    if (rightToSet === 'member') {
        await delay(1000)
        await page.locator(`[data-test="members"]`).last().click()
    } else if (rightToSet === 'editor') {
        await delay(1000)
        await page.locator(`[data-test="editors"]`).last().click()
    } else if (rightToSet === 'leader') {
        await delay(1000)
        await page.locator(`[data-test="leaders"]`).last().click()
    }
    await delay(1000)
    await page.locator(`[data-test="confirm-button"]`).click()
    await delay(1000)
    await page.locator(`[data-test="group-create-button"]`).click()
    // Creation group is made in 2 requests wait the the second request to be sent
    await delay(5000)
}
