import { LogLevel, Logger } from '../../logger'
import { delay } from '../index'

const logger = new Logger(LogLevel.Debug)

export async function handleSkills(page) {
    logger.info('Edit Skill info')
    await page.locator('[data-test="dropdown-user-account"]').waitFor(20000)
    await page.locator('[data-test="dropdown-user-account"]').click()
    await page.locator('[data-test="my-profile"]').waitFor(20000)
    await page.locator('[data-test="my-profile"]').click()
    await page.locator('[data-test="edit-profile"]').waitFor(20000)
    await page.locator('[data-test="edit-profile"]').click()
    await page.locator('[data-test="skills"]').click()
    logger.info('Add Skills')
    let addSkillBtn = await page.locator('[data-test="initial-add-skills-button"]')
    logger.info(await addSkillBtn.count())
    if ((await addSkillBtn.count()) == 0) {
        await removeSkills(page, 'skills')
        addSkillBtn = await page.locator('[data-test="initial-add-skills-button"]')
    }
    addSkillBtn.click()
    await addSkills(page, 'skills', 'bio')
    await delay(1000)
    await page.locator('[data-test="add-skills-button"]').click()
    await addSkills(page, 'skills', 'bio')
    await delay(1000)
    //await removeSkills(page, 'skills')

    logger.info('Add Hobby')
    let addHobbyBtn = await page.locator('[data-test="initial-add-hobbies-button"]')
    logger.info(await addHobbyBtn.count())
    if ((await addHobbyBtn.count()) == 0) {
        await removeSkills(page, 'hobbies')
        addHobbyBtn = await page.locator('[data-test="initial-add-hobbies-button"]')
    }
    addHobbyBtn.click()
    await addSkills(page, 'hobbies', 'test')
    await delay(1000)
    await page.locator('[data-test="add-hobbies-button"]').click()
    await addSkills(page, 'hobbies', 'test')
    await delay(1000)
    // await removeSkills(page, 'hobbies')
}

async function addSkills(page, _type, query) {
    await page.locator('[data-test="search-input"]').fill(query)
    await page.locator('[data-test="search-input"]').press('Enter')
    await delay(5000)
    await page.locator('[data-test^="tag-label-"]:not(.disabled)').first().click()
    await page.locator('[data-test="confirm-button"]').click()
}

async function removeSkills(page, type) {
    // remove all skills
    const addedTags = await page.locator(`[data-test^="${type}-editor-"]`).all()
    logger.info(addedTags)
    for (const tag of addedTags) {
        await tag.locator(`[data-test^="delete-${type}-"]`).click()
        await page.locator(`.modal [data-test="confirm-destroy"]`).click()
        await delay(1000)
    }
    // dont finnish yet because we're adding skills after that and nned all skill to be removed
    await delay(5000)
}
