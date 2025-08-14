import { expect } from '@playwright/test'
import { LogLevel, Logger } from '../../logger'

const logger = new Logger(LogLevel.Debug)

export async function editDescription(page) {
  const displayMode = await page.locator('.project-display-layout') // wait group page to be loaded
  const displayModeCount = await displayMode.count()
  console.log('is in display mode ?', displayModeCount)
  //switch to edit mode if necessary
  if (displayModeCount) {
    console.log('switch to edit mode')
    page.locator('[data-test="edit-project"]').click()
    await page.locator('.project-edit-layout')
  }

  const editDescriptionButton = await page.locator('[data-test="project-description-edit"]')

  await expect(editDescriptionButton).toHaveCount(1)

  const isActive = await editDescriptionButton.evaluate((el) =>
    el.parentElement?.classList.contains('active')
  )

  if (!isActive) {
    logger.info('Click to edit description')
    await editDescriptionButton.click()
  } else {
    logger.info('Already in edit description mode, skipping click')
  }

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
