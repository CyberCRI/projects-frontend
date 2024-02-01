import { expect } from '@playwright/test'
import { LogLevel, Logger } from '../logger'
import { organizationCode } from '../variables'

const logger = new Logger(LogLevel.Debug)

export async function createProject(page, projectName, projId) {
    const currentLang = await page
        .locator('[data-test="dropdown-lang"] [data-test="current-label"]')
        .textContent()

    logger.info('Wait for 30 sec and click on LPI logo')
    await page.locator('[data-test="lpi-logo"]').waitFor(30000)
    await page.locator('[data-test="lpi-logo"]').click()
    logger.info('Click to create project')
    await page.locator('[data-test="create-project"]').click()

    //add category
    if (organizationCode == 'CRI') {
        logger.info('Click to add category (the first of the list)')
        await page
            .locator('[data-test="select-project-category"] div')
            .filter({ hasText: 'Select' })
            .click()
        await page.locator('[data-test*=project-form]').first().click()
        logger.info('Category selected')
    }
    logger.info('Click to add title')
    // add title
    await page.locator('[data-test="title-input"]').click()
    await page.locator('[data-test="title-input"]').fill(projectName)
    logger.info('Title added')
    // add purpose
    logger.info('Click to add purpose')
    await page.locator('[data-test="purpose-input"]').click()
    await page.locator('[data-test="purpose-input"]').fill(projId)
    logger.info('Purpose added')
    // add tags
    logger.info('Click to add a tag')
    await page.locator('[data-test="tags"]').click()
    await page.locator('[data-test="search-input"]').click()
    // tags results depends on current language.....
    if (currentLang == 'FR') {
        logger.info('Search for test tag')
        await page.locator('[data-test="search-input"]').fill('test')
        await page.getByRole('main').getByText('Test', { exact: true }).click()
        logger.info('Add test tag')
        logger.info('Search for tag voiture')
        await page.locator('[data-test="search-input"]').fill('voiture')
        await page.getByText('Voiture électrique').click()
        logger.info('Add voiture éléctrique tag')
    } else {
        logger.info('Search for test cricket tag')
        await page.locator('[data-test="search-input"]').fill('test cricket')
        await page.getByRole('main').getByText('Test cricket', { exact: true }).click()
        logger.info('Add Test cricket tag')
        logger.info('Search for tag biology')
        await page.locator('[data-test="search-input"]').fill('biology')
        await page.getByText('Self-driving car', { exact: true }).click()
        logger.info('Add biology tag')
    }
    await page.locator('[data-test="confirm-button"]').click()
    logger.info('Tag added')

    // check random img
    logger.info('Click 3 times on random img')
    await page.locator('[data-test="random-image-button"]').click()
    await page.locator('[data-test="random-image-button"]').click()
    await page.locator('[data-test="random-image-button"]').click()
    logger.info('Random img checked')

    // check custom img
    logger.info('Click to add custom img')
    await page.locator('[data-test="upload-image-button"]').click()
    await page
        .locator('[data-test="upload-image-button"]')
        .setInputFiles('tests/playwright/fixtures/png/pinguinmoon.png')
    logger.info('Add custom img from local folder')

    await page.locator('[data-test="image-resizer-drawer"] [data-test="confirm-button"]').click()
    logger.info('Image resizer opened and closed')

    await page.locator('[data-test="project-create-button"]').click()
    logger.info('Custom image added')

    // check tabs
    logger.info('Wait 30 sec to see the project apears')
    logger.info('Check if tabs are clickable')
    await page.locator('[data-test="project-description"]').waitFor(30000)
    await page.locator('[data-test="project-description"]').click()
    await page.locator('[data-test="project-team"]').click()
    await page.locator('[data-test="project-comments"]').click()
    await page.locator('[data-test="project-settings"]').click()
    await page.locator('[data-test="project-summary"]').click()
    logger.info('Clickable tabs checked')

    // check text tabs
    logger.info('Check if tabs are visible')
    await expect(page.locator('[data-test="project-summary"]')).toBeVisible()
    await expect(page.locator('[data-test="project-description"]')).toBeVisible()
    await expect(page.locator('[data-test="project-team"]')).toBeVisible()
    await expect(page.locator('[data-test="project-comments"]')).toBeVisible()
    await expect(page.locator('[data-test="project-settings"]')).toBeVisible()
    logger.info('Tabs visible checked ')
}
