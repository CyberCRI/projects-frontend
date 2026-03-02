/**
 * Return array of query params
 */
export function withQuery(query?: Record<string, any>): [string, string][] {
  if (!query || Object.keys(query).length === 0) {
    return []
  }

  const searchParams = new URLSearchParams()

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(key, normalizeQueryValue(item))
      }
    } else {
      searchParams.set(key, normalizeQueryValue(value))
    }
  }
  const entries = Array.from(searchParams.entries()).toSorted(([aKey, aValue], [bKey, bValue]) => {
    if (aKey === bKey) {
      return aValue.toString().localeCompare(bValue.toString())
    }
    return aKey.toString().localeCompare(bKey.toString())
  })

  return entries
}

function normalizeQueryValue(value: any): string {
  if (value === null) {
    return ''
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}
