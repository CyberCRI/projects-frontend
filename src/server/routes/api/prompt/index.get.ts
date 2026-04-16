export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    const prompt = await chatbotPrisma.prompt.findMany({
      where: {
        orgCode: appApiOrgCode,
      },
      include: { promptContents: { include: { agents: true }, orderBy: { version: 'desc' } } },
      orderBy: { title: 'asc' },
    })
    // console.log(agent)
    return prompt
  })
})
