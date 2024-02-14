import { LogLevel, Logger } from '../../logger'
import { delay } from '../index'

const logger = new Logger(LogLevel.Debug)

export async function handleSkills(page) {
    logger.info('Edit Bio info')
    await page.locator('[data-test="dropdown-user-account"]').waitFor(20000)
    await page.locator('[data-test="dropdown-user-account"]').click()
    await page.locator('[data-test="my-profile"]').waitFor(20000)
    await page.locator('[data-test="my-profile"]').click()
    await page.locator('[data-test="edit-profile"]').waitFor(20000)
    await page.locator('[data-test="edit-profile"]').click()
    await page.locator('[data-test="skills"]').click()
    logger.info('Add Skills')
    const addSkillBtn = await page.locator('[data-test="add-skills-button"]')
    logger.info(await addSkillBtn.count())
    if ((await addSkillBtn.count()) > 0) {
        addSkillBtn.click()
        await addSkills(page, 'bio')
        await page.locator('[data-test="edit-skills-button"]').click()
        await editSkills(page)
    } else {
        await page.locator('[data-test="edit-skills-button"]').click()
        await editSkills(page)
        await page.locator('[data-test="add-skills-button"]')
        await addSkills(page, 'bio')
    }
    logger.info('Add Hobby')
    const addHobbyBtn = await page.locator('[data-test="add-hobbies-button"]')
    logger.info(await addHobbyBtn.count())
    if ((await addHobbyBtn.count()) > 0) {
        addHobbyBtn.click()
        await addSkills(page, 'test')
        await page.locator('[data-test="edit-hobbies-button"]').click()
    } else {
        await page.locator('[data-test="edit-hobbies-button"]').click()
        await editSkills(page)
        await page.locator('[data-test="add-hobbies-button]')
        await addSkills(page, 'test')
    }
}

async function addSkills(page, query) {
    await page.locator('[data-test="search-input"]').fill(query)
    await page.locator('[data-test="search-input"]').press('Enter')
    await delay(5000)
    const inputs = await page.locator('[data-test^="tag-label-"]').all()
    for (let i = 0; i < 5; i++) {
        await inputs[i].click()
    }
    // const addedTags = await page.locator('[data-test^="tag-label"]').all()
    // logger.info('Confirm Skills')
    // logger.info(addedTags.length)
    // for (const tag of addedTags) {
    //     tag.click();
    // }
    await page.locator('[data-test="confirm-button"]').click()
    await page.locator('[data-test="confirm-button"]').click()
}

async function editSkills(page) {
    await delay(5000)
    const addedTags = await page.locator('[data-test^="filter-value-"]').all()
    logger.info(addedTags)
    for (const tag of addedTags) {
        tag.getByRole('img').click()
    }
    // dont close yet because we're adding skills after that
    // await page.locator('[data-test="confirm-button"]').click()
}
