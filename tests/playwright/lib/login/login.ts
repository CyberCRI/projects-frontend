import type { User } from '../interfaces'
import { LogLevel, Logger } from '../../logger'

const logger = new Logger(LogLevel.Debug)

export async function logIn(page, user: User) {
    logger.info('Click on login button')
    await page.goto('/')
    await page.locator('[data-test="test-login-button"]').click()
    logger.info('Fill username or email')
    await page.locator('[data-test="username"]').fill(user.email)
    logger.info('Fill password')
    await page.locator('[data-test="password"]').fill(user.password)
    logger.info('Submit')
    await page.locator('[data-test="submit"]').click()
}