import { expect } from '@playwright/test'
import { LogLevel, Logger } from '../logger'
import { delay } from './delay'

const logger = new Logger(LogLevel.Debug)

export async function createGroup(page) {
    logger.info('Navigate to group creation page')
    await page.locator('[data-test="dropdown-user-account"]').click()
    await page.locator('[data-test="admin"]').click()
    await page.locator('[data-test="admin-groups"]').click()
    await page.locator('[data-test="create-group"]').click()
    await page.locator('[data-test="group-name-input"]').fill('Playwright test group')
    await page.locator('[data-test="group-email-input"]').fill('rototo@exemple.com')
    logger.info("let's add a description to the group")
    await page.locator('[data-test="group-short-desciption"]').fill('rototo@exemple.com')
    await page.locator('[data-test="group-short-desciption"]').fill('rototo@exemple.com')
    await page.locator('[data-test="add-description"]').click()
    await page.locator('.ProseMirror').first().fill('Veuillez décrire votre projet\n\ntest')
    await page.locator('[data-test="confirm-button"]').click()

    logger.info("let's add members to the group")
    await page.locator('[data-test="add-members"]').click()
    await page.locator('[data-test="search-input"]').fill('iryna')
    const user = await page.locator('[data-test^="user-card-"]').first()
    await user.click()
    await page.locator('[data-test="confirm-button"]').click()
    await page.locator('[data-test="confirm-button"]').click()
    logger.info("let's add parent group to the group")
    await page.locator('[data-test="add-parent-group-card"]').click()
    await page.locator('[data-test="group-81"]').click()
    await page.locator('[data-test="confirm-button"]').click()

    logger.info("let's create the group")
    await page.locator('[data-test="group-create-button"]').click()
}
