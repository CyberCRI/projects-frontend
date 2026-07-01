import { getExtensions } from '~/components/base/form/TextEditor/useTipTap'
import { generateHTML, generateJSON } from '@tiptap/core'
import { isNil } from 'es-toolkit'

/**
 * convert html string to html string (converted from tiptap to have same output )
 *
 * @function
 * @name html2html
 * @kind variable
 * @param {string} html
 * @returns {string}
 * @exports
 */
export const html2html = onClient((html: string | null): string => {
  if (!html) {
    return ''
  }

  // get tiptap extentions
  const extentions = getExtensions()

  // generate jsondoc
  const doc = generateJSON(html, extentions)

  // convert jsondoc to html
  return generateHTML(doc, extentions).trim()
}, '')

/**
 * convert html string based to text string (without html tags)
 *
 * @function
 * @name html2Text
 * @kind variable
 * @param {string} text
 * @returns {string}
 * @exports
 */
export const html2Text = (text: string): string => {
  if (!import.meta.client) {
    return ''
  }
  const span = document.createElement('span')
  span.innerHTML = text || ''
  return span.innerText.trim()
}

/**
 * check if text is empty (from html context like "<p></p>")
 *
 * @function
 * @name textIsEmpty
 * @kind variable
 * @param {string} text
 * @returns {boolean}
 * @exports
 */
export const textIsEmpty = (text: string | null): boolean => {
  if (isNil(text)) {
    return true
  }
  return html2Text(text).trim() === ''
}

/**
 * get first text is not empty (html content string)
 *  or return empty string
 *
 * @function
 * @name getFirstTextNotEmpty
 * @kind variable
 * @param {string[]} texts
 * @returns {string}
 * @exports
 */
export const getFirstTextNotEmpty = (texts: (string | null)[]): string => {
  return texts.find((text) => !textIsEmpty(text)) || ''
}
