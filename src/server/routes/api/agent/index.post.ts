export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    const body = await readBody(event)
    console.log(JSON.stringify(body, null, 2))
    const agent = await chatbotPrisma.agent.create({
      data: { ...body, orgCode: appApiOrgCode },
    })
    // console.log(agent)
    return agent
  })
})
