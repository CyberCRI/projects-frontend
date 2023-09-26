import peopleStore from '@/store/modules/people'
import { searchPeopleProject } from '@/api/people.service'

import PeopleFactory from '../../factories/people.factory'

import { afterEach, beforeEach, describe, expect, it, vi, Mock } from 'vitest'
vi.mock('@/api/people.service')

vi.mock('vuex')
describe('Store module | people | actions', () => {
    const commit = vi.fn()

    it('searchPeopleProject', async () => {
        const people = PeopleFactory.generateMany(2)
        const search = 'test'
        const org_id = 1
        const param = null
        const searchPeopleMock = searchPeopleProject as Mock

        searchPeopleMock.mockResolvedValue(people)

        const result = await peopleStore.actions.searchPeopleProject(
            { commit },
            { search, org_id, param }
        )

        expect(searchPeopleMock).toHaveBeenCalledWith({ search, org_id }, param)
        expect(result).toBe(people)
    })
})
