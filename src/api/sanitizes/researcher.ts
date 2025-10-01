export const sanitizeResearcherDocument = (data) => {
  data.results.forEach((el) => {
    if (el.publication_date) {
      el.publication_date = new Date(el.publication_date)
    }
  })
  return data
}

export const sanitizeResearcherDocumentAnalytics = (data: Array) => {
  data.years.forEach((el) => {
    el.year = new Date(el.year).getFullYear()
  })

  data.years = data.years.reverse()
  return data
}
