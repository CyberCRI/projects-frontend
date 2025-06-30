import { Page } from '@playwright/test'
import { delay } from '../index'
import { LogLevel, Logger } from '../../logger'

const logger = new Logger(LogLevel.Debug)

export async function createGroup(page: Page, GroupName: string) {
  logger.info('Navigate to group creation page')
  await page.locator('[data-test="dropdown-user-account"]').click()
  await page.locator('[data-test="admin"]').click()

  let groupsTab = await page.locator('[data-test="admin-groups"]')
  // button might be hidden in extra tabs dropdown
  const groupsTabCount = await groupsTab.count()
  console.log('groupsTab count', groupsTabCount)
  // if (!groupsTabCount) {
  //   console.log('will click extra tabs button')
  //   await page.locator('[data-test="extra-tabs-button"]').click()
  //   groupsTab = await page.locator('[data-test="admin-groups"]')
  // }
  await groupsTab.click()

  // try {
  //     await page.locator('[data-test="admin-groups"]').click()
  // } catch (e) {
  //     // group tab might be hidden in a "seem more" menu if screen is small
  //     await page.locator('.tabs-header .more-btn').click()
  //     await page.locator('[data-test="admin-groups"]').click()
  // }

  await page.locator('[data-test="create-group"]').click()
  await page.locator('[data-test="group-name-input"]').fill(GroupName)
  await page.locator('[data-test="group-email-input"]').fill('rototo@exemple.com')
  logger.info("let's add a description to the group")
  await page.locator('[data-test="group-short-desciption"]').fill('rototo@exemple.com')
  await page.locator('[data-test="group-short-desciption"]').fill('rototo@exemple.com')
  await page.locator('[data-test="add-description"]').click()
  await page.locator('.ProseMirror').first().fill('Veuillez décrire votre projet\n\ntest')
  await page.locator('[data-test="confirm-button"]').click()

  logger.info("let's add members to the group")
  await page.locator('[data-test="add-members"]').click()
  await page.locator('[data-test="search-input"]').fill('playwright')
  // await delay(1000)
  await page.locator('[data-test^="user-card-"]').first().click()
  // await delay(1000)
  await page.locator('[data-test="confirm-button"]').click()
  // await delay(3000)
  await page.locator('[data-test="confirm-button"]').click()
  // await delay(1000)
  logger.info("let's add parent group to the group")
  await page.locator('[data-test="add-parent-group-card"]').click()
  // await delay(1000)
  await page.locator('[data-test="confirm-button"]').click()

  logger.info("let's create the group")
  await page.locator('[data-test="group-create-button"]').click()
  // Creation group is made in 2 requests wait the the second request to be sent
  // await delay(5000)
}
