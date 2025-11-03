import { test } from '@playwright/test'
import { usersDict } from '../playwright/variables'
import { logIn } from '../playwright/lib'
import { LogLevel, Logger } from '../playwright/logger'
import { expect } from 'chai'

const groupId = 'clubs'
const categoryId = 'learning-planet-institute'
const instructionId = '50'
const newsId = '57'
const userId = 'playwright-test'
const projectId = 'lpi-projects'
const token = 'abcdef'

// in app.vue,
// console.log(router.getRoutes().map((r) => r.path).sort())
// then regexes applied:
// /"/g --> `
// /:([a-zA-Z]+\??)/g --> ${$1}
// and cleanup variable names

const startedAt = Date.now()
console.log(`Landing tests started at ${new Date(startedAt).toISOString()}`)

const allUrls: Record<string, { logged: boolean; admin: boolean }> = {
  [`/`]: { logged: false, admin: false },
  //[`/${pathMatch}(.*)*`]: {logged: false, admin: false},
  [`/accessibility`]: { logged: false, admin: false },
  [`/admin`]: { logged: true, admin: true },
  [`/admin/accounts`]: { logged: true, admin: true },
  [`/admin/categories`]: { logged: true, admin: true },
  [`/admin/faq`]: { logged: true, admin: true },
  [`/admin/general`]: { logged: true, admin: true },
  [`/admin/groups`]: { logged: true, admin: true },
  [`/admin/groups/create`]: { logged: true, admin: true },
  [`/admin/groups/edit/${groupId}`]: { logged: true, admin: true },
  [`/admin/groups/list`]: { logged: true, admin: true },
  [`/admin/links`]: { logged: true, admin: true },
  [`/admin/links/create`]: { logged: true, admin: true },
  [`/admin/links/list`]: { logged: true, admin: true },
  [`/admin/requests`]: { logged: true, admin: true },
  [`/admin/settings`]: { logged: true, admin: true },
  [`/admin/skills`]: { logged: true, admin: true },
  [`/admin/tags`]: { logged: true, admin: true },
  [`/admin/templates`]: { logged: true, admin: true },
  [`/announcements`]: { logged: false, admin: false },
  [`/calendar`]: { logged: false, admin: false },
  [`/calendar/future`]: { logged: false, admin: false },
  [`/calendar/past`]: { logged: false, admin: false },
  [`/categories/`]: { logged: false, admin: false },
  [`/category/${categoryId}`]: { logged: false, admin: false },
  [`/cookies`]: { logged: false, admin: false },
  [`/create-event`]: { logged: true, admin: true },
  [`/create-group`]: { logged: true, admin: true },
  [`/create-instruction`]: { logged: true, admin: true },
  [`/create-news`]: { logged: true, admin: true },
  [`/create-project`]: { logged: true, admin: false },
  [`/dashboard`]: { logged: false, admin: false },
  //   [`/debug`]: {logged: false, admin: false},
  //   [`/debug/icons`]: {logged: false, admin: false},
  //   [`/debug/onboarding`]: {logged: false, admin: false},
  [`/documents`]: { logged: false, admin: false },
  [`/group/${groupId}`]: { logged: false, admin: false },
  [`/group/${groupId}/Edit`]: { logged: true, admin: true },
  [`/group/${groupId}/members`]: { logged: false, admin: false },
  [`/group/${groupId}/members/edit`]: { logged: true, admin: true },
  [`/group/${groupId}/projects`]: { logged: false, admin: false },
  [`/group/${groupId}/projects/edit`]: { logged: true, admin: true },
  [`/group/${groupId}/snapshot`]: { logged: false, admin: false },
  [`/group/${groupId}/snapshot/edit`]: { logged: true, admin: true },
  [`/groups/`]: { logged: false, admin: false },
  [`/groups/${groupId}`]: { logged: false, admin: false },
  [`/help`]: { logged: false, admin: false },
  [`/help/faq`]: { logged: false, admin: false },
  [`/help/help`]: { logged: false, admin: false },
  [`/help/tutorials`]: { logged: false, admin: false },
  [`/instructions`]: { logged: true, admin: false },
  [`/instructions/${instructionId}`]: { logged: true, admin: false },
  [`/legal-notices`]: { logged: false, admin: false },
  [`/login`]: { logged: false, admin: false },
  [`/map`]: { logged: false, admin: false },
  [`/me`]: { logged: true, admin: false },
  // [`/me/*`]: { logged: false, admin: false },
  [`/mentorship/respond/${token}`]: { logged: true, admin: false },
  [`/news`]: { logged: false, admin: false },
  [`/news/${newsId}`]: { logged: false, admin: false },
  [`/newsfeed`]: { logged: false, admin: false },
  [`/notifications-settings`]: { logged: true, admin: false },
  [`/people/`]: { logged: false, admin: false },
  [`/personal-data`]: { logged: false, admin: false },
  [`/plan-de-continuite-d-action`]: { logged: false, admin: false },
  [`/plan-de-securite-des-systemes-d-information`]: { logged: false, admin: false },
  [`/portal`]: { logged: false, admin: false },
  [`/profile`]: { logged: true, admin: false },
  [`/profile/${userId}`]: { logged: false, admin: false },
  [`/profile/${userId}/bio`]: { logged: false, admin: false },
  [`/profile/${userId}/bio/edit`]: { logged: false, admin: false },
  [`/profile/${userId}/general/edit`]: { logged: false, admin: false },
  [`/profile/${userId}/groups`]: { logged: false, admin: false },
  [`/profile/${userId}/groups/edit`]: { logged: false, admin: false },
  [`/profile/${userId}/privacy/edit`]: { logged: false, admin: false },
  [`/profile/${userId}/projects`]: { logged: false, admin: false },
  [`/profile/${userId}/projects/edit`]: { logged: false, admin: false },
  [`/profile/${userId}/skills`]: { logged: false, admin: false },
  [`/profile/${userId}/skills/edit`]: { logged: false, admin: false },
  [`/profile/${userId}/summary`]: { logged: false, admin: false },
  [`/profile/bio`]: { logged: true, admin: false },
  [`/profile/bio/edit`]: { logged: true, admin: false },
  [`/profile/edit`]: { logged: true, admin: false },
  [`/profile/edit/${userId}`]: { logged: true, admin: false },
  [`/profile/edit/${userId}/bio`]: { logged: true, admin: false },
  [`/profile/edit/${userId}/general`]: { logged: true, admin: false },
  [`/profile/edit/${userId}/groups`]: { logged: true, admin: false },
  [`/profile/edit/${userId}/privacy`]: { logged: true, admin: false },
  [`/profile/edit/${userId}/projects`]: { logged: true, admin: false },
  [`/profile/edit/${userId}/skills`]: { logged: true, admin: false },
  [`/profile/edit/bio`]: { logged: true, admin: false },
  [`/profile/edit/general`]: { logged: true, admin: false },
  [`/profile/edit/groups`]: { logged: true, admin: false },
  [`/profile/edit/privacy`]: { logged: true, admin: false },
  [`/profile/edit/projects`]: { logged: true, admin: false },
  [`/profile/edit/skills`]: { logged: true, admin: false },
  [`/profile/general/edit`]: { logged: true, admin: false },
  [`/profile/groups`]: { logged: false, admin: false },
  [`/profile/groups/edit`]: { logged: true, admin: false },
  [`/profile/privacy/edit`]: { logged: true, admin: false },
  [`/profile/projects`]: { logged: false, admin: false },
  [`/profile/projects/edit`]: { logged: true, admin: false },
  [`/profile/skills`]: { logged: false, admin: false },
  [`/profile/skills/edit`]: { logged: true, admin: false },
  [`/profile/summary`]: { logged: false, admin: false },
  [`/projects/${projectId}`]: { logged: false, admin: false },
  [`/projects/${projectId}/announcements`]: { logged: false, admin: false },
  [`/projects/${projectId}/announcements/edit`]: { logged: true, admin: false },
  [`/projects/${projectId}/blog-entries`]: { logged: false, admin: false },
  [`/projects/${projectId}/blog-entries/edit`]: { logged: true, admin: false },
  [`/projects/${projectId}/blogentries`]: { logged: false, admin: false },
  [`/projects/${projectId}/comments`]: { logged: false, admin: false },
  [`/projects/${projectId}/comments/edit`]: { logged: true, admin: false },
  [`/projects/${projectId}/des`]: { logged: false, admin: false },
  [`/projects/${projectId}/description`]: { logged: false, admin: false },
  [`/projects/${projectId}/description/edit`]: { logged: true, admin: false },
  [`/projects/${projectId}/goals`]: { logged: false, admin: false },
  [`/projects/${projectId}/goals/edit`]: { logged: true, admin: false },
  [`/projects/${projectId}/linked-projects`]: { logged: false, admin: false },
  [`/projects/${projectId}/linked-projects/edit`]: { logged: true, admin: false },
  [`/projects/${projectId}/locations`]: { logged: false, admin: false },
  [`/projects/${projectId}/locations/edit`]: { logged: true, admin: false },
  [`/projects/${projectId}/private-exchange`]: { logged: false, admin: false },
  [`/projects/${projectId}/private-exchange/edit`]: { logged: true, admin: false },
  [`/projects/${projectId}/project-settings`]: { logged: false, admin: false },
  [`/projects/${projectId}/project-settings/edit`]: { logged: true, admin: false },
  [`/projects/${projectId}/resources`]: { logged: false, admin: false },
  [`/projects/${projectId}/resources/edit`]: { logged: true, admin: false },
  [`/projects/${projectId}/ressources`]: { logged: false, admin: false },
  [`/projects/${projectId}/summary`]: { logged: false, admin: false },
  [`/projects/${projectId}/summary/edit`]: { logged: true, admin: false },
  [`/projects/${projectId}/team`]: { logged: false, admin: false },
  [`/projects/${projectId}/team/edit`]: { logged: true, admin: false },
  [`/recommendations/people`]: { logged: false, admin: false },
  [`/recommendations/projects`]: { logged: false, admin: false },
  [`/register/${token}`]: { logged: false, admin: false },
  [`/request-access`]: { logged: false, admin: false },
  [`/search`]: { logged: false, admin: false },
  [`/search/global`]: { logged: false, admin: false },
  [`/search/groups`]: { logged: false, admin: false },
  [`/search/people`]: { logged: false, admin: false },
  [`/search/projects`]: { logged: false, admin: false },
  [`/stats`]: { logged: true, admin: true },
  [`/terms-of-service`]: { logged: false, admin: false },
  [`/tos`]: { logged: false, admin: false },
}

