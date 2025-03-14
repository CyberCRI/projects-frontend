import { test } from '@playwright/test'
import { users } from '../variables'
import { LogLevel, Logger } from '../logger'

import {
  logIn,
  logOut,
  destroyProject,
  createProject,
  addDescription,
  editDescription,
  makeId,
} from '../lib'

const logger = new Logger(LogLevel.Debug)
const projId = makeId(5)
for (let i = 0; i < users.length; i++) {
  test(`test-${users[i].email}`, async ({ page }) => {
    logger.info(` ADD/EDIT DESCRIPTION TEST : ${users[i].email} `)
    try {
      await page.goto('/')
      await logIn(page, users[i])
      logger.info('Login successful')
    } catch (err) {
      logger.error('Login has failed')
      logger.error(err)
      throw err
    }
    try {
      await createProject(page, `addDescriptionProject_${i}`, projId)
      logger.info(`addDescriptionProject_${i} Project created`)
    } catch (err) {
      logger.error('Project creation has failed')
      logger.error(err)
      throw err
    }
    try {
      await addDescription(page)
      logger.info('Description added')
    } catch (err) {
      logger.error('Add description has failed')
      logger.error(err)
      throw err
    }
    try {
      await editDescription(page)
      logger.info('Description edited')
    } catch (err) {
      logger.error('Edit description has failed')
      logger.error(err)
      throw err
    }
    try {
      await destroyProject(page)
      logger.info(`addDescriptionProject_${i} Project destroyed`)
    } catch (err) {
      logger.error('Project deletion has failed')
      logger.error(err)
      throw err
    }
  })
}
