const runtimeConfig = useRuntimeConfig()
const { appApiOrgCode } = runtimeConfig.public

export default function getMetadata(agentData, user) {
  const customMetadata = {
    agent_id: agentData.id,
    // keycloack_id: user.keycloack_id,
    user_id: user.id,
    organization_code: appApiOrgCode,
  }
  return customMetadata
}
