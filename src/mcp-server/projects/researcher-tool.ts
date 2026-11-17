import {
  getUserResearchDocument,
  getUserResearchDocumentAnalytics,
  getGroupResearchDocument,
  getGroupResearchDocumentAnalytics,
  getResearchDocumentSimilars,
  getResearchDocumentCitations,
  getResearcherAffiliated,
  getResearcherSimilars,
  getResearcherCitations,
  getResearcherAwards,
  getResearcherPatents,
  getResearcherFundings,
  getResearcherTeachings,
  getResearcherStructures,
} from 'shared-projects-frontend/apis'
import type {
  Researcher,
  ResearcherAward,
  ResearcherDocument,
  DocumentJournal,
  Patent,
  Funding,
  Teaching,
  ResearcherStructure,
} from 'shared-projects-frontend/models'
import { addIfExists, buildQuery, domainMapPreview, PAGINATION_INPUT } from './utils'
import type { McpServer } from '@modelcontextprotocol/server'
import { mcpOptions, orgCode, resultFromTool } from './base'
import { mapStructurePreview } from './structure-tool'
import { FETCH_GROUP_SLUG_OR_ID } from './user-tool'
import N from './zod-schema-utils'
import { pick } from 'es-toolkit'
import { z } from 'zod'

export const FETCH_RESEARCHER_ID =
  'The researcher id is NOT the user id. It is the "researcher.id" key of the user payload returned by the people-general-data tool (use the search tool first to find the user slug or id if needed). The "researcher" key is missing/null for regular users who are not researchers: in that case there is no researcher data and this tool must not be called.'

const FETCH_DOCUMENT_ID =
  'If you dont have the id of the document, get it from the "id" key of the results of the researcher-documents or group-documents tools. Note that contributor ids of documents are researcher ids, not user ids.'

const DOCUMENT_TYPE = z
  .enum(['publications', 'conferences'])
  .describe('The type of documents: publications or conferences')

const RESEARCHER_ID = z
  .number()
  .describe('The researcher id (the "researcher.id" of the user payload, NOT the user id)')
const DOCUMENT_ID = z.number().describe('The id of the research document')

const DATE_RANGE_INPUT = {
  date_after: N.string().describe('Only items after this date (ISO 8601)'),
  date_before: N.string().describe('Only items before this date (ISO 8601)'),
}

export const mapResearcher = (researcher: Researcher) => ({
  item_type: 'researcher',
  ...pick(researcher, ['id', 'display_name', 'short_bio', 'bio', 'h_index', 'i10_index']),
  link_url: researcher.user ? `/profile/${researcher.user.slug}/` : null,
  ...addIfExists('domains', researcher, (domains: Researcher['domains']) =>
    domains.map(domainMapPreview)
  ),
  ...addIfExists('user', researcher, (user: Researcher['user']) =>
    pick(user, ['id', 'slug', 'given_name', 'family_name'])
  ),
})

export const mapResearchDocument = (document: ResearcherDocument) => ({
  item_type: 'research_document',
  ...pick(document, ['id', 'title', 'description', 'document_type', 'publication_date']),
  contributors: (document.contributors || []).map((contributor) =>
    pick(contributor, ['id', 'display_name'])
  ),
  ...addIfExists('domains', document, (domains: ResearcherDocument['domains']) =>
    domains.map(domainMapPreview)
  ),
})

const mapJournalCitation = (citation: DocumentJournal) => ({
  item_type: 'document_journal',
  ...pick(citation, ['id', 'pages', 'volume', 'issue']),
  journal: citation.journal && pick(citation.journal, ['id', 'title', 'acronym']),
  document: citation.document && mapResearchDocument(citation.document),
})

const mapAward = (researcherAward: ResearcherAward) => ({
  item_type: 'researcher_award',
  ...pick(researcherAward, ['id', 'date', 'description', 'link']),
  award: researcherAward.award && pick(researcherAward.award, ['id', 'name', 'description']),
})

const mapPatent = (patent: Patent) => ({
  item_type: 'patent',
  ...pick(patent, ['id', 'name', 'description', 'date', 'link']),
})

const mapFunding = (funding: Funding) => ({
  item_type: 'funding',
  ...pick(funding, [
    'id',
    'name',
    'description',
    'prices',
    'currency',
    'start_date',
    'end_date',
    'project_id',
  ]),
})

const mapTeaching = (teaching: Teaching) => ({
  item_type: 'teaching',
  ...pick(teaching, ['id', 'name', 'description', 'spec', 'level', 'link']),
  ...addIfExists('domains', teaching, (domains: Teaching['domains']) =>
    domains.map(domainMapPreview)
  ),
})

const mapResearcherStructure = (relation: ResearcherStructure) => ({
  item_type: 'researcher_structure',
  ...pick(relation, ['id', 'start_date', 'end_date', 'relation_type', 'position_code', 'position']),
  structure: relation.structure && mapStructurePreview(relation.structure),
})

