import { usePatatoids } from '@/composables/usePatatoids'
import { describe, it, expect } from 'vitest'

describe('usePatatoids', () => {
  it('usePatatoids', () => {
    const patatoids = usePatatoids()
    expect(Array.isArray(patatoids)).toBe(true)
    patatoids.forEach((el) => {
      expect(typeof el).toEqual('string')
    })
  })
})
