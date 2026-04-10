export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    const prompt = await chatbotPrisma.agent.findMany({
      where: {
        orgCode: appApiOrgCode,
      },
      include: {
        promptContent: { include: { prompt: true } },
        skillContents: { include: { skill: true } },
        mcps: true,
      },
    })
    // console.log(agent)
    return prompt
  })
})
