import { LogLevel, Logger } from '../../logger'

const logger = new Logger(LogLevel.Debug)
export async function findProject(page, projectName) {
    logger.info('Click on dropdowm menu')
    await page.locator('[data-test="user-dropdown-menu"]').click()
    await page.getByRole('banner').locator('[data-test="my-profile"]').click()
    logger.info('Click on the first project on profile')
    await page.getByRole('link', { name: projectName }).first().click()
}
