import { useQuery } from '~/composables/useQuery'
import { describe, it, expect } from 'vitest'

describe('useQuery', () => {
  it('method', async () => {
    const { setQuery, toggleQuery, removeQuery, query } = useQuery()

    expect(query.value).toEqual({})
    setQuery('role', 'author')
    expect(query.value).toEqual({ role: 'author' })
    setQuery('role', 'thesis')
    expect(query.value).toEqual({ role: 'thesis' })

    removeQuery('role')
    expect(query.value).toEqual({})

    // remove not exists keys
    removeQuery('notexists')
    expect(query.value).toEqual({})

    // remove not exists keys
    expect(query.value).toEqual({})
    toggleQuery('role', 'author')
    expect(query.value).toEqual({ role: 'author' })
    toggleQuery('role', 'thesis')
    expect(query.value).toEqual({ role: 'thesis' })
    toggleQuery('role', 'thesis')
    expect(query.value).toEqual({})
  })
})
