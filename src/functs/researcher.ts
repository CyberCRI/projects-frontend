import type { Identifier, Researcher } from '@/iterfaces/researcher'

const cleanHarvesterValue = (identifier: Identifier): Identifier => {
  const newIdentifer = { ...identifier }
  // some value starts with http or start with harvester name like
  // hal-http://hal.com....
  // so we remove the first harvest-
  newIdentifer.value = newIdentifer.value.replace(`${newIdentifer.harvester}-`, '')
  return newIdentifer
}

/**
 * sanitize harvester url to "correct" url
 *
 * @function
 * @name publicationHarvesterToUrl
 * @kind variable
 * @param {Identifier} identifier
 * @returns {String}
 * @exports
 */
export const publicationHarvesterToUrl = (identifier: Identifier): string => {
  const iden = cleanHarvesterValue(identifier)
  if (iden.value.startsWith('http')) {
    return iden.value
  }

  // esapce uri chars
  const value = encodeURIComponent(iden.value)
  switch (identifier.harvester) {
    case 'hal':
      return `https://hal.science/${value}`
    case 'scanr':
      return `https://scanr.enseignementsup-recherche.gouv.fr/publications/${value}`
    case 'idref': {
      // TODO(remi): check with crisalid why we need to add "0"
      const idref = value.padStart(9, '0')
      return `https://www.idref.fr/${idref}`
    }
    case 'doi': {
      return `https://doi.org/${value}`
    }
    default:
      return value
  }
}

/**
 * generate url fro researcher from their identifiers
 *
 * @function
 * @name researcherHarvesterToUrl
 * @kind variable
 * @param {Author} author
 * @returns {string}
 * @exports
 */
export const researcherHarvesterToUrl = (author: Researcher): string => {
  const urls = author.identifiers.map((identifier) => {
    const iden = cleanHarvesterValue(identifier)
    if (iden.value.startsWith('http')) {
      return iden.value
    }
    // esapce uri chars
    const value = encodeURIComponent(iden.value)
    switch (identifier.harvester) {
      case 'hal':
        return `https://hal.science/${value}`
      case 'scanr':
        return `https://scanr.enseignementsup-recherche.gouv.fr/author/${value}`
      case 'orcid':
        return `https://orcid.org/${value}`
      case 'idref': {
        // TODO(remi): check with crisalid why we need to add "0"
        const idref = value.padStart(9, '0')
        return `https://www.idref.fr/${idref}`
      }
    }
  })
  // TODO(remi): need priority ?
  // remove undefined/null
  return urls.filter((v) => v)[0]
}

/**
 * identifier to docTypeUrl
 *
 * @function
 * @name documentTypeHarverToUrl
 * @kind variable
 * @param {String} docType
 * @param {Identifier} identifier
 * @returns {string}
 * @exports
 */
export const documentTypeHarverToUrl = (docType: string, identifier: Identifier) => {
  switch (docType) {
    case 'publications':
      return publicationHarvesterToUrl(identifier)
    default:
      throw new Error(`docType ${docType} is not already enabled`)
  }
}
