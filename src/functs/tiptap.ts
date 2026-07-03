import type { ProviderParams } from '~/interfaces/colaboratives'
import { getExtensions } from '~/composables/tiptap/options'
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
  html = (html || '').trim()
  if (!html) {
    return ''
  }

  // get tiptap extentions
  const extentions = getExtensions()

  // generate jsondoc
  const doc = generateJSON(html, extentions)

  // convert jsondoc to html
  return generateHTML(doc, extentions)
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
  return span.innerText
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

/**
 * genereate roomRoomKey form params provided to hocuspocus
 *
 * @function
 * @name roomKeyFromParams
 * @kind variable
 * @param {ProviderParams} params
 * @returns {string | null}
 * @exports
 */
export const roomKeyFromParams = (params: ProviderParams): string | null => {
  const keys: [string, string | number][] = [['Organization', params.organizationId]]

  switch (params.type) {
    case 'project-description': {
      keys.push(['Project', params.projectId])
      break
    }
    case 'project-blog': {
      keys.push(['Project', params.projectId], ['Blog', params.blogId])
      break
    }
    case 'project-tab': {
      keys.push(['Project', params.projectId], ['Tab', params.tabId])
      break
    }
    case 'project-tab-item': {
      keys.push(['Project', params.projectId], ['Tab', params.tabId], ['Item', params.tabItemId])
      break
    }
    case 'project-goal': {
      keys.push(['Project', params.projectId], ['Goal', params.goalId])
      break
    }
    default:
      return null
  }

  return keys
    .map(([name, value]) => {
      return `${name}(${value})`
    })
    .join('::')
}
