import type { User } from './interfaces'
import { LogLevel, Logger } from '../logger'

const logger = new Logger(LogLevel.Debug)

export async function logIn(page, user: User) {
    await page.goto('/')
    await page.locator('[data-test="test-login-button"]').waitFor(30000)
    await page.locator('[data-test="test-login-button"]').click()
    logger.info('Click on login button')
    await page.locator('[data-test="username"]').click()
    await page.locator('[data-test="username"]').fill(user.email)
    logger.info('Fill username or email')
    await page.locator('[data-test="password"]').click()
    await page.locator('[data-test="password"]').fill(user.password)
    logger.info('Fill password')
    await page.locator('[data-test="submit"]').click()
}
