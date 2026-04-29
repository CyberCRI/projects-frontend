import type { HarvesterType, Identifier } from '~/interfaces/researcher'

const cleanIdentifier = (identifier: Identifier): Identifier => {
  const newIdentifier = { ...identifier }
  newIdentifier.harvester = newIdentifier.harvester.toLocaleLowerCase() as HarvesterType
  // some value starts with http or start with harvester name like
  // hal-http://hal.com....
  // so we remove the first harvest-
  if (newIdentifier.value.startsWith(`${newIdentifier.harvester}-`)) {
    newIdentifier.value = newIdentifier.value.replace(`${newIdentifier.harvester}-`, '')
  }
  return newIdentifier
}

/**
 * sanitize harvester url to "correct" url
 *
 * @function
 * @name documentHarvesterToUrl
 * @kind variable
 * @param {Identifier} identifier
 * @returns {String}
 * @exports
 */
export const documentHarvesterToUrl = (identifier: Identifier): string | null => {
  const newIdentifier = cleanIdentifier(identifier)
  if (newIdentifier.value.startsWith('http')) {
    return newIdentifier.value
  }
  const value = encodeURIComponent(newIdentifier.value)

  switch (newIdentifier.harvester) {
    case 'irstea':
      return `https://www.iamm.ciheam.org/ress_doc/opac_css/index.php?lvl=notice_display&id=${value}`
    case 'pmid':
      return `https://pubmed.ncbi.nlm.nih.gov/${value}/`
    case 'pmcid':
      return `https://pmc.ncbi.nlm.nih.gov/articles/${value}/`
    case 'biorxiv':
      // TODO check slash
      return `https://www.biorxiv.org/content/${value}`
    case 'arxiv':
      return `https://arxiv.org/abs/${value}`
    case 'viaf':
      return `https://viaf.org/fr/viaf/${value}`
    case 'googlescholar':
      return `https://scholar.google.com/citations?view_op=view_citation&citation_for_view=${value}`
    case 'scopus':
      return `https://www.scopus.com/authid/detail.uri?authorId=${value}`
    case 'hal':
      return `https://hal.science/${value}`
    case 'scanr':
      return `https://scanr.enseignementsup-recherche.gouv.fr/publications/${value}`
    case 'idref':
      return `https://www.idref.fr/${value}`
    case 'doi':
      return `https://doi.org/${value}`
    case 'uri':
      return identifier.value
    default:
      return null
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
export const researcherHarvesterToUrl = (identifier: Identifier): string | null => {
  const newIdentifier = cleanIdentifier(identifier)
  if (newIdentifier.value.startsWith('http')) {
    return newIdentifier.value
  }
  const value = encodeURIComponent(newIdentifier.value)

  switch (newIdentifier.harvester) {
    case 'viaf':
      return `https://viaf.org/fr/viaf/${value}`
    case 'googlescholar':
      return `https://scholar.google.com/citations?user=${value}`
    case 'scopus':
      return `https://www.scopus.com/authid/detail.uri?authorId=${value}`
    case 'hal':
      return `https://hal.science/${value}`
    case 'idhals':
      return `https://hal.science/search/index/q/*/authIdHal_s/${value}`
    case 'scanr':
      return `https://scanr.enseignementsup-recherche.gouv.fr/author/${value}`
    case 'orcid':
      return `https://orcid.org/${value}`
    case 'idref':
      return `https://www.idref.fr/${value}`
    default:
      return null
  }
}
