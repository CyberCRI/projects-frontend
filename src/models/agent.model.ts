import type { Agent } from '~~/prisma-chatbot-db/generated/prisma/client'
import type { Translated } from 'shared-projects-frontend/interfaces'

export type AgentModel = Agent

export type TranslatedAgent = Translated<AgentModel, 'title' | 'description' | 'startMessage'>

export type AgentCreateInput = Required<AgentModel>

export type AgentPutInput = Required<AgentModel>

export type AgentPatchInput = Partial<AgentModel>

export type AgentOutput = Required<AgentModel>
