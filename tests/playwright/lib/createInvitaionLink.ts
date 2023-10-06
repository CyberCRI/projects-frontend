import { expect } from '@playwright/test'
import { LogLevel, Logger } from '../logger'
import { delay } from './delay'
import { organizationCode } from '../variables'

const logger = new Logger(LogLevel.Debug)

export async function createInvitaionLink(page) {
    logger.info('Wait 20 sec')

    await page.locator('[data-test="dropdown-user-account"]').waitFor(20000)
    await page.locator('[data-test="dropdown-user-account"]').click()
    await page.locator('[data-test="admin"]').waitFor(20000)
    await page.locator('[data-test="admin"]').click()
    await page.locator('[data-test="admin-links"]').click()
    await page.locator('[data-test="create-link"]').click()
    await page.locator('[data-test="one-year"]').click()
    await page.locator('[data-test="input-field"]').click()
    await page.locator('[data-test="input-field"]').fill('tester en e2e')
    await page.locator('[data-test="add-group"]').click()
    await page.locator('[data-test="search-input"]').click()
    await page.locator('[data-test="search-input"]').fill('google')
    await page.locator('[data-test="search-input"]').press('Enter')
    await page
        .getByRole('main')
        .locator('div')
        .filter({
            hasText: '1Google sync test protocol (dev)Google sync test protocol group (dev)',
        })
        .nth(2)
        .click()
    await page.locator('[data-test="save-link"]').click()
    const jose = await page
        .getByRole('row', {
            name: 'Google sync test protocol (dev) auto2 test dev tester en e2e Copier le lien 04/10/2024',
        })
        .locator('[data-test="cpy-link"]')
        .click()
    console.log(jose)
}
