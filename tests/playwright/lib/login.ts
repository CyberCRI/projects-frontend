import type { User } from './interfaces'
import { LogLevel, Logger } from '../logger'

const logger = new Logger(LogLevel.Debug)

export async function logIn(page, user: User) {
    await page.goto('/')
    await page.locator('[data-test="test-login-button"]').click()
    logger.info('Click on login button')
    await page.getByLabel('Username or email').click()
    await page.getByLabel('Username or email').fill(user.email)
    logger.info('Fill username or email')
    await page.getByLabel('Password').click()
    await page.getByLabel('Password').fill(user.password)
    logger.info('Fill password')
    await page.getByRole('button', { name: 'Sign In' }).click()
}