const logger = new Logger(LogLevel.Debug)

const testPageLanding = async (context, url: string) => {
  const pageOne = await context.newPage()
  logger.info(`Navigating to ${url}`)
  try {
    const response = await pageOne.goto(url)
    // test status code 200
    expect(response.status()).to.be.within(200, 299)
    // /login redirects to keycloak, cannot test app load there
    if (url !== '/login') {
      // test app is mounted
      const app = await pageOne.locator('#APP')
      // wait for app to be visible
      await app.waitFor({ state: 'visible', timeout: 60000 })
      const appCount = await app.count()
      expect(appCount).to.equal(1)
      logger.info(`Successfully landed on ${url}`)
    }
  } catch (err) {
    logger.error(`Failed to land on ${url}`)
    logger.error(err)
    throw err
  }
  pageOne.close()
}

test.describe(`landing on pages as anonymous user`, () => {
  test.beforeAll(async ({ browser }) => {
    /*const pageOne = */ await browser.newPage()
    logger.info(`As anonymous user`)
  })
  for (const [url, options] of Object.entries(allUrls)) {
    if (options.logged || options.admin) continue
    test(`Landing on ${url} as anonymous`, async ({ context }) => {
      await testPageLanding(context, url)
    })
  }
  test.afterAll(async () => {
    const finishedAt = Date.now()
    console.log(`Anonymous landing tests finished at ${new Date(finishedAt).toISOString()}`)
    const duration = finishedAt - startedAt
    console.log(`Anonymous landing tests duration: ${(duration / 1000).toFixed(2)} seconds`)
  })
})

