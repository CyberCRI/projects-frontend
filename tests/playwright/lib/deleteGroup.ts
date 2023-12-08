import { Page } from '@playwright/test'
import { LogLevel, Logger } from '../logger'

const logger = new Logger(LogLevel.Debug)

export async function deleteGroup(page: Page, GroupName: string) {
    logger.info('Navigate to group Home page')
    await page.goto('/')
    await page.locator('[data-test="search-input"]').focus()
    await page.locator('[data-test="search-input"]').fill(GroupName)
    await page.locator('[data-test="search-input-button"]').click()
    await page.locator(`[data-test="group-card-${GroupName}"]`).click()
    await page.locator(`[data-test="edit-group"]`).click()
    await page.locator(`[data-test="delete-group-button"]`).click()
}
