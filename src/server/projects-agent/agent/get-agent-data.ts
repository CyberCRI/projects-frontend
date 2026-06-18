const runtimeConfig = useRuntimeConfig()
const { appApiOrgCode } = runtimeConfig.public

export default async function getAgentData(id) {
  const agentData = await chatbotPrisma.agent.findUnique({
    where: {
      id: id,
      orgCode: appApiOrgCode,
    },
    include: {
      promptContent: {
        include: { prompt: true },
      },
      skillContents: { include: { skillContent: { include: { skill: true } } } },
      documents: true,
      mcps: true,
    },
  })
  return agentData
}
