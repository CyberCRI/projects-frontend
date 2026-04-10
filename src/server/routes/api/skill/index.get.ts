export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    const skill = await chatbotPrisma.agent.findMany({
      where: {
        orgCode: appApiOrgCode,
      },
      include: { skillContents: true },
    })
    // console.log(skill)
    return skill
  })
})
