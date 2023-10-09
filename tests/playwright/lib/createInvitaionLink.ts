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
    await page.locator('[data-test="search-btn"]').click()
    await page
        .getByRole('main')
        .locator('div')
        .filter({
            hasText: '1Google sync test protocol (dev)Google sync test protocol group (dev)',
        })
        .nth(2)
        .click()
    await page.locator('[data-test="save-link"]').click()
    await delay(5000)
    const count = await page.locator('[data-test^="cpy-link-"]').count()
    logger.info('count')
    logger.info(count)
    const links = await page.locator('[data-test^="cpy-link-"]').all()
    const lastLink = links[links.length - 1]
    logger.info('lastLink')
    logger.info(lastLink)
    await lastLink.click()
    await delay(2000)
    logger.info('Get the link from clipboard')
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    // let clipboardText1 = await page.evaluate("navigator.clipboard.readText()");
    logger.info('link from clipboard')
    console.log(clipboardText)
}
