export async function destroyProject(page) {
    let settings = await page.locator('[data-test="project-settings"]')
    // button might be hidden in extra tabs dropdown
    if (!settings.count()) {
        await page.locator('[data-test="extra-tabs-button"]').click()
        settings = await page.locator('[data-test="project-settings"]')
    }
    await settings.click()
    await page.locator('[data-test="destroy-project"]').click()
    await page.locator('[data-test="confirm-destroy"]').click()
}
