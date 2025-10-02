type Identifier = {
  value: string
  harvester: 'hal' | 'scanr' | 'openalex' | 'idref' | 'scopus' | 'orcid' | 'local'
}

/**
 * sanitize harvester url to "correct" url
 *
 * @function
 * @name harvesterToUrl
 * @kind variable
 * @param {Identifier} identifier
 * @returns {String}
 * @exports
 */
export const harvesterToUrl = (identifier: Identifier): string => {
  // some value starts with http or start with harvester name like
  // hal-http://hal.com....
  // so we remove the first harvest-
  if (
    identifier.value.startsWith('http') ||
    identifier.value.startsWith(`${identifier.harvester}-http`)
  ) {
    return identifier.value.replace(`${identifier.harvester}-`, '')
  }
  if (identifier.harvester === 'hal') {
    return `https://hal.science/${identifier.value.replace('hal-', '')}v1`
  }
  if (identifier.harvester === 'scanr') {
    return `https://scanr.enseignementsup-recherche.gouv.fr/publications/${identifier.value}`
  }
  if (identifier.harvester === 'openalex') {
    return identifier.value.replace('openalex-', '')
  }
  return identifier.value
}
