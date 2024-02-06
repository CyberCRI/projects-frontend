import { Page, expect } from '@playwright/test'
import { LogLevel, Logger } from '../../logger'
import { User } from '../interfaces'
import { delay } from '../index'

const logger = new Logger(LogLevel.Debug)

export async function testRights(
    page: Page,
    groupName: string,
    rightToTest: string
): Promise<void> {
    logger.info(`Group to test ${groupName}`)
    await page.locator('[data-test="search-input"]').fill(groupName)
    await page.locator('[data-test="search-input-button"]').click()
    if (rightToTest === 'member') {
        logger.info(`Test right to ${groupName} to ${rightToTest}`)
        await page.locator(`[data-test="group-card-${groupName}"]`).click()
        const editGroupLocator = page.locator('[data-test="edit-group"]')
        const isVisible = await editGroupLocator.isVisible()
        expect(isVisible).toBe(false)
    } else if (rightToTest === 'editor') {
        logger.info(`Test right to ${groupName} to ${rightToTest}`)
        await page.locator(`[data-test="group-card-${groupName}"]`).click()
        await delay(3000)
        await page.locator('[data-test="edit-group"]').waitFor({ state: 'visible' })
    } else if (rightToTest === 'leader') {
        logger.info(`Test right to ${groupName} to ${rightToTest}`)
        await page.locator(`[data-test="group-card-${groupName}"]`).click()
        await delay(3000)
        const leaderBadge = page.locator(`[data-test="leader-badge"]`).last()
        const isVisible = await leaderBadge.isVisible()
        expect(isVisible).toBe(true)
    }
}
