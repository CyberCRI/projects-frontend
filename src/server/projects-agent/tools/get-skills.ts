import traceLangchain from '@/server/projects-agent/tracers/trace-langchain'
import { tool } from 'langchain'
import * as z from 'zod'

export default function getSkills(agentData) {
  const skillMap = {}
  agentData.skillContents.forEach((agentSkillContent) => {
    const skillContent = agentSkillContent.skillContent
    const skillTitle = skillContent.skill.title
    const skillSlug = skillTitle.replace(/\s+/gim, '_')
    skillMap[skillSlug] = {
      description: skillContent.skill.description,
      content: skillContent.content,
    }
  })

  const skillSystemPromptExtra = `
    You have access to ${agentData.skillContents.length} skills:
    ${Object.keys(skillMap).join(', ')}.
    Use load_skill tool to access them.`

  const loadSkill = tool(
    async ({ skillName }) => {
      traceLangchain(`Fetching skil ${skillName}`)
      // Load skill content from file/database
      return skillMap[skillName]?.content || ''
    },
    {
      name: 'load_skill',
      description: `Load a specialized skill.

  Available skills:
  ${Object.entries(skillMap)
    .map(([key, val]) => '- ' + key + ': ' + (val as any).description)
    .join('\n')}

  Returns the skill's prompt and context.`,
      schema: z.object({
        skillName: z.string().describe('Name of skill to load'),
      }),
    }
  )

  return { loadSkill, skillSystemPromptExtra }
}
