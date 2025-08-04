import { Page } from '@playwright/test'
import { delay } from '../index'
import { LogLevel, Logger } from '../../logger'
import { usersDict as users } from '../../variables'

const logger = new Logger(LogLevel.Debug)

export async function setRights(page: Page, groupName: string, rightToSet: string): Promise<void> {
  logger.info(`Finfd group ${groupName}`)
  await page.locator('[data-test="lpi-logo"]').click()
  await page.locator('[data-test="search-input"]').fill(groupName)
  await page.locator('[data-test="search-input-button"]').click()
  //await delay(3000) // wait for the different search page redirections (query string building)
  await page.locator(`[data-test="group-card-${groupName}"]`).click()

  logger.info(`Set right to ${groupName} to ${rightToSet}`)
  await page.waitForSelector('.group-layout')
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
  await page.locator(`[data-test="edit-roles"]`).click()

  if (rightToSet === 'member') {
    //await delay(1000)
    // TODO find a better way to avoid changing right of non super admin user
    await page
      .locator(`[data-group-user-email="${users.playwright.email}"] [data-test="members"]`)
      .last()
      .click()
  } else if (rightToSet === 'manager') {
    // delay(1000)
    // TODO find a better way to avoid changing right of non super admin user
    await page
      .locator(`[data-group-user-email="${users.playwright.email}"] [data-test="editors"]`)
      .last()
      .click()
  } else if (rightToSet === 'leader') {
    //await delay(1000)
    // TODO find a better way to avoid changing right of non super admin user
    await page
      .locator(`[data-group-user-email="${users.playwright.email}"] [data-test="leaders"]`)
      .last()
      .click()
  }
  //await delay(1000)
  await page.locator(`[data-test="confirm-button"]`).click()
  //await delay(1000)
  await page.locator(`[data-test="group-create-button"]`).click()
  // Creation group is made in 2 requests wait the the second request to be sent
  //await delay(5000)
  // wait for post save redirect to group page
  await page.waitForSelector('.group-layout')
}
