import { cropIfTooLong, html2Text, textIsEmpty } from '@/functs/string'
import { describe, expect, it } from 'vitest'

describe('string.ts', () => {
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

  it('cropIfTooLong', () => {
    expect(cropIfTooLong(undefined, 5)).toEqual('')
    expect(cropIfTooLong(null, 5)).toEqual('')
    expect(cropIfTooLong('', 5)).toEqual('')
    expect(cropIfTooLong('salut ça va', 5)).toEqual('salut...')
    expect(cropIfTooLong('salut ca', 5)).toEqual('salut...')
    expect(cropIfTooLong('salut', 5)).toEqual('salut')
  })
})
