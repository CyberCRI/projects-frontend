import filterSpcialTagFactory from '~/server/utils/filter-special-tag'
import { describe, it, expect, vi } from 'vitest'

describe('filterSpecialTag', () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it('should retrun same string if it didnt contain the tag', async () => {
    const filterTag = filterSpcialTagFactory('mytag')
    const chunks = ['Hello world']
    let res = ''
    for (const chunk of chunks) {
      res += filterTag(chunk)
    }

    expect(res).toEqual(chunks.join(''))
  })

  it('should filter out the tag and ts content', async () => {
    const filterTag = filterSpcialTagFactory('mytag')
    const chunks = ['Hello <mytag>do not show me</mytag>world']
    let res = ''
    for (const chunk of chunks) {
      res += filterTag(chunk)
    }

    expect(res).toEqual('Hello world')
  })

  it('should filter out multiple occurence of the tag and ts content', async () => {
    const filterTag = filterSpcialTagFactory('mytag')
    const chunks = ['Hello <mytag>do not show me</mytag>world <mytag>do not show me</mytag>again']
    let res = ''
    for (const chunk of chunks) {
      res += filterTag(chunk)
    }

    expect(res).toEqual('Hello world again')
  })

  it('should filter out with break iside the tag', async () => {
    const filterTag = filterSpcialTagFactory('mytag')
    const chunks = [
      'Hello <my',
      'tag>do not show ',
      'me</mytag',
      '>world <mytag>do not show me</my',
      'tag>again',
    ]
    let res = ''
    for (const chunk of chunks) {
      res += filterTag(chunk)
    }

    expect(res).toEqual('Hello world again')
  })
})
