import { describe, it, expect } from 'vitest'
import { useQuery } from '@/composables/useQuery'

describe('useQuery', () => {
  it('method', async () => {
    const { setQuery, toogleQuery, removeQuery, query } = useQuery()

    expect(query).toEqual({})
    setQuery('role', 'author')
    expect(query).toEqual({ role: 'author' })
    setQuery('role', 'thesis')
    expect(query).toEqual({ role: 'thesis' })

    removeQuery('role')
    expect(query).toEqual({})

    // remove not exists keys
    removeQuery('notexists')
    expect(query).toEqual({})

    // remove not exists keys
    expect(query).toEqual({})
    toogleQuery('role', 'author')
    expect(query).toEqual({ role: 'author' })
    toogleQuery('role', 'thesis')
    expect(query).toEqual({ role: 'thesis' })
    toogleQuery('role', 'thesis')
    expect(query).toEqual({})
  })
})
