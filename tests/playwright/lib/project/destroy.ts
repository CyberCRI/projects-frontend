export async function destroyProject(page) {
    await page.locator('[data-test="project-settings"]').click()
    await page.locator('[data-test="destroy-project"]').click()
    await page.locator('[data-test="confirm-destroy"]').click()
}
