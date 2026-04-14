import { OrganizationModel } from '@/models/organization.model'
import { DEFAULT_ORGANIZATION_CODE } from '@/functs/constants'
export default {
  isValidMail(email) {
    // big bad regex to check mail string
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  },

  isValidUrl(string) {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  },

  editorCanEdit(wsData, mode) {
    // The first replace is here to check if we have an img or and iframe (video) only
    // We replace it with nothing because it doesn't matter what value it gets
    // The second replace is here to remove all the other HTML tags and only tags.
    // If the first doesn't remove anything, we will have an empty string
    // Or the tags content.
    if (mode === 'edit') {
      return (
        wsData.savedContent !== wsData.originalContent &&
        !!wsData.savedContent.replace(/<iframe|<img/gi, 'data').replace(/<[^>]+>/gi, '')
      )
    }

    return (
      !!wsData.savedContent &&
      !!wsData.savedContent.replace(/<iframe|<img/gi, 'data').replace(/<[^>]+>/gi, '')
    )
  },

  hasPermission(permissions, scope, action, pk?) {
    if (permissions[`${scope}.${action}`] && !pk) return permissions[`${scope}.${action}`]
    else if (pk) return permissions[`${scope}.${action}.${pk}`]
    return false
  },

  newSID(long = false) {
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const idLength = long ? 16 : 8
    let id = ''
    for (let i = 0; i < idLength; i++) {
      id += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
    }
    return id
  },

  isDefaultPortal(organizationCode?: OrganizationModel['code']): boolean {
    return (organizationCode ?? useOrganizationCode()) === DEFAULT_ORGANIZATION_CODE
  },

  setTokenForWS(token) {
    document.cookie = `token=${token}; path=/; Secure; SameSite=None`
  },

  getOrgsFromRoles(roles: string[] = []): string[] {
    // Filter roles that only contains an org e.g: '/ClientsAdmin' => ko, '/projects/organizations/CRI/administrators' => ok
    const rolesWithOrg = roles.filter((role) => role.split('/').length >= 4)

    // Map org and remove duplicate
    return [...new Set(rolesWithOrg.map((role) => role.split('/')[3]))]
  },

  adaptParam(params) {
    return {
      params: Object.entries(params)
        .map((entry) => [entry[0], Array.isArray(entry[1]) ? entry[1].join(',') : entry[1]])
        .reduce((acc, cur) => {
          const index = cur[0] as number

          acc[index] = cur[1]

          return acc
        }, {}),
    }
  },

  removePrefix(url) {
    const prefix = /^https?:\/\//i
    // remove any prefix
    url = url.replace(prefix, '')

    return url
  },

  isEmpty(obj) {
    return Object.keys(obj).length === 0
  },

  scrollTo(node) {
    if (!import.meta.client) return
    if (!node || !node.getBoundingClientRect) return
    const nodePosition = node.getBoundingClientRect().top
    const header = document.querySelector('#APP > .header')
    const headerSize = header ? header.getBoundingClientRect().height : 0
    window.scroll({
      left: 0,
      top: window.scrollY + nodePosition - headerSize,
      behavior: 'smooth',
    })
  },

  resetScroll() {
    if (!import.meta.client) return
    window.scroll(0, 0)
  },
}
