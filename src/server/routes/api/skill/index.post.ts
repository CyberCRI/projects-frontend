export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log(JSON.stringify(body, null, 2))

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
    // console.log(prompt)
    return skill
  })
})
