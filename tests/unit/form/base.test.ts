import { describe, expect, it } from 'vitest'
import { formEqual } from '~/form/base'

describe('test form utils', () => {
  it('test empty', () => {
    const a = {}
    const b = {}
    expect(formEqual(a, b)).toEqual(true)
  })

  it('test keys equal', () => {
    const a = { title: 'value-title' }
    const b = { title: 'value-title' }
    expect(formEqual(a, b)).toEqual(true)
  })

  it('test not keys equal', () => {
    const a = { title: 'value-title' }
    const b = { title: 'not-title' }
    expect(formEqual(a, b)).toEqual(false)
  })

  it('test missing keys', () => {
    const a = { title: 'value-title' }
    const b = { description: 'value-title' }
    expect(formEqual(a, b)).toEqual(false)
  })

  it('test empty array', () => {
    const a = { category: [] }
    const b = { category: [] }
    expect(formEqual(a, b)).toEqual(true)
  })

  it('test array', () => {
    const a = { category: [1, 2, 'val'] }
    const b = { category: [1, 2, 'val'] }
    expect(formEqual(a, b)).toEqual(true)
  })

  it('test missing array val', () => {
    const a = { category: [1, 2, 'val'] }
    const b = { category: [1, 'val'] }
    expect(formEqual(a, b)).toEqual(false)
  })

  it('test exclude', () => {
    const a = { title: 'value-title', description: null }
    const b = { title: 'value-title', description: '<p></p>' }
    expect(formEqual(a, b, { exclude: ['description'] })).toEqual(true)
  })

  it('test html', () => {
    const a = { title: 'value-title', description: '   <p></p>' }
    const b = { title: 'value-title', description: '<p></p>' }
    expect(formEqual(a, b, { html: ['description'] })).toEqual(true)
  })
})
