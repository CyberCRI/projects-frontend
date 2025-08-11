import { Page } from '@playwright/test'
import { LogLevel, Logger } from '../../logger'
import { ensureNavPanelIOpened } from '../utils/nav-panel'

const logger = new Logger(LogLevel.Debug)

export async function deleteGroup(page: Page, groupName: string) {
  logger.info('Navigate to group Home page')
  //  await page.goto('/') // if needed replace with  await page.locator('[data-test="lpi-logo"]').click
  await page.locator('[data-test="lpi-logo"]').click()
  await page.locator('[data-test="search-input"]').fill(groupName)
  await page.locator('[data-test="search-input-button"]').click()
  await page.locator(`[data-test="group-card-${groupName}"]`).click()

  await ensureNavPanelIOpened(page)

  const displayMode = await page.locator('.group-display-layout') // wait group page to be loaded
  const displayModeCount = await displayMode.count()
  console.log('is in display mode ?', displayModeCount)
  //switch to edit mode if necessary
  if (displayModeCount) {
    console.log('switch to edit mode')
    page.locator('[data-test="edit-group"]').click()
    await page.locator('.group-edit-layout')
  }

  await page.locator(`[data-test="group-snapshot-edit"]`).click()
  await page.locator(`[data-test="delete-group-button"]`).click()
}
