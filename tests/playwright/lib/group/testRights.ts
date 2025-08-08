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

  // await page.locator('[data-test="lpi-logo"]').waitFor({ state: 'attached' })
  // await page.locator('[data-test="lpi-logo"]').click()

  // await page.locator('[data-test="search-input"]').waitFor({ state: 'attached' })
  // await page.locator('[data-test="search-input"]').fill(groupName)
  // // await page.locator('[data-test="lpi-logo"]').click() // go to home page to have search bar
  // // await page.locator('[data-test="search-input"]').fill(groupName)
  // await page.locator('[data-test="search-input-button"]').click()
  await page.locator('.group-layout')
  const displayMode = await page.locator('.group-display-layout') // wait group page to be loaded
  const displayModeCount = await displayMode.count()
  console.log('is in display mode ?', displayModeCount)
  //switch to display mode if necessary
  if (!displayModeCount) {
    console.log('switch to diplay mode')
    page.locator('[data-test="show-group"]').click()
    await page.locator('.group-display-layout')
  }

  //await delay(2000) // wait for the different serach page redirections (query string building)
  if (rightToTest === 'member') {
    logger.info(`Test right to ${groupName} to ${rightToTest}`)
    const editGroupLocator = page.locator('[data-test="edit-group"]')
    const isVisible = await editGroupLocator.isVisible()
    expect(isVisible).toBe(false)
  } else if (rightToTest === 'manager') {
    logger.info(`Test right to ${groupName} to ${rightToTest}`)
    await page.locator('[data-test="edit-group"]').waitFor({ state: 'visible' })
  } else if (rightToTest === 'leader') {
    logger.info(`Test right to ${groupName} to ${rightToTest}`)
    // TODO this dumm, leader-badge class is on every role, fix this
    const badgeLocator = page.locator(`[data-test="leader-badge"]`)
    await expect(badgeLocator).toHaveCount(2)
  }
}
