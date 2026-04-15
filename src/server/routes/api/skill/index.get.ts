export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (event) => {
    const skill = await chatbotPrisma.skill.findMany({
      where: {
        orgCode: appApiOrgCode,
      },
      include: { skillContents: { orderBy: { version: 'desc' } } },
      orderBy: { title: 'asc' },
    })
    // console.log(agent)
    return skill
  })
})
