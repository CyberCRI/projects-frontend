export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    const prompt = await chatbotPrisma.prompt.findMany({
      where: {
        orgCode: appApiOrgCode,
      },
      include: { promptContents: true },
    })
    // console.log(agent)
    return prompt
  })
})