test.describe(`landing on pages as regular user`, () => {
  test.beforeAll(async ({ browser }) => {
    const pageOne = await browser.newPage()
    logger.info(` User sign in as ${usersDict.playwright.email}`)
    try {
      await pageOne.goto('/')
      await logIn(pageOne, usersDict.playwright)
      logger.info('Login successful')
    } catch (err) {
      logger.error('Login has failed')
      logger.error(err)
      throw err
    }
  })
  for (const [url, options] of Object.entries(allUrls)) {
    if (options.admin) continue
    test(`Landing on ${url} as signed in user`, async ({ context }) => {
      await testPageLanding(context, url)
    })
  }
  test.afterAll(async () => {
    const finishedAt = Date.now()
    console.log(`Signedin landing tests finished at ${new Date(finishedAt).toISOString()}`)
    const duration = finishedAt - startedAt
    console.log(`Signedin landing tests duration: ${(duration / 1000).toFixed(2)} seconds`)
  })
})

test.describe(`landing on pages as admin`, () => {
  test.beforeAll(async ({ browser }) => {
    const pageOne = await browser.newPage()
    logger.info(` User sign in as ${usersDict.admin.email}`)
    try {
      await pageOne.goto('/')
      await logIn(pageOne, usersDict.admin)
      logger.info('Login successful')
    } catch (err) {
      logger.error('Login has failed')
      logger.error(err)
      throw err
    }
  })
  for (const url of Object.keys(allUrls)) {
    test(`Landing on ${url} as admin`, async ({ context }) => {
      await testPageLanding(context, url)
    })
  }
  test.afterAll(async () => {
    const finishedAt = Date.now()
    console.log(`Admin landing tests finished at ${new Date(finishedAt).toISOString()}`)
    const duration = finishedAt - startedAt
    console.log(`Admin landing tests duration: ${(duration / 1000).toFixed(2)} seconds`)
  })
})
