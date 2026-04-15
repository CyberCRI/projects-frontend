export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log(JSON.stringify(body, null, 2))

    const prompt = await chatbotPrisma.prompt.create({
      data: {
        title: body.title,
        orgCode: appApiOrgCode,
        promptContents: {
          create: [{ content: body.content, version: 1 }],
        },
      },
    })
    // console.log(prompt)
    return prompt
  })
})
