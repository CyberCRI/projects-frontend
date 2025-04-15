import { test } from '@playwright/test'
import { users } from '../variables'
import { LogLevel, Logger } from '../logger'
import { logIn, generalInfo, editBio, handleSkills } from '../lib'

const logger = new Logger(LogLevel.Debug)

for (const user of users) {
  test(`test-${user.email}`, async ({ page }) => {
    await page.goto('/')
    logger.info(` User edit ${user.email} `)
    //  await page.goto('/') // if needed replace with  await page.locator('[data-test="lpi-logo"]').click
    try {
      //  await page.goto('/') // if needed replace with  await page.locator('[data-test="lpi-logo"]').click
      await logIn(page, user)
      logger.info('Login successful')
    } catch (err) {
      logger.error('Login test has failed')
      logger.error(err)
      throw err
    }
    try {
      await generalInfo(page, user)
      logger.info('User general info successful')
    } catch (err) {
      logger.error('Edit general info has failed')
      logger.error(err)
      throw err
    }
    try {
      await editBio(page)
      logger.info('User Bio successful')
    } catch (err) {
      logger.error('Edit Bio has failed')
      logger.error(err)
      throw err
    }
    try {
      await handleSkills(page)
      logger.info('User skills successful')
    } catch (err) {
      logger.error('Edit skills has failed')
      logger.error(err)
      throw err
    }
  })
}
