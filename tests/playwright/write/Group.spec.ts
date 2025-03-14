import { test } from '@playwright/test'
import { usersDict as users } from '../variables'
import { LogLevel, Logger } from '../logger'
import { delay } from '../lib/index'
import { logIn, logOut, createGroup, deleteGroup, setRights, testRights, makeId } from '../lib'

const logger = new Logger(LogLevel.Debug)
const groupName = makeId(5)

const rights = ['leader', 'manager', 'member']

test(`test-${users.admin.email}`, async ({ page }) => {
  await page.goto('/')
  logger.info(` Group Creation and managment : ${users.admin.email} `)
  logger.info(`the created group ${groupName}`)
  try {
    await logIn(page, users.admin)
    logger.info('Login successful')
  } catch (err) {
    logger.error('Login test has failed')
    logger.error(err)
    throw err
  }
  try {
    await createGroup(page, groupName)
    logger.info(`Group Created: "${groupName}"`)
  } catch (err) {
    logger.error('Group creation has failed')
    logger.error(err)
    throw err
  }

  for (const right of rights) {
    try {
      await logOut(page)
      await logIn(page, users.admin)
      await setRights(page, groupName, right)
      await logOut(page)
      logger.info(`Right "${right}" set to "${groupName}"`)
    } catch (err) {
      logger.error(`[FAIL]  :: Right "${right}" set to "${groupName}"`)
      logger.error(err)
      throw err
    }
    try {
      await logIn(page, users.playwright)
      await delay(5000)
      await testRights(page, groupName, right)
      logger.info(`Right "${right}" tested for "${groupName}"`)
    } catch (err) {
      logger.error(`[FAIL]  :: Right "${right}" tested for "${groupName}"`)
      logger.error(err)
      throw err
    }
  }

  try {
    await deleteGroup(page, groupName)
    logger.info(`Group Deleted: "${groupName}"`)
  } catch (err) {
    logger.error('Group deletion has failed')
    logger.error(err)
    throw err
  }
})
