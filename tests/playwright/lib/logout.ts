import { LogLevel, Logger } from '../logger'

const logger = new Logger(LogLevel.Debug)
export async function logOut(page) {
    logger.info('Wait 20 sec')
    await page.locator('[data-test="dropdown-user-account"]').waitFor(20000)
    logger.info('Click on dropdown user account ')
    await page.locator('[data-test="dropdown-user-account"]').click()
    await page.locator('[data-test="disconnect"]').click()
    logger.info('Click to disconnect')
}
