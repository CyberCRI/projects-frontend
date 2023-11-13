import { LogLevel, Logger } from '../logger'

const logger = new Logger(LogLevel.Debug)

export async function addDescription(page) {
    logger.info('Click on description tab')
    await page.locator('[data-test="project-description"]').click()
    logger.info('Click to add description')
    await page.locator('[data-test="add-description-button"]').click()
    // add description
    logger.info('Fill the input editor')
    logger.info('Add description to project')
    await page.locator('.ProseMirror').first().fill('Veuillez décrire votre projet\n\ntest')
    await page.locator('[data-test="button-tiptap-multieditor\\.heading_1"]').click()
    logger.info('Title added')
    await page.getByText('Veuillez décrire votre projettest').press('Enter')
    await page.locator('[data-test="button-tiptap-multieditor\\.image\\.image"]').click()
    await page.locator('[data-test="upload-image-button"]').click()
    await page
        .locator('[data-test="upload-image-button"]')
        .setInputFiles('tests/playwright/fixtures/png/pinguinmoon.png')
    await page.locator('[data-test="confirm-destroy"]').click()
    logger.info('Image added')
    await page.getByText('Veuillez décrire votre projettest').press('Enter')
    await page.locator('[data-test="button-tiptap-multieditor\\.video"]').click()
    await page.locator('[data-test="input-video-link"]').click()
    await page
        .locator('[data-test="input-video-link"]')
        .fill('https://www.youtube.com/watch?v=vTf0-Xl8x_Q')
    await page.locator('[data-test="confirm-destroy"]').click()
    logger.info('Video added')
    await page.getByText('Veuillez décrire votre projettest').press('Enter')
    logger.info('Add table to description')
    await page.locator('[data-test="button-tiptap-multieditor\\.table"]').click()
    logger.info('Table added')
    await page.locator('[data-test="confirm-button"]').click()
    logger.info('Description added')
}
