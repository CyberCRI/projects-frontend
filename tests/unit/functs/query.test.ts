import { describe, expect, it } from 'vitest'
import { withQuery } from '~/functs/query'
describe('withQuery', () => {
  it('empty query', () => {
    expect(withQuery(null)).toEqual([])
    expect(withQuery(undefined)).toEqual([])
    expect(withQuery({})).toEqual([])
  })

  it('string query', () => {
    expect(
      withQuery({
        search: 'asearch',
      })
    ).toEqual([['search', 'asearch']])
  })
  it('number query', () => {
    expect(
      withQuery({
        page: 42,
      })
    ).toEqual([['page', '42']])
  })
  it('boolean query', () => {
    expect(
      withQuery({
        user: true,
      })
    ).toEqual([['user', 'true']])
  })
  it('array query', () => {
    expect(
      withQuery({
        modules: ['members', 'subgroups'],
      })
    ).toEqual([
      ['modules', 'members'],
      ['modules', 'subgroups'],
    ])
  })
})
