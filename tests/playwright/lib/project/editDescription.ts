import { expect } from '@playwright/test'
import { LogLevel, Logger } from '../../logger'

const logger = new Logger(LogLevel.Debug)

export async function editDescription(page) {
  const displayMode = await page.locator('.group-display-layout') // wait group page to be loaded
  const displayModeCount = await displayMode.count()
  console.log('is in display mode ?', displayModeCount)
  //switch to edit mode if necessary
  if (displayModeCount) {
    console.log('switch to edit mode')
    page.locator('[data-test="edit-group"]').click()
    await page.locator('.group-edit-layout')
  }

  logger.info('Click to edit description')
  await page.locator('[data-test="project-description"]').click()

  // await page.locator('[data-test="edit-description"]').click()

  logger.info('Click on input editor')
  await page.locator('[data-test="input-editor-content-connected"]').click()
  await page.locator('[data-test="input-editor-content-connected"]').press('Enter')
  logger.info('Fill content with text')
  await page.locator('[data-test="input-editor-content-connected"] p').first().fill('test edited')
  await page.locator('[data-test="confirm-button"]').click()
  logger.info('Click to save edit')
  await expect(page.locator('[data-test="drawer-background"]')).toHaveCount(0)
  logger.info('Checked if drawer is closed')
}
