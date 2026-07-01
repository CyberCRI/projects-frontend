import { cropIfTooLong } from '~/functs/string'
import { describe, expect, it } from 'vitest'

describe('string.ts', () => {
  it('cropIfTooLong', () => {
    expect(cropIfTooLong(undefined, 5)).toEqual('')
    expect(cropIfTooLong(null, 5)).toEqual('')
    expect(cropIfTooLong('', 5)).toEqual('')
    expect(cropIfTooLong('salut ça va', 5)).toEqual('salut...')
    expect(cropIfTooLong('salut ca', 5)).toEqual('salut...')
    expect(cropIfTooLong('salut', 5)).toEqual('salut')
  })
})
