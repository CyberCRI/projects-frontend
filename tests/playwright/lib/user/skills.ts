import { LogLevel, Logger } from '../../logger'

const logger = new Logger(LogLevel.Debug)

export async function editBio(page) {
    logger.info('Edit Bio info')
    await page.locator('[data-test="dropdown-user-account"]').waitFor(20000)
    await page.locator('[data-test="dropdown-user-account"]').click()
    await page.locator('[data-test="my-profile"]').waitFor(20000)
    await page.locator('[data-test="my-profile"]').click()
    await page.locator('[data-test="edit-profile"]').waitFor(20000)
    await page.locator('[data-test="edit-profile"]').click()
    await page.locator('[data-test="skills"]').click()
    await page.locator('[data-test="add-skills-button"]').click()
    await page.locator('[data-test="search-input"]').click()
    await page.locator('[data-test="confirm-button"]').click()
}
