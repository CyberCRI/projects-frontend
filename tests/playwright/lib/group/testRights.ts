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

  //await delay(2000) // wait for the different serach page redirections (query string building)
  if (rightToTest === 'member') {
    logger.info(`Test right to ${groupName} to ${rightToTest}`)
    // await page.locator(`[data-test="group-card-${groupName}"]`).click()
    await page.waitForSelector('.group-layout') // wait group page to be loaded
    const editGroupLocator = page.locator('[data-test="edit-group"]')
    const isVisible = await editGroupLocator.isVisible()
    expect(isVisible).toBe(false)
  } else if (rightToTest === 'manager') {
    logger.info(`Test right to ${groupName} to ${rightToTest}`)
    // await page.locator(`[data-test="group-card-${groupName}"]`).click()
    //await delay(3000)
    await page.waitForSelector('.group-layout') // wait group page to be loaded
    await page.locator('[data-test="edit-group"]').waitFor({ state: 'visible' })
  } else if (rightToTest === 'leader') {
    logger.info(`Test right to ${groupName} to ${rightToTest}`)
    // await page.locator(`[data-test="group-card-${groupName}"]`).click()
    //await delay(3000)
    await page.waitForSelector('.group-layout')
    // wait group page to be loaded
    // TODO this dumm, leader-badge class is on every role, fix this
    const badgeLocator = page.locator(`[data-test="leader-badge"]`)
    await expect(badgeLocator).toHaveCount(2)
  }
}
