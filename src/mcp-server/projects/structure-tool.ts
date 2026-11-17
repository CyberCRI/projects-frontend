import {
  getAllStructures,
  getStructure,
  getStructureChildren,
  getStructureSupervisingStructures,
  getStructureResearcherDomains,
  getStructureCollaborations,
  getStructureResearchers,
  getStructureCitations,
} from 'shared-projects-frontend/apis'
import type { Structure, StructureResearcher } from 'shared-projects-frontend/models'
import { buildQuery, domainMapPreview, PAGINATION_INPUT } from './utils'
import type { McpServer } from '@modelcontextprotocol/server'
import { mcpOptions, orgCode, resultFromTool } from './base'
import N from './zod-schema-utils'
import { pick } from 'es-toolkit'
import { z } from 'zod'

export const FETCH_STRUCTURE_ID =
  'The structure id is NOT the group id. It is the "structure.id" key of the people group payload returned by the people-group-data tool (use the search tool first to find the group slug or id if needed), or the "id" of a result of the structure-list tool (search it by name or acronym). The "structure" key is missing/null for regular groups: in that case there is no structure data and this tool must not be called.'

const STRUCTURE_ID = z
  .number()
  .describe('The structure id (the "structure.id" of the people group payload, NOT the group id)')

export const mapStructurePreview = (structure: Structure) => ({
  item_type: 'structure',
  link_url: `/structure/${structure.id}/`,
  ...pick(structure, [
    'id',
    'name',
    'acronym',
    'description',
    'generic_type',
    'main_mission',
    'national_type',
    'external',
    'modules',
  ]),
})

const mapStructureResearcher = (researcher: StructureResearcher) => ({
  item_type: 'structure_researcher',
  ...pick(researcher, [
    'id',
    'display_name',
    'short_bio',
    'h_index',
    'i10_index',
    'position_code',
    'position',
  ]),
  link_url: researcher.user ? `/profile/${researcher.user.slug}/` : null,
})

export default (server: McpServer) => {
  server.registerTool(
    'structure-list',
    {
      title: 'Structure list',
      description:
        'Search research structures (institutions, doctoral schools, units, teams...) by name, acronym, type or mission.',
      inputSchema: z.object({
        name: N.string().describe('Filter by structure name'),
        acronym: N.string().describe('Filter by structure acronym'),
        generic_type: N.array(
          z.enum([
            'institution',
            'institution_subdivision',
            'doctoral_school',
            'unit',
            'unit_subdivision',
            'team',
          ])
        ).describe('Filter by structure types'),
        main_mission: N.array(
          z.enum(['research', 'scientific_services', 'administrative_services', 'teaching'])
        ).describe('Filter by structure main missions'),
        researcher: N.number().describe(
          'Only structures of this researcher id (the "researcher.id" of the user payload, NOT the user id)'
        ),
        ...PAGINATION_INPUT,
      }),
    },
    resultFromTool((args, ctx) =>
      getAllStructures(orgCode, {
        ...mcpOptions(ctx),
        query: buildQuery({ ...args, modules: 'none' }),
      }).then((response) => response.results.map(mapStructurePreview))
    )
  )

  server.registerTool(
    'structure-data',
    {
      title: 'Structure data',
      description: `Get main general data about a research structure (lab, team, institution...) given its id. ${FETCH_STRUCTURE_ID}`,
      inputSchema: z.object({ structureId: STRUCTURE_ID }),
    },
    resultFromTool(({ structureId }, ctx) =>
      getStructure(orgCode, structureId, mcpOptions(ctx)).then(mapStructurePreview)
    )
  )

  server.registerTool(
    'structure-children',
    {
      title: 'Structure sub-structures',
      description: `Get the sub-structures (children) of a research structure. ${FETCH_STRUCTURE_ID}`,
      inputSchema: z.object({ structureId: STRUCTURE_ID, ...PAGINATION_INPUT }),
    },
    resultFromTool(({ structureId, ...args }, ctx) =>
      getStructureChildren(orgCode, structureId, {
        ...mcpOptions(ctx),
        query: buildQuery({ ...args, modules: 'none' }),
      }).then((response) => response.results.map(mapStructurePreview))
    )
  )

  server.registerTool(
    'structure-supervising-structures',
    {
      title: 'Structure supervising structures',
      description: `Get the structures supervising (parent / tutelage) a research structure. ${FETCH_STRUCTURE_ID}`,
      inputSchema: z.object({ structureId: STRUCTURE_ID, ...PAGINATION_INPUT }),
    },
    resultFromTool(({ structureId, ...args }, ctx) =>
      getStructureSupervisingStructures(orgCode, structureId, {
        ...mcpOptions(ctx),
        query: buildQuery({ ...args, modules: 'none' }),
      }).then((response) => response.results.map(mapStructurePreview))
    )
  )

  server.registerTool(
    'structure-research-domains',
    {
      title: 'Structure research domains',
      description: `Get the research domains of a research structure. ${FETCH_STRUCTURE_ID}`,
      inputSchema: z.object({ structureId: STRUCTURE_ID, ...PAGINATION_INPUT }),
    },
    resultFromTool(({ structureId, ...args }, ctx) =>
      getStructureResearcherDomains(orgCode, structureId, {
        ...mcpOptions(ctx),
        query: buildQuery(args),
      }).then((response) => response.results.map(domainMapPreview))
    )
  )

  server.registerTool(
    'structure-collaborations',
    {
      title: 'Structure collaborations',
      description: `Get the external organizations a research structure collaborates with. ${FETCH_STRUCTURE_ID}`,
      inputSchema: z.object({ structureId: STRUCTURE_ID, ...PAGINATION_INPUT }),
    },
    resultFromTool(({ structureId, ...args }, ctx) =>
      getStructureCollaborations(orgCode, structureId, {
        ...mcpOptions(ctx),
        query: buildQuery(args),
      }).then((response) => response.results)
    )
  )

  server.registerTool(
    'structure-researchers',
    {
      title: 'Structure researchers',
      description: `Get the researchers of a research structure with their position. The returned "id" is the researcher id usable with the researcher-* tools. ${FETCH_STRUCTURE_ID}`,
      inputSchema: z.object({
        structureId: STRUCTURE_ID,
        given_name: N.string().describe('Filter by researcher given name'),
        family_name: N.string().describe('Filter by researcher family name'),
        ...PAGINATION_INPUT,
      }),
    },
    resultFromTool(({ structureId, ...args }, ctx) =>
      getStructureResearchers(orgCode, structureId, {
        ...mcpOptions(ctx),
        query: buildQuery({ ...args, modules: 'none' }),
      }).then((response) => response.results.map(mapStructureResearcher))
    )
  )

  server.registerTool(
    'structure-citations',
    {
      title: 'Structure citations',
      description: `Get the journals in which the researchers of a research structure have published. ${FETCH_STRUCTURE_ID}`,
      inputSchema: z.object({
        structureId: STRUCTURE_ID,
        title: N.string().describe('Filter by journal title'),
        ...PAGINATION_INPUT,
      }),
    },
    resultFromTool(({ structureId, ...args }, ctx) =>
      getStructureCitations(orgCode, structureId, {
        ...mcpOptions(ctx),
        query: buildQuery(args),
      }).then((response) =>
        response.results.map((citation) => ({
          item_type: 'document_journal',
          ...pick(citation, ['id', 'pages', 'volume', 'issue']),
          journal: citation.journal && pick(citation.journal, ['id', 'title', 'acronym']),
          document:
            citation.document && pick(citation.document, ['id', 'title', 'publication_date']),
        }))
      )
    )
  )
}
