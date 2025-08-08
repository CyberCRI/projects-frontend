import { Page, expect } from '@playwright/test'
import { LogLevel, Logger } from '../../logger'
import { User } from '../interfaces'
import { delay } from '../index'
import { ensureNavPanelIOpened } from '../utils/nav-panel'
const logger = new Logger(LogLevel.Debug)

export async function testRights(
  page: Page,
  groupName: string,
  rightToTest: string
): Promise<void> {
  logger.info(`Group to test ${groupName}`)

  // await page.locator('[data-test="lpi-logo"]').waitFor({ state: 'attached' })
  // await page.locator('[data-test="lpi-logo"]').click()

  // await page.locator('[data-test="search-input"]').waitFor({ state: 'attached' })
  // await page.locator('[data-test="search-input"]').fill(groupName)
  // // await page.locator('[data-test="lpi-logo"]').click() // go to home page to have search bar
  // // await page.locator('[data-test="search-input"]').fill(groupName)
  // await page.locator('[data-test="search-input-button"]').click()
  await page.locator('.group-layout').waitFor({ state: 'attached' })

  await ensureNavPanelIOpened(page)

  // TODO factorize as utility for all nav panels
  const switcher = await page.locator('.panel-mode-switcher')
  let isEditMode = false
  // switch appear only if user has edit right
  try {
    await switcher.waitFor({ state: 'attached' })
    const switcherDT = await switcher.getAttribute('data-test')
    // if switch toggle to show, we are in edit mode
    isEditMode = switcherDT === 'show-group'
  } catch (error) {
    console.error('No mode switcher found, assume display mode')
  }
  console.log('is in edit mode ?', isEditMode)
  //switch to display mode if necessary
  if (isEditMode) {
    console.log('switch to diplay mode')
    await page.locator('[data-test="show-group"]').click()
    await page.locator('.group-display-layout').waitFor({ state: 'attached' })
  }

  //await delay(2000) // wait for the different serach page redirections (query string building)
  if (rightToTest === 'member') {
    logger.info(`Test right to ${groupName} to ${rightToTest}`)
    const editGroupLocator = page.locator('[data-test="edit-group"]')
    const isVisible = await editGroupLocator.isVisible()
    await expect(isVisible).toBe(false)
  } else if (rightToTest === 'manager') {
    logger.info(`Test right to ${groupName} to ${rightToTest}`)
    await page.locator('[data-test="edit-group"]').waitFor({ state: 'visible' })
  } else if (rightToTest === 'leader') {
    logger.info(`Test right to ${groupName} to ${rightToTest}`)
    // TODO this dumm, leader-badge class is on every role, fix this
    const badgeLocator = await page.locator(`[data-test="leader-badge"]`)
    await expect(badgeLocator).toHaveCount(2)
  }
}
