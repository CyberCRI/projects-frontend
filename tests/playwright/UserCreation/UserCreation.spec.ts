import { logIn, createInvitaionLink } from '~~/tests/playwright/lib'
import { LogLevel, Logger } from '~~/tests/playwright/logger'
import { usersDict } from '~~/tests/playwright/variables'
import { test } from '@playwright/test'

const logger = new Logger(LogLevel.Debug)

test(`test-user-creation ${usersDict.admin.email}`, async ({ context }) => {
  const pageOne = await context.newPage()
  logger.info(` User creation test ${usersDict.admin.email}`)
  try {
    await pageOne.goto('/')
    await logIn(pageOne, usersDict.admin)
    logger.info('Login successful')
  } catch (err) {
    logger.error('Login has failed')
    logger.error(err)
    throw err
  }
  logger.info(`Get link ${usersDict.admin.email}`)
  await createInvitaionLink(pageOne)
})
