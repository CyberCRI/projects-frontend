import { usePatatoids } from '~/composables/usePatatoids'
import { describe, it, expectTypeOf } from 'vitest'

describe('usePatatoids', () => {
  it('usePatatoids', () => {
    const patatoids = usePatatoids()
    expectTypeOf(patatoids).toEqualTypeOf<string[]>()
  })
})
