import { delay } from '../index'
import { expect } from '@playwright/test'
export async function destroyProject(page) {
  await delay(1000) // give times skeleton to kick in
  await expect(page.locator('.project-tabs-skeleton')).toHaveCount(0)
  await delay(2000) // give times for tabs to compute
  let settings = await page.locator('[data-test="project-settings"]')
  // button might be hidden in extra tabs dropdown
  const settingsCount = await settings.count()
  console.log('settings count', settingsCount)
  if (!settingsCount) {
    console.log('will click extra tabs button')
    await page.locator('[data-test="extra-tabs-button"]').click()
    settings = await page.locator('[data-test="project-settings"]')
  }
  await settings.click()
  await page.locator('[data-test="destroy-project"]').click()
  await page.locator('[data-test="confirm-destroy"]').click()
}
