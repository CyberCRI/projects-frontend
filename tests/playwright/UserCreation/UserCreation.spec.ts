import { test } from '@playwright/test'
import { usersDict } from '../variables'
import { logIn, createInvitaionLink } from '../lib'
import { LogLevel, Logger } from '../logger'

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
