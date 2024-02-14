import { LogLevel, Logger } from '../../logger'

const logger = new Logger(LogLevel.Debug)

export async function generalInfo(page) {
    logger.info('Edit general info')
    await page.locator('[data-test="dropdown-user-account"]').waitFor(20000)
    await page.locator('[data-test="dropdown-user-account"]').click()
    await page.locator('[data-test="my-profile"]').waitFor(20000)
    await page.locator('[data-test="my-profile"]').click()
    await page.locator('[data-test="edit-profile"]').waitFor(20000)
    await page.locator('[data-test="edit-profile"]').click()
    await page.locator('[data-test="first-name-input"]').fill('Jesus')
    await page.locator('[data-test="last-name-input"]').fill('of Nazareth')
    await page.locator('[data-test="pronouns-input"]').fill('He')
    await page.locator('[data-test="professional-number-input"]').fill('123456789')
    await page.locator('[data-test="personal-number-input"]').fill('123456789')
    await page.locator('[data-test="linkedin-input"]').fill('https://www.jesus.com')
    await page.locator('[data-test="twitter-input"]').fill('https://www.x.com/jesus')
    await page.locator('[data-test="title-input"]').fill('CEO of Heaven')
    await page.locator('[data-test="location-input"]').fill('17 Heaven Street, Cloud 9')
    await page.locator('[data-test="sdg-add"]').click()

    for (let i = 0; i < 14; i++) {
        await page.locator(`[data-test="sdg-${i + 1}"]`).click()
    }
    await page.locator('[data-test="drawer-layout-container"] [data-test="confirm-button"]').click()
    await page.locator('[data-test="main-form"] [data-test="confirm-button"]').click()
}
