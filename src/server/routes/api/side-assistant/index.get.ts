export default defineLazyEventHandler(() => {
  const { appApiOrgCode } = useRuntimeConfig().public
  return defineEventHandler(async (_event) => {
    const sideAssistant = await chatbotPrisma.sideAssistant.findFirst({
      where: { orgCode: appApiOrgCode },
      include: {
        agent: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            startMessage: true,
            useProfileData: true,
            isEnabled: true,
          },
        },
      },
    })
    return sideAssistant
  })
})
