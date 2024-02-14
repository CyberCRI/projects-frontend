import { expect } from '@playwright/test'
import type { User } from '../interfaces'
import { LogLevel, Logger } from '../../logger'

const logger = new Logger(LogLevel.Debug)

export async function createUserFromInvitationLink(page, invitationLink: string, user: User) {
    await page.goto(invitationLink)
    logger.info('user creation from link')
    await page.locator('[data-test="first-name"]').click()
    await page.locator('[data-test="first-name"]').fill(user.firstName)
    await page.locator('[data-test="last-name"]').click()
    await page.locator('[data-test="last-name"]').fill(user.lastName)
    await page.locator('[data-test="email"]').fill(user.email)
    await page.locator('[data-test="password"]').fill(user.password)
    await page.locator('[data-test="password"]').fill(user.password)
    await page.locator('[data-test="password"]').click()
    await expect(page.locator('[data-test="register-confirm"]')).toBeVisible()
    logger.info('user created')
}
