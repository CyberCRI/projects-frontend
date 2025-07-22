import { Page } from '@playwright/test'
import { LogLevel, Logger } from '../../logger'

const logger = new Logger(LogLevel.Debug)

export async function deleteGroup(page: Page, groupName: string) {
  logger.info('Navigate to group Home page')
  //  await page.goto('/') // if needed replace with  await page.locator('[data-test="lpi-logo"]').click
  await page.locator('[data-test="lpi-logo"]').click()
  await page.locator('[data-test="search-input"]').fill(groupName)
  await page.locator('[data-test="search-input-button"]').click()
  await page.locator(`[data-test="group-card-${groupName}"]`).click()

  const toggleButton = await page.locator('.nav-panel-toggle-button')
  // open side panel if it is collapsed
  const isCollapsed = await toggleButton.evaluate((node) =>
    node.classList.contains('nav-panel-toggle-button-collapsed')
  )
  if (isCollapsed) {
    logger.info('Undcollapse nav panel')
    await toggleButton.click()
  }

  await page.locator(`[data-test="edit-group"]`).click()
  await page.locator(`[data-test="delete-group-button"]`).click()
}
