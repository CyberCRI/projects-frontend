import type {
  ResearcherStructure,
  Structure,
  StructureDomain,
} from 'shared-projects-frontend/models'
import { tagSkeleton } from '~/skeletons/project.skeletons'

export const structureSkeleton = (def?: Partial<Structure>): Structure => ({
  acronym: 'INSERN',
  description: 'Ipsum nostrud officia dolor esse exercitation mollit',
  name: 'Ipsum nostrud officia',
  external: false,
  generic_type: 'institution',
  id: -1,
  identifiers: [],
  main_mission: 'administrative_services',
  modules: {
    citations: 0,
    collaborations: 0,
    conferences: 0,
    parent_structures: 0,
    publications: 0,
    domains: 0,
    researchers: 0,
    sub_structures: 0,
    supervised_structures: 0,
    supervising_structures: 0,
    awards: 0,
    teachings: 0,
  },
  national_type: '',
  organization: null,
  related_structures: null,
  people_group: null,
  researchers: [],
  ...(def || {}),
})

export const researcherStructuresSkeleton = (
  def?: Partial<ResearcherStructure>
): ResearcherStructure => ({
  id: -1,
  end_date: null,
  position_code: 'AHU',
  relation_type: 'employment',
  start_date: null,
  researcher: null,
  structure: structureSkeleton(),
  position: 'AUAUA',
  ...(def || {}),
})

export const domainSkeleton = (def?: Partial<StructureDomain>): StructureDomain => ({
  domain: tagSkeleton(),
  id: -1,
  level: 50,
  ...(def || {}),
})
