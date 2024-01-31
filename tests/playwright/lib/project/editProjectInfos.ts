import { expect } from '@playwright/test'
import { LogLevel, Logger } from '../../logger'

const logger = new Logger(LogLevel.Debug)

export async function editProjectInfos(page, projId2) {
    logger.info('Click to edit project infos')
    await page.locator('[data-test="header-project-button"]').click()
    await page.locator('[data-test="purpose-input"]').click()
    logger.info('Fill the purpose with new text')
    await page.locator('[data-test="purpose-input"]').fill(projId2)
    await page.locator('[data-test="confirm-button"]').click()
    logger.info('Click to save edit')
    await expect(page.locator('[data-test="drawer-background"]')).toHaveCount(0)
    logger.info('Checked if drawer is closed')
}
