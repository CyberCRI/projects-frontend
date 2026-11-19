import checkAdminRights from '@/server/utils/check-admin-rights.js'

export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    await checkAdminRights(event)

    const body = await readBody(event)

    const skill = await chatbotPrisma.skill.create({
      data: {
        title: body.title,
        description: body.description,
        orgCode: appApiOrgCode,
        skillContents: {
          create: [{ content: body.content, version: 1 }],
        },
      },
    })
    return skill
  })
})
