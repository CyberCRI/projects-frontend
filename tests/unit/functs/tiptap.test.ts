import { html2Text, textIsEmpty } from '~/functs/tiptap'
import { describe, expect, it } from 'vitest'

describe('tiptaps.ts', () => {
  it('html2Text', () => {
    expect(html2Text(undefined)).toEqual('')
    expect(html2Text(null)).toEqual('')
    expect(html2Text('')).toEqual('')
    expect(html2Text('     ')).toEqual('     ')
    expect(html2Text('<p></p>')).toEqual('')
    expect(html2Text('<p>     </p>')).toBe('     ')
    expect(html2Text('<p>   <span> <div></div></span>  </p>')).toEqual('      ')
    expect(html2Text('a text')).toEqual('a text')
    expect(html2Text('<p>text</p>')).toEqual('text')
    expect(html2Text('<p>text<span>sub<span>text</span></span></p>')).toEqual('textsubtext')
  })

  it('textIsEmpty', () => {
    expect(textIsEmpty(undefined)).toBe(true)
    expect(textIsEmpty(null)).toBe(true)
    expect(textIsEmpty('')).toBe(true)
    expect(textIsEmpty('     ')).toBe(true)
    expect(textIsEmpty('<p></p>')).toBe(true)
    expect(textIsEmpty('<p>     </p>')).toBe(true)
    expect(textIsEmpty('<p>   <span> <div></div></span>  </p>')).toBe(true)
    expect(textIsEmpty('a text')).toBe(false)
    expect(textIsEmpty('<p>text</p>')).toBe(false)
  })
})
