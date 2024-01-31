import { LogLevel, Logger } from '../../logger'
import { delay } from '../delay'

const logger = new Logger(LogLevel.Debug)
export async function logOut(page) {
    await page.locator('[data-test="lpi-logo"]').click()
    await delay(3000)
    await page.locator('[data-test="dropdown-user-account"]').click()
    logger.info('Click to disconnect')
    await page.locator('[data-test="disconnect"]').click()
    await delay(1000)
    logger.info('Disconnected')
}
