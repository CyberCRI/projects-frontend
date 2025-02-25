import { LogLevel, Logger } from '../../logger'

const logger = new Logger(LogLevel.Debug)

export async function generalInfo(page, user) {
    logger.info('Edit general info')
    await page.locator('[data-test="dropdown-user-account"]').waitFor(20000)
    await page.locator('[data-test="dropdown-user-account"]').click()
    await page.locator('[data-test="my-profile"]').waitFor(20000)
    await page.locator('[data-test="my-profile"]').click()
    await page.locator('[data-test="edit-profile"]').waitFor(20000)
    await page.locator('[data-test="edit-profile"]').click()
    await page.locator('[data-test="first-name-input"]').fill(user.firstName)
    await page.locator('[data-test="last-name-input"]').fill(user.lastName)
    await page.locator('[data-test="pronouns-input"]').fill('It')
    await page.locator('[data-test="professional-number-input"]').fill('123456789')
    await page.locator('[data-test="personal-number-input"]').fill('123456789')
    await page
        .locator('[data-test="linkedin-input"]')
        .fill('https://www.linked.in/' + user.firstName)
    // await page.locator('[data-test="twitter-input"]').fill('https://www.x.com/' + user.firstName)
    await page.locator('[data-test="title-input"]').fill('Testting as ' + user.firstName)
    await page
        .locator('[data-test="location-input"]')
        .fill('The place where ' + user.firstName + ' lives')
    await page.locator('[data-test="sdg-add"]').click()

    for (let i = 0; i < 14; i++) {
        await page.locator(`[data-test="sdg-${i + 1}"]`).click()
    }
    await page.locator('[data-test="drawer-layout-container"] [data-test="confirm-button"]').click()
    await page.locator('[data-test="main-form"] [data-test="confirm-button"]').click()
}