export default (server: McpServer) => {
  // ---- documents ----

  server.registerTool(
    'researcher-documents',
    {
      title: 'Researcher documents',
      description: `Get a paginated list of the research documents (publications or conferences) of a researcher. ${FETCH_RESEARCHER_ID}`,
      inputSchema: z.object({
        researcherId: RESEARCHER_ID,
        documentType: DOCUMENT_TYPE,
        year: N.number().describe('Only documents published this year'),
        ordering: z
          .enum(['publication_date', '-publication_date'])
          .optional()
          .nullable()
          .describe('Order by publication date (prefix with - for descending)'),
        ...PAGINATION_INPUT,
      }),
    },
    resultFromTool(({ researcherId, documentType, ...args }, ctx) =>
      getUserResearchDocument(orgCode, researcherId, documentType, {
        ...mcpOptions(ctx),
        query: buildQuery({ ...args, modules: 'none' }),
      }).then((response) => response.results.map(mapResearchDocument))
    )
  )

  server.registerTool(
    'researcher-documents-analytics',
    {
      title: 'Researcher documents analytics',
      description: `Get statistics (count by document type, by year and by role of the researcher) about the publications or conferences of a researcher. ${FETCH_RESEARCHER_ID}`,
      inputSchema: z.object({
        researcherId: RESEARCHER_ID,
        documentType: DOCUMENT_TYPE,
      }),
    },
    resultFromTool(({ researcherId, documentType }, ctx) =>
      getUserResearchDocumentAnalytics(orgCode, researcherId, documentType, mcpOptions(ctx))
    )
  )

  server.registerTool(
    'group-documents',
    {
      title: 'People group documents',
      description: `Get a paginated list of the research documents (publications or conferences) of all the researchers of a people group. ${FETCH_GROUP_SLUG_OR_ID}`,
      inputSchema: z.object({
        idOrSlug: z.string().describe('The id or slug of the people group'),
        documentType: DOCUMENT_TYPE,
        year: N.number().describe('Only documents published this year'),
        ...PAGINATION_INPUT,
      }),
    },
    resultFromTool(({ idOrSlug, documentType, ...args }, ctx) =>
      getGroupResearchDocument(orgCode, idOrSlug, documentType, {
        ...mcpOptions(ctx),
        query: buildQuery({ ...args, modules: 'none' }),
      }).then((response) => response.results.map(mapResearchDocument))
    )
  )

  server.registerTool(
    'group-documents-analytics',
    {
      title: 'People group documents analytics',
      description: `Get statistics (count by document type, by year and by role) about the publications or conferences of the researchers of a people group. ${FETCH_GROUP_SLUG_OR_ID}`,
      inputSchema: z.object({
        idOrSlug: z.string().describe('The id or slug of the people group'),
        documentType: DOCUMENT_TYPE,
      }),
    },
    resultFromTool(({ idOrSlug, documentType }, ctx) =>
      getGroupResearchDocumentAnalytics(orgCode, idOrSlug, documentType, mcpOptions(ctx))
    )
  )

  server.registerTool(
    'research-document-similars',
    {
      title: 'Similar research documents',
      description: `Get research documents similar to a given research document. ${FETCH_DOCUMENT_ID}`,
      inputSchema: z.object({ documentId: DOCUMENT_ID, ...PAGINATION_INPUT }),
    },
    resultFromTool(({ documentId, ...args }, ctx) =>
      getResearchDocumentSimilars(orgCode, documentId, {
        ...mcpOptions(ctx),
        query: buildQuery(args),
      }).then((response) => response.results.map(mapResearchDocument))
    )
  )

  server.registerTool(
    'research-document-citations',
    {
      title: 'Research document citations',
      description: `Get the journals in which a research document has been cited / published. ${FETCH_DOCUMENT_ID}`,
      inputSchema: z.object({ documentId: DOCUMENT_ID, ...PAGINATION_INPUT }),
    },
    resultFromTool(({ documentId, ...args }, ctx) =>
      getResearchDocumentCitations(orgCode, documentId, {
        ...mcpOptions(ctx),
        query: buildQuery(args),
      }).then((response) => response.results.map(mapJournalCitation))
    )
  )

  // ---- researcher relations ----

  server.registerTool(
    'researcher-affiliated',
    {
      title: 'Researcher affiliated researchers',
      description: `Get the researchers affiliated to (working with) a researcher. ${FETCH_RESEARCHER_ID}`,
      inputSchema: z.object({ researcherId: RESEARCHER_ID, ...PAGINATION_INPUT }),
    },
    resultFromTool(({ researcherId, ...args }, ctx) =>
      getResearcherAffiliated(orgCode, researcherId, {
        ...mcpOptions(ctx),
        query: buildQuery(args),
      }).then((response) => response.results.map(mapResearcher))
    )
  )

  server.registerTool(
    'researcher-similars',
    {
      title: 'Similar researchers',
      description: `Get researchers with research interests similar to a researcher. ${FETCH_RESEARCHER_ID}`,
      inputSchema: z.object({ researcherId: RESEARCHER_ID, ...PAGINATION_INPUT }),
    },
    resultFromTool(({ researcherId, ...args }, ctx) =>
      getResearcherSimilars(orgCode, researcherId, {
        ...mcpOptions(ctx),
        query: buildQuery(args),
      }).then((response) => response.results.map(mapResearcher))
    )
  )

  server.registerTool(
    'researcher-citations',
    {
      title: 'Researcher citations',
      description: `Get the journals in which a researcher has published / been cited. ${FETCH_RESEARCHER_ID}`,
      inputSchema: z.object({ researcherId: RESEARCHER_ID, ...PAGINATION_INPUT }),
    },
    resultFromTool(({ researcherId, ...args }, ctx) =>
      getResearcherCitations(orgCode, researcherId, {
        ...mcpOptions(ctx),
        query: buildQuery(args),
      }).then((response) => response.results.map(mapJournalCitation))
    )
  )

  server.registerTool(
    'researcher-structures',
    {
      title: 'Researcher structures',
      description: `Get the research structures (labs, teams, institutions...) a researcher belongs to, with the position and relation type. ${FETCH_RESEARCHER_ID}`,
      inputSchema: z.object({
        researcherId: RESEARCHER_ID,
        structure: N.number().describe('Only the relation with this structure id'),
        ...PAGINATION_INPUT,
      }),
    },
    resultFromTool(({ researcherId, ...args }, ctx) =>
      getResearcherStructures(orgCode, researcherId, {
        ...mcpOptions(ctx),
        query: buildQuery(args),
      }).then((response) => response.results.map(mapResearcherStructure))
    )
  )

  // ---- awards, patents, fundings, teachings ----

  server.registerTool(
    'researcher-awards',
    {
      title: 'Researcher awards',
      description: `Get the awards of a researcher. ${FETCH_RESEARCHER_ID}`,
      inputSchema: z.object({
        researcherId: RESEARCHER_ID,
        name: N.string().describe('Filter by award name'),
        ...DATE_RANGE_INPUT,
        ...PAGINATION_INPUT,
      }),
    },
    resultFromTool(({ researcherId, ...args }, ctx) =>
      getResearcherAwards(orgCode, researcherId, {
        ...mcpOptions(ctx),
        query: buildQuery(args),
      }).then((response) => response.results.map(mapAward))
    )
  )

  server.registerTool(
    'researcher-patents',
    {
      title: 'Researcher patents',
      description: `Get the patents of a researcher. ${FETCH_RESEARCHER_ID}`,
      inputSchema: z.object({
        researcherId: RESEARCHER_ID,
        name: N.string().describe('Filter by patent name'),
        ...DATE_RANGE_INPUT,
        ...PAGINATION_INPUT,
      }),
    },
    resultFromTool(({ researcherId, ...args }, ctx) =>
      getResearcherPatents(orgCode, researcherId, {
        ...mcpOptions(ctx),
        query: buildQuery(args),
      }).then((response) => response.results.map(mapPatent))
    )
  )

  server.registerTool(
    'researcher-fundings',
    {
      title: 'Researcher fundings',
      description: `Get the fundings (grants, funded projects) of a researcher. ${FETCH_RESEARCHER_ID}`,
      inputSchema: z.object({
        researcherId: RESEARCHER_ID,
        name: N.string().describe('Filter by funding name'),
        start_date_after: N.string().describe('Only fundings starting after this date'),
        end_date_before: N.string().describe('Only fundings ending before this date'),
        ...PAGINATION_INPUT,
      }),
    },
    resultFromTool(({ researcherId, ...args }, ctx) =>
      getResearcherFundings(orgCode, researcherId, {
        ...mcpOptions(ctx),
        query: buildQuery(args),
      }).then((response) => response.results.map(mapFunding))
    )
  )

  server.registerTool(
    'researcher-teachings',
    {
      title: 'Researcher teachings',
      description: `Get the teachings (courses) of a researcher. ${FETCH_RESEARCHER_ID}`,
      inputSchema: z.object({
        researcherId: RESEARCHER_ID,
        name: N.string().describe('Filter by teaching name'),
        level: N.string().describe('Filter by teaching level'),
        ...PAGINATION_INPUT,
      }),
    },
    resultFromTool(({ researcherId, ...args }, ctx) =>
      getResearcherTeachings(orgCode, researcherId, {
        ...mcpOptions(ctx),
        query: buildQuery(args),
      }).then((response) => response.results.map(mapTeaching))
    )
  )
}
