import type { ResearcherAward } from 'shared-projects-frontend/models'

export const awardSkeleton = (def?: Partial<ResearcherAward>): ResearcherAward => ({
  award: {
    id: -1,
    name: 'name',
    description: 'Ipsum nostrud offciia dolor esse execitation mollit',
  },
  description: 'Ipsum nostrud officia dolor esse exercitation mollit',
  date: '1970-01-01T00:00:00',
  link: 'http://dev.local',
  ...def,
})
