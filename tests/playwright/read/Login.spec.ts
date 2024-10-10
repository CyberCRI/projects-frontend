import { test } from '@playwright/test'
import { users } from '../variables'
import { logIn, logOut } from '../lib'
import { LogLevel, Logger } from '../logger'

const logger = new Logger(LogLevel.Debug)

for (let i = 0; i < users.length; i++) {
    test(`test-${users[i].email}`, async ({ page }) => {
        await page.goto('/')
        logger.info(` LOGIN/LOGOUT TEST : ${users[i].email} `)
        try {
            await logIn(page, users[i])
            logger.info('Login successful')
        } catch (err) {
            logger.error('Login has failed')
            logger.error(err)
            throw err
        }
        try {
            await logOut(page)
            logger.info('Logout successful')
        } catch (err) {
            logger.error('Logout has failed')
            logger.error(err)
            throw err
        }
    })
}
