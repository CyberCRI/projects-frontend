import type {
  SearchResultAll,
  SearchResultGroup,
  SearchResultProject,
  SearchResultUser,
} from '~/models/search.model'
import { projectSkeleton } from '~/skeletons/project.skeletons'
import { groupSkeleton } from '~/skeletons/group.skeletons'
import { userSkeleton } from '~/skeletons/user.skeletons'
import type { SearchObjectType } from '~/models/types'
import { shuffle } from 'es-toolkit'

export const searchUserSkeleton = (): SearchResultUser => {
  return {
    id: -1,
    last_update: new Date().toString(),
    type: 'user',
    people_group: null,
    project: null,
    user: userSkeleton({ description: '', short_description: '' }),
  }
}

export const searchGroupSkeleton = (): SearchResultGroup => {
  return {
    id: -1,
    last_update: new Date().toString(),
    type: 'people_group',
    people_group: groupSkeleton(),
    project: null,
    user: null,
  }
}

export const searchProjectSkeleton = (): SearchResultProject => {
  return {
    id: -1,
    last_update: new Date().toString(),
    type: 'project',
    people_group: null,
    project: projectSkeleton(),
    user: null,
  }
}

export const searchSkeleton = (): SearchResultAll => {
  const type = shuffle(['people_group', 'project', 'user'] as SearchObjectType[])
  switch (type[0]) {
    case 'people_group':
      return searchGroupSkeleton()
    case 'project':
      return searchProjectSkeleton()
    case 'user':
      return searchUserSkeleton()
  }
}
