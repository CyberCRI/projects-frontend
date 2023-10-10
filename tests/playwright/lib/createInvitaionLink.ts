import { LogLevel, Logger } from '../logger'
import { delay } from './delay'

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
    await delay(1000)
    const groups = await page.locator('[data-test^="drawer-group-card-"]').all()
    if (groups.length > 0) {
        await groups[0].click()
        await delay(1000)
    } else {
        logger.error('No groups found')
    }
    await page.locator('[data-test="save-link"]').click()
    await delay(10000)
    const links = await page.locator('[data-test^="cpy-link-"]').all()
    if (links.length > 0) {
        const lastLink = links[links.length - 1]
        await lastLink.click()
        const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
        logger.info('link from clipboard')
        logger.info(clipboardText)
    } else {
        logger.error('Did not find any links')
    }
    const deleteBtns = await page.locator('[data-test^="delete-cpy-link-"]').all()
    const deleteBtn = deleteBtns[deleteBtns.length - 1]
    await deleteBtn.click()
    await delay(1000)
    await page.locator('[data-test="confirm-destroy"]').click()
}
