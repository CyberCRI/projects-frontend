import { LogLevel, Logger } from '../logger'

const logger = new Logger(LogLevel.Debug)

export async function editDescription(page) {
    logger.info('Click to edit description')
    await page.locator('[data-test="project-description"]').click()
    await page.locator('[data-test="edit-description"]').click()
    logger.info('Click on input editor')
    await page.locator('[data-test="input-editor-content-connected"]').click()
    await page.locator('[data-test="input-editor-content-connected"]').press('Enter')
    logger.info('Fill content with text')
    await page.locator('[data-test="input-editor-content-connected"] p').first().fill('test edited')
    await page.locator('[data-test="confirm-button"]').click()
    logger.info('Click to save edit')
}
